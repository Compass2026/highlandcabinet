#!/usr/bin/env node
/**
 * End-to-end test of lead delivery against the built app (`next build` first). Starts mock SendGrid and
 * webhook endpoints, runs `next start` pointed at them, submits every form variant through /api/lead and
 * checks what each destination actually received, plus the failure paths:
 *   - both destinations accept            → "sent" with a reference; email + signed webhook received
 *   - email fails, webhook accepts        → still "sent" (the lead reached Highland)
 *   - every destination fails             → "error" (never a false "sent")
 *   - nothing configured                  → "not-configured"
 *   - x-lead-test token                   → subject marked [TEST — please ignore]
 *   - honeypot                            → answered "sent" with no reference, nothing delivered
 */
import { spawn } from "node:child_process";
import { createHash, createHmac } from "node:crypto";
import http from "node:http";
import path from "node:path";
import { writeFile } from "node:fs/promises";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail: ok ? "" : String(detail).slice(0, 300) });

let mode = { email: 202, webhook: 200 };
const got = { email: [], webhook: [] };
const mock = http.createServer((req, res) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    const kind = req.url.startsWith("/sendgrid") ? "email" : "webhook";
    got[kind].push({ headers: req.headers, body: b });
    res.writeHead(mode[kind]).end(mode[kind] < 300 ? "" : '{"errors":[{"message":"mock failure"}]}');
  });
});
await new Promise((r) => mock.listen(4010, r));

async function app(port, env) {
  const p = spawn("npx", ["next", "start", "-p", String(port)], { cwd: root, env: { ...process.env, ...env }, stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try { await fetch(`http://localhost:${port}/api/lead/`); return p; } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
  throw new Error("app did not start");
}

const full = {
  SENDGRID_API_KEY: "SG.test", SENDGRID_API_URL: "http://localhost:4010/sendgrid",
  LEAD_EMAIL_TO: "Sales <sales@example.com>, owner@example.com", LEAD_EMAIL_FROM: "Highland Cabinetry Website <website@highlandcabinetry.com>",
  LEAD_WEBHOOK_URL: "http://localhost:4010/webhook", LEAD_WEBHOOK_SECRET: "s3cret", LEAD_TEST_TOKEN_SHA256: createHash("sha256").update("tok-123").digest("hex"),
};
const contact = { firstName: "Dana", lastName: "Builder", email: "dana@example.com", phone: "602-555-0100" };
const leads = {
  quote: { ...contact, projectType: "Kitchen", units: "4", timeline: "Ready to order", company: "Builder Co", customerType: "General contractor", location: "Mesa, AZ", einRoc: "Yes", message: "Four kitchens <b>now</b>", finishId: "shaker-luxe" },
  "dealer-application": { ...contact, company: "Builder Co", customerType: "Cabinet dealer / supplier", location: "Tucson, AZ", einRoc: "Yes", volume: "6–15 kitchens" },
  "dealer-referral": { ...contact, location: "85004", projectType: "Kitchen" },
  contact: { ...contact, customerType: "Remodeler", message: "Question about lead times" },
};
const attribution = JSON.stringify({ first: { params: { gclid: "G-123", utm_campaign: "luxe-az" }, landing: "/new-luxe-shaker-arizona/", referrer: "https://www.google.com/", at: "2026-11-24T10:00:00Z" }, last: null });
const post = (port, body, headers = {}) =>
  fetch(`http://localhost:${port}/api/lead/`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) }).then(async (r) => ({ http: r.status, ...(await r.json()) }));

