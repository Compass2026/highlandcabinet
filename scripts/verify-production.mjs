#!/usr/bin/env node
/**
 * Verification on the real production domain, run right after DNS points at Vercel.
 *
 *   node scripts/verify-production.mjs --baseline        # BEFORE cutover: record current DNS (mail, SPF, DKIM, DMARC…)
 *   LEAD_TEST_TOKEN=… node scripts/verify-production.mjs # AFTER cutover: full verification
 *
 * Checks, in order:
 *  1. DNS — apex and www resolve; mail-related records (MX, SPF, DKIM, DMARC, Google verification) are
 *     exactly as recorded in the baseline, so email and Search Console are unaffected by the switch.
 *  2. HTTPS — valid certificate, served by Vercel; http:// and www. redirect permanently to https://apex.
 *  3. SEO gate — scripts/test-launch-seo.mjs against the live domain (indexable, canonicals, sitemap…).
 *  4. URL migration — scripts/test-migration.mjs against the live domain (every old URL + internal link).
 *  5. Tracking — scripts/verify-tracking.mjs on the live domain (tags, conversions; nothing recorded).
 *  6. Lead delivery — with LEAD_TEST_TOKEN: destinations configured, and one clearly-marked test lead
 *     delivered (status "sent" + reference). Confirm it arrived in the sales inbox / CRM by its reference.
 * Report: docs/launch/production-verification.json
 */
import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = (process.env.SITE ?? "https://highlandcabinetry.com").replace(/\/$/, "");
const apex = new URL(SITE).hostname;
const baselineFile = path.join(root, "docs/launch/dns-baseline.json");
const MAIL_RECORDS = [
  [apex, "MX"],
  [apex, "TXT"],
  [`_dmarc.${apex}`, "TXT"],
  [`selector1._domainkey.${apex}`, "CNAME"],
  [`selector2._domainkey.${apex}`, "CNAME"],
  [`s1._domainkey.${apex}`, "CNAME"],
  [`s2._domainkey.${apex}`, "CNAME"],
  [`autodiscover.${apex}`, "CNAME"],
];

async function dns(name, type) {
  const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`);
  const j = await r.json();
  const want = { A: 1, CNAME: 5, MX: 15, TXT: 16, NS: 2, AAAA: 28 }[type];
  return (j.Answer ?? []).filter((a) => a.type === want).map((a) => a.data).sort();
}

if (process.argv.includes("--baseline")) {
  const records = {};
  for (const [n, t] of [...MAIL_RECORDS, [apex, "NS"], [apex, "A"], [`www.${apex}`, "CNAME"], [`www.${apex}`, "A"]]) records[`${n} ${t}`] = await dns(n, t);
  await writeFile(baselineFile, JSON.stringify({ recordedAt: new Date().toISOString(), records }, null, 2) + "\n");
  console.log(JSON.stringify(records, null, 1));
  process.exit(0);
}

const results = [];
const check = (group, name, ok, detail = "") => results.push({ group, name, ok: !!ok, detail: String(detail).slice(0, 400) });

// 1. DNS
const baseline = JSON.parse(await readFile(baselineFile, "utf8"));
const a = await dns(apex, "A");
check("dns", `${apex} resolves`, a.length, a.join(", "));
for (const [n, t] of MAIL_RECORDS) {
  const now = await dns(n, t);
  const was = baseline.records[`${n} ${t}`] ?? [];
  check("dns", `${n} ${t} unchanged since baseline`, JSON.stringify(now) === JSON.stringify(was), `now ${JSON.stringify(now)} · baseline ${JSON.stringify(was)}`);
}

// 2. HTTPS, host and scheme redirects
try {
  const r = await fetch(`${SITE}/`, { redirect: "manual" });
  check("https", "apex answers 200 over valid HTTPS", r.status === 200, r.status);
  check("https", "served by Vercel", /vercel/i.test(r.headers.get("server") ?? ""), r.headers.get("server"));
  check("https", "HSTS header present", !!r.headers.get("strict-transport-security"));
} catch (e) {
  check("https", "apex answers over valid HTTPS", false, e.cause?.code ?? e.message);
}
for (const from of [`http://${apex}/contact-us/`, `https://www.${apex}/contact-us/`, `http://www.${apex}/contact-us/`]) {
  try {
    let url = from, hops = 0, r;
    do {
      r = await fetch(url, { redirect: "manual" });
      if (r.status >= 300 && r.status < 400) url = new URL(r.headers.get("location"), url).href;
      hops++;
    } while (r.status >= 300 && r.status < 400 && hops < 4);
    check("https", `${from} → ${SITE}/contact-us/`, url === `${SITE}/contact-us/` && r.status === 200 && hops <= 3, `${url} (${r.status}, ${hops} hops)`);
  } catch (e) {
    check("https", `${from} redirects`, false, e.cause?.code ?? e.message);
  }
}

// 3–5. Existing suites against the live domain
const run = (script, env) => {
  const p = spawnSync("node", [path.join(root, "scripts", script)], { env: { ...process.env, ...env }, encoding: "utf8", timeout: 900_000 });
  return { ok: p.status === 0, tail: (p.stdout + p.stderr).trim().split("\n").slice(-6).join(" | ") };
};
const seo = run("test-launch-seo.mjs", { BASE: SITE, ORIGIN: SITE });
check("seo", "launch SEO gate (indexable, canonical, sitemap, no review text, tags on)", seo.ok, seo.tail);
const mig = run("test-migration.mjs", { BASE: SITE });
check("migration", "every old URL and internal link", mig.ok, mig.tail);
const trk = run("verify-tracking.mjs", { SITE });
check("tracking", "tags load and conversions fire (nothing recorded)", trk.ok, trk.tail);

// 6. Lead delivery
const token = process.env.LEAD_TEST_TOKEN;
if (!token) {
  check("leads", "LEAD_TEST_TOKEN provided for the delivery test", false, "set LEAD_TEST_TOKEN to the value configured on the production deployment");
} else {
  const probe = await (await fetch(`${SITE}/api/lead/`, { headers: { "x-lead-test": token } })).json();
  check("leads", "email destination configured", probe.destinations?.includes("email"), JSON.stringify(probe));
  const r = await fetch(`${SITE}/api/lead/`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-lead-test": token },
    body: JSON.stringify({
      formType: "contact",
      firstName: "Launch",
      lastName: "Verification",
      email: process.env.TEST_LEAD_EMAIL ?? "launch-verification@example.com",
      phone: "602-555-0100",
      customerType: "Other",
      message: "Automated launch verification. Please ignore — no reply needed.",
      source: "verify-production",
      page: "/verify-production/",
    }),
  });
  const j = await r.json();
  check("leads", "test lead delivered (sent + reference)", j.status === "sent" && j.ref, JSON.stringify(j));
  if (j.ref) console.log(`\nTest lead reference: ${j.ref} — confirm it arrived (subject starts “[TEST — please ignore]”).\n`);
}

const failures = results.filter((r) => !r.ok);
await writeFile(
  path.join(root, "docs/launch/production-verification.json"),
  JSON.stringify({ site: SITE, at: new Date().toISOString(), checks: results, failureCount: failures.length }, null, 2) + "\n",
);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  [${r.group}] ${r.name}${r.ok ? "" : `  — ${r.detail}`}`);
console.log(`${failures.length} failures / ${results.length}`);
process.exit(failures.length ? 1 : 0);
