import { createHmac } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { finishById, lines } from "@/content/collections";
import { formDefs, validateLead, type LeadData, type LeadResult, type LeadVariant } from "@/lib/leads";

export const runtime = "nodejs";

const variants = Object.keys(formDefs) as LeadVariant[];

/**
 * Receives quote, dealer and contact requests.
 *
 * - Forwards to LEAD_WEBHOOK_URL when configured and reports "sent" ONLY after the destination
 *   accepts it (2xx).
 * - Without a destination it reports "not-configured" — the UI then tells the visitor plainly
 *   that nothing was sent. It never fakes a confirmation.
 * - Works for fetch (JSON) and for plain HTML form posts (no JavaScript), which are redirected
 *   back to the page with ?status=…
 */
export async function POST(req: NextRequest) {
  const isJson = req.headers.get("content-type")?.includes("application/json");
  let raw: Record<string, unknown>;
  try {
    raw = isJson ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return NextResponse.json({ status: "error" } satisfies LeadResult, { status: 400 });
  }

  const data: LeadData = {};
  for (const [k, v] of Object.entries(raw)) if (typeof v === "string") data[k] = v.slice(0, 5000);

  const variant = data.formType as LeadVariant;
  const returnTo = data.returnTo?.startsWith("/") && !data.returnTo.startsWith("//") ? data.returnTo : "/request-a-quote/";

  const respond = (result: LeadResult, status: number) => {
    if (isJson) return NextResponse.json(result, { status });
    const url = new URL(returnTo, req.nextUrl.origin);
    url.searchParams.set("status", result.status);
    if (data.finishId) url.searchParams.set("finish", data.finishId);
    return NextResponse.redirect(url, 303);
  };

  if (!variants.includes(variant)) return respond({ status: "error" }, 400);

  // Honeypot: real visitors never see or fill this field.
  if (data.website) return respond({ status: "sent" }, 200);

  const errors = validateLead(variant, data);
  if (Object.keys(errors).length) return respond({ status: "invalid", errors }, 422);

  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint) return respond({ status: "not-configured" }, 503);

  const finish = data.finishId ? finishById(data.finishId) : undefined;
  const fields: LeadData = {};
  for (const f of formDefs[variant].fields) if (data[f.name]) fields[f.name] = data[f.name].trim();

  const payload = JSON.stringify({
    formType: variant,
    submittedAt: new Date().toISOString(),
    source: data.source || null,
    page: data.page || null,
    collection: finish ? { id: finish.id, name: finish.name, line: lines[finish.line].name, url: finish.path } : null,
    fields,
  });

  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.LEAD_WEBHOOK_SECRET) {
      headers["x-highland-signature"] = createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET).update(payload).digest("hex");
    }
    const res = await fetch(endpoint, { method: "POST", headers, body: payload, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return respond({ status: "error" }, 502);
    return respond({ status: "sent" }, 200);
  } catch {
    return respond({ status: "error" }, 502);
  }
}