const a = await app(3005, full);
try {
  for (const [formType, fields] of Object.entries(leads)) {
    got.email.length = got.webhook.length = 0;
    const r = await post(3005, { ...fields, formType, source: "test", page: "/test/", attribution });
    check(`${formType}: sent with reference`, r.status === "sent" && /^HC-/.test(r.ref ?? ""), JSON.stringify(r));
    const mail = got.email[0] && JSON.parse(got.email[0].body);
    const hook = got.webhook[0];
    check(`${formType}: email received`, mail, "none");
    check(`${formType}: webhook received`, hook, "none");
    if (mail) {
      check(`${formType}: email to both recipients, reply-to visitor`, mail.personalizations[0].to.length === 2 && mail.reply_to?.email === "dana@example.com" && mail.from.email === "website@highlandcabinetry.com", JSON.stringify(mail).slice(0, 200));
      check(`${formType}: email carries reference and attribution`, mail.content[0].value.includes(r.ref) && mail.content[0].value.includes("gclid=G-123"));
      check(`${formType}: email HTML escapes input`, !mail.content[1].value.includes("<b>now</b>"));
      check(`${formType}: email authenticated with API key`, got.email[0].headers.authorization === "Bearer SG.test");
    }
    if (hook) {
      const sig = createHmac("sha256", "s3cret").update(hook.body).digest("hex");
      check(`${formType}: webhook signed (HMAC)`, hook.headers["x-highland-signature"] === sig);
      const j = JSON.parse(hook.body);
      check(`${formType}: webhook payload complete`, j.ref === r.ref && j.formType === formType && j.fields.length >= 4 && j.attribution?.first?.params?.gclid === "G-123" && j.test === false);
    }
  }
  const q = leads.quote;
  got.email.length = 0;
  let r = await post(3005, { ...q, formType: "quote" }, { "x-lead-test": "tok-123" });
  check("test token marks the lead as a test", r.status === "sent" && JSON.parse(got.email[0].body).subject.startsWith("[TEST"));
  got.email.length = 0;
  r = await post(3005, { ...q, formType: "quote" }, { "x-lead-test": "wrong" });
  check("wrong test token is a normal lead", !JSON.parse(got.email[0].body).subject.startsWith("[TEST"));
  const probe = await (await fetch("http://localhost:3005/api/lead/", { headers: { "x-lead-test": "tok-123" } })).json();
  check("readiness probe lists destinations (token only)", JSON.stringify(probe.destinations) === '["email","webhook"]');
  const anon = await (await fetch("http://localhost:3005/api/lead/")).json();
  check("readiness probe hides destinations without token", !anon.destinations);
  got.email.length = got.webhook.length = 0;
  r = await post(3005, { ...q, formType: "quote", website: "http://spam" });
  check("honeypot: no reference, nothing delivered", r.status === "sent" && !r.ref && !got.email.length && !got.webhook.length);
  r = await post(3005, { formType: "quote", firstName: "x" });
  check("invalid lead rejected with field errors", r.status === "invalid" && r.errors.email);
  mode = { email: 500, webhook: 200 };
  r = await post(3005, { ...q, formType: "quote" });
  check("email down, webhook up → still sent", r.status === "sent");
  mode = { email: 500, webhook: 503 };
  r = await post(3005, { ...q, formType: "quote" });
  check("every destination down → error, never sent", r.status === "error" && r.http === 502);
  // Plain HTML form post (no JavaScript) → redirect back with status.
  mode = { email: 202, webhook: 200 };
  const form = new URLSearchParams({ ...q, formType: "quote", returnTo: "/request-a-quote/" });
  const nojs = await fetch("http://localhost:3005/api/lead/", { method: "POST", body: form, redirect: "manual" });
  check("no-JavaScript form post redirects with status=sent", nojs.status === 303 && nojs.headers.get("location").includes("status=sent"));
} finally {
  a.kill();
}

const b = await app(3006, {});
try {
  const r = await post(3006, { ...leads.contact, formType: "contact" });
  check("nothing configured → not-configured", r.status === "not-configured" && r.http === 503);
} finally {
  b.kill();
  mock.close();
}

const failures = results.filter((r) => !r.ok);
await writeFile(path.join(root, "docs/launch/lead-delivery-test.json"), JSON.stringify({ at: new Date().toISOString(), checks: results, failureCount: failures.length }, null, 2) + "\n");
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  — ${r.detail}` : ""}`);
console.log(`${failures.length} failures / ${results.length}`);
process.exit(failures.length ? 1 : 0);
