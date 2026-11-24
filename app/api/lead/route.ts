import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { finishById, lines } from "@/content/collections";
import { configuredDestinations, deliverLead } from "@/lib/deliver";
import { formDefs, validateLead, type LeadData, type LeadResult, type LeadVariant } from "@/lib/leads";

export const runtime = "nodejs";

const variants = Object.keys(formDefs) as LeadVariant[];

/**
 * Receives quote, dealer and contact requests.
 *
 * - Delivers to every configured destination (email via SendGrid and/or a webhook — lib/deliver.ts)
 *   and reports "sent" ONLY after at least one destination accepts it.
 * - Without a destination it reports "not-configured" — the UI then tells the visitor plainly
 *   that nothing was sent. It never fakes a confirmation.
 * - A request carrying x-lead-test = LEAD_TEST_TOKEN is delivered as a clearly marked test lead
 *   (used by scripts/verify-production.mjs to prove delivery end to end).
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

  if (!configuredDestinations().length) return respond({ status: "not-configured" }, 503);

  const finish = data.finishId ? finishById(data.finishId) : undefined;
  const fields = formDefs[variant].fields
    .filter((f) => data[f.name]?.trim())
    .map((f) => ({ name: f.name, label: f.label, value: data[f.name].trim() }));
  let attribution: unknown = null;
  try {
    attribution = data.attribution ? JSON.parse(data.attribution) : null;
  } catch {}

  const ref = `HC-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
  const report = await deliverLead({
    ref,
    test: isTest(req),
    formType: variant,
    formTitle: formDefs[variant].title,
    submittedAt: new Date().toISOString(),
    source: data.source || null,
    page: data.page || null,
    collection: finish ? { id: finish.id, name: finish.name, line: lines[finish.line].name, url: finish.path } : null,
    fields,
    attribution,
  });
  if (!report.delivered.length) return respond({ status: "error" }, 502);
  return respond({ status: "sent", ref }, 200);
}

function isTest(req: NextRequest) {
  const token = process.env.LEAD_TEST_TOKEN?.trim();
  const given = req.headers.get("x-lead-test")?.trim();
  if (!token || !given || token.length !== given.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(given));
}

/** Readiness probe for scripts/verify-production.mjs: which destinations are configured (names only). */
export function GET(req: NextRequest) {
  if (!isTest(req)) {
    // Say why the probe was refused (no values), so a misconfigured verification run is easy to diagnose.
    const testToken = !req.headers.get("x-lead-test") ? undefined : process.env.LEAD_TEST_TOKEN ? "mismatch" : "not-configured";
    return NextResponse.json({ status: "ok", ...(testToken ? { testToken } : {}) });
  }
  return NextResponse.json({ status: "ok", destinations: configuredDestinations() });
}
