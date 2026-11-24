import { createHmac } from "node:crypto";

/**
 * Lead delivery. Each configured destination is tried; a lead counts as delivered when at least one
 * destination accepts it (2xx). Failures are logged so they show up in the deployment's logs.
 *
 * Destinations (environment variables, server-side only):
 * - Email via SendGrid — SENDGRID_API_KEY, LEAD_EMAIL_TO (comma-separated), LEAD_EMAIL_FROM.
 *   highlandcabinetry.com already authenticates SendGrid (SPF include + s1._domainkey), which is how
 *   the previous WordPress forms sent their notifications.
 * - Webhook — LEAD_WEBHOOK_URL, optional LEAD_WEBHOOK_SECRET (HMAC-SHA256 in x-highland-signature).
 */

export interface Lead {
  ref: string;
  test: boolean;
  formType: string;
  formTitle: string;
  submittedAt: string;
  source: string | null;
  page: string | null;
  collection: { id: string; name: string; line: string; url: string } | null;
  fields: { name: string; label: string; value: string }[];
  attribution: unknown;
}

export interface DeliveryReport {
  configured: string[];
  delivered: string[];
  failed: { destination: string; detail: string }[];
}

const TIMEOUT = 10_000;

export function configuredDestinations(): string[] {
  const d: string[] = [];
  if (process.env.SENDGRID_API_KEY && process.env.LEAD_EMAIL_TO && process.env.LEAD_EMAIL_FROM) d.push("email");
  if (process.env.LEAD_WEBHOOK_URL) d.push("webhook");
  return d;
}

export async function deliverLead(lead: Lead): Promise<DeliveryReport> {
  const configured = configuredDestinations();
  const report: DeliveryReport = { configured, delivered: [], failed: [] };
  const attempts = configured.map(async (dest) => {
    try {
      if (dest === "email") await sendEmail(lead);
      else await postWebhook(lead);
      report.delivered.push(dest);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      report.failed.push({ destination: dest, detail });
      console.error(`[lead ${lead.ref}] ${dest} delivery failed: ${detail}`);
    }
  });
  await Promise.all(attempts);
  return report;
}

async function postWebhook(lead: Lead) {
  const payload = JSON.stringify(lead);
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.LEAD_WEBHOOK_SECRET) {
    headers["x-highland-signature"] = createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET).update(payload).digest("hex");
  }
  const res = await fetch(process.env.LEAD_WEBHOOK_URL!, { method: "POST", headers, body: payload, signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`webhook answered ${res.status}`);
}

/** "Name <a@b.c>" or "a@b.c" → SendGrid address object. */
function address(s: string) {
  const m = s.trim().match(/^(.*)<([^>]+)>$/);
  return m ? { email: m[2].trim(), name: m[1].trim().replace(/^"|"$/g, "") } : { email: s.trim() };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function emailContent(lead: Lead) {
  const get = (n: string) => lead.fields.find((f) => f.name === n)?.value ?? "";
  const who = [`${get("firstName")} ${get("lastName")}`.trim(), get("company")].filter(Boolean).join(", ");
  const where = get("location");
  const subject =
    `${lead.test ? "[TEST — please ignore] " : ""}${lead.formTitle}${lead.collection ? ` — ${lead.collection.name}` : ""}` +
    `${who ? ` — ${who}` : ""}${where ? ` (${where})` : ""}`;

  const touch = (lead.attribution ?? {}) as { first?: Touch | null; last?: Touch | null };
  const rows: [string, string][] = [
    ...lead.fields.map((f) => [f.label, f.value] as [string, string]),
    ...(lead.collection ? [["Collection", `${lead.collection.name} (${lead.collection.line})`] as [string, string]] : []),
    ["Submitted from", lead.page ?? ""],
    ["Form", `${lead.formType}${lead.source ? ` · ${lead.source}` : ""}`],
    ["Reference", lead.ref],
    ["Received", lead.submittedAt],
    ...touchRows("First visit", touch.first),
    ...touchRows("Latest campaign visit", touch.last),
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<table cellpadding="6" style="border-collapse:collapse;font:14px/1.45 system-ui,sans-serif">` +
    rows
      .map(([k, v]) => `<tr><th align="left" valign="top" style="color:#555;font-weight:500;padding-right:16px">${esc(k)}</th><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
      .join("") +
    `</table>`;
  return { subject: subject.slice(0, 250), text, html, replyTo: get("email") };
}

interface Touch {
  params?: Record<string, string>;
  landing?: string;
  referrer?: string;
  at?: string;
}

function touchRows(label: string, t?: Touch | null): [string, string][] {
  if (!t) return [];
  const p = Object.entries(t.params ?? {}).map(([k, v]) => `${k}=${v}`).join(" · ");
  const parts = [t.at, t.landing && `landed on ${t.landing}`, t.referrer && `from ${t.referrer}`, p].filter(Boolean);
  return parts.length ? [[label, parts.join(" — ")]] : [];
}

async function sendEmail(lead: Lead) {
  const { subject, text, html, replyTo } = emailContent(lead);
  const to = process.env.LEAD_EMAIL_TO!.split(",").map(address).filter((a) => a.email);
  const body = {
    personalizations: [{ to }],
    from: address(process.env.LEAD_EMAIL_FROM!),
    ...(replyTo ? { reply_to: { email: replyTo } } : {}),
    subject,
    content: [
      { type: "text/plain", value: text },
      { type: "text/html", value: html },
    ],
    categories: ["website-lead", lead.formType],
    custom_args: { lead_ref: lead.ref },
    tracking_settings: { click_tracking: { enable: false }, open_tracking: { enable: false } },
  };
  const res = await fetch(process.env.SENDGRID_API_URL ?? "https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (res.status !== 202 && !res.ok) throw new Error(`SendGrid answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
