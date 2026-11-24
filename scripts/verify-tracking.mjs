#!/usr/bin/env node
/**
 * Proves the campaign tracking works end to end in a real browser, without recording anything:
 *
 *  1. The previous site's tags load on the canonical host (GTM-NM4FXR2B, GTM-P6MLRTDB, GT-T5JX78GN, CallRail).
 *  2. A confirmed lead pushes "generate_lead" and GTM then fires the Google Ads lead conversion.
 *  3. A click on a tel: link fires the Google Ads phone conversion.
 *  4. A failed / unconfigured delivery fires nothing.
 *  5. gclid / utm_* on the landing URL travel with the lead.
 *  6. On any other host (staging, *.vercel.app, localhost) no tag loads.
 *
 * Every measurement request (GA4, Ads, Meta, Hotjar, CallRail sessions) is intercepted and aborted, so
 * the run never counts as a visit or conversion. Lead submissions are answered by the test, never sent.
 *
 *   SITE=https://highlandcabinetry.com node scripts/verify-tracking.mjs                 # after DNS cutover
 *   SITE=https://highlandcabinetry.com MAP_TO=http://localhost:3001 node scripts/...    # before: serve this
 *                                       build under the real hostname inside the test browser only
 *   COOKIE=_vercel_jwt=…   when MAP_TO is a protected Vercel deployment
 */
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = (process.env.SITE ?? "https://highlandcabinetry.com").replace(/\/$/, "");
const MAP_TO = process.env.MAP_TO?.replace(/\/$/, "");
const COOKIE = process.env.COOKIE;
const ADS = "341905256";
const LABELS = { lead: "Cw3ACLXbtNscEOiehKMB", phone: "HWzwCN6-zdscEOiehKMB" };
const COLLECT =
  /google-analytics\.com|analytics\.google\.com|googleadservices\.com|googleads\.g\.doubleclick\.net|doubleclick\.net|google\.com\/(pagead|ccm|rmkt)|facebook\.com\/tr|hotjar|callrail\.com\/(?!companies\/\d+\/[^/]+\/swap\.js)|js\.callrail\.com/;

const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });

const browser = await chromium.launch();

async function session({ site = SITE, lead = "sent" } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const seen = { scripts: [], hits: [], leadBodies: [] };
  const host = new URL(site).host;
  await page.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    if (COLLECT.test(url)) {
      seen.hits.push(url);
      return route.abort();
    }
    if (/googletagmanager\.com\/(gtm|gtag)|callrail\.com\/companies/.test(url)) seen.scripts.push(url);
    const u = new URL(url);
    if (u.host === host && u.pathname.startsWith("/api/lead")) {
      seen.leadBodies.push(req.postData() ?? "");
      const body = lead === "sent" ? { status: "sent", ref: "HC-TRACKING-TEST" } : { status: lead };
      return route.fulfill({ status: lead === "sent" ? 200 : 503, contentType: "application/json", body: JSON.stringify(body) });
    }
    if (MAP_TO && u.host === host) {
      const headers = { ...req.headers() };
      delete headers.host;
      if (COOKIE) headers.cookie = COOKIE;
      const res = await fetch(MAP_TO + u.pathname + u.search, { method: req.method(), headers, body: req.postData() ?? undefined, redirect: "manual" });
      const out = Object.fromEntries([...res.headers].filter(([k]) => !/^(content-encoding|content-length|transfer-encoding)$/.test(k)));
      if (out.location) out.location = out.location.replace(MAP_TO, SITE);
      return route.fulfill({ status: res.status, headers: out, body: Buffer.from(await res.arrayBuffer()) });
    }
    return route.continue();
  });
  return { ctx, page, seen };
}

const adsHits = (seen, label) => seen.hits.filter((h) => h.includes(ADS) && h.includes(label));
const settle = (page, ms = 4000) => page.waitForTimeout(ms);

// ---- 1, 2, 5: landing from an ad, tags load, confirmed lead converts ----
{
  const { ctx, page, seen } = await session();
  await page.goto(`${SITE}/request-a-quote/?gclid=TEST-GCLID&utm_source=google&utm_medium=cpc&utm_campaign=verify`, { waitUntil: "load" });
  await settle(page);
  for (const id of ["GTM-NM4FXR2B", "GTM-P6MLRTDB", "GT-T5JX78GN"]) check(`tag loads: ${id}`, seen.scripts.some((s) => s.includes(id)));
  check("tag loads: CallRail swap.js", seen.scripts.some((s) => s.includes("callrail.com/companies/843918300")));
  // Informational: page_view hits per GA4 property for one page load (the old site loaded G-39WL49D4VK twice).
  const pv = {};
  for (const h of seen.hits) {
    const u = new URL(h);
    if (/\/g\/collect/.test(u.pathname) && u.searchParams.get("en") === "page_view") pv[u.searchParams.get("tid")] = (pv[u.searchParams.get("tid")] ?? 0) + 1;
  }
  results.push({ name: "page_view per GA4 property on one page load (informational)", ok: true, detail: JSON.stringify(pv), info: pv });
  const dl = await page.evaluate(() => (window.dataLayer ?? []).map((e) => e?.event ?? (e?.[0] === "config" ? `config:${e[1]}` : null)).filter(Boolean));
  check("GTM started (gtm.js events)", dl.filter((e) => e === "gtm.js").length >= 2, dl.join(","));
  const first = await page.evaluate(() => localStorage.getItem("hc_first"));
  check("attribution captured on landing", first?.includes("TEST-GCLID") && first.includes("verify"), first ?? "");

  await page.goto(`${SITE}/request-a-quote/`, { waitUntil: "load" });
  await settle(page, 2500);
  const f = page.locator("form").filter({ has: page.locator('input[name="formType"]') }).first();
  await f.locator('select[name="projectType"]').selectOption({ index: 1 });
  await f.locator('select[name="timeline"]').selectOption({ index: 1 });
  for (const [n, v] of Object.entries({ firstName: "Tracking", lastName: "Test", email: "tracking-test@example.com", phone: "6025550100", company: "Verification", location: "Phoenix, AZ" }))
    await f.locator(`[name="${n}"]`).fill(v);
  await f.locator('select[name="customerType"]').selectOption({ index: 1 });
  await f.locator('input[name="einRoc"]').first().check();
  const mark = seen.hits.length;
  await f.locator('button[type="submit"]').click();
  await page.getByText("Reference HC-TRACKING-TEST").waitFor({ timeout: 10000 });
  await settle(page, 6000);
  // Every measurement event the one confirmed lead produced (requests were aborted, so none was recorded).
  const perLead = {};
  const seenIds = new Set();
  for (const h of seen.hits.slice(mark)) {
    const u = new URL(h);
    let k = null;
    if (/googleadservices|doubleclick|google\.com\/(pagead|ccm)/.test(u.host + u.pathname) && u.searchParams.get("label")) {
      k = `Google Ads conversion ${u.pathname.match(/\d{6,}/)?.[0]}/${u.searchParams.get("label")}`;
      // gtag sends one conversion over several transports (fmt=7/8/3) sharing one `random` id — count it once.
      const id = `${k}#${u.searchParams.get("random")}`;
      if (seenIds.has(id)) continue;
      seenIds.add(id);
    } else if (/\/g\/collect/.test(u.pathname)) {
      const en = u.searchParams.get("en");
      if (en && !/^(page_view|scroll|user_engagement)$/.test(en)) k = `GA4 ${u.searchParams.get("tid")} ${en}`;
    } else if (/facebook\.com\/tr/.test(h)) {
      const ev = u.searchParams.get("ev");
      if (ev && ev !== "PageView") k = `Meta ${ev}`;
    }
    if (k) perLead[k] = (perLead[k] ?? 0) + 1;
  }
  check("measurement events for one confirmed lead (each should be 1)", Object.values(perLead).every((n) => n === 1), JSON.stringify(perLead));
  results.at(-1).events = perLead;
  const events = await page.evaluate(() => (window.dataLayer ?? []).filter((e) => e?.event === "generate_lead"));
  check("confirmed lead pushes generate_lead once", events.length === 1, JSON.stringify(events));
  check("Google Ads lead conversion fires", adsHits(seen, LABELS.lead).length > 0, adsHits(seen, LABELS.lead)[0]?.slice(0, 140) ?? "no request");
  const body = seen.leadBodies.at(-1) ?? "";
  check("lead carries gclid and utm_campaign", body.includes("TEST-GCLID") && body.includes("verify"));

  // ---- 3: phone click ----
  const before = adsHits(seen, LABELS.phone).length;
  await page.evaluate(() => {
    const a = document.querySelector('a[href^="tel:"]');
    a?.addEventListener("click", (e) => e.preventDefault(), { once: true });
    a?.click();
  });
  await settle(page);
  check("Google Ads phone conversion fires on tel: click", adsHits(seen, LABELS.phone).length > before);
  await ctx.close();
}

// ---- 4: no conversion without delivery ----
{
  const { ctx, page, seen } = await session({ lead: "not-configured" });
  await page.goto(`${SITE}/contact-us/`, { waitUntil: "load" });
  await settle(page, 2500);
  const f = page.locator("form").filter({ has: page.locator('input[name="formType"]') }).first();
  for (const [n, v] of Object.entries({ firstName: "Tracking", lastName: "Test", email: "tracking-test@example.com", phone: "6025550100", message: "Verification run" }))
    await f.locator(`[name="${n}"]`).fill(v);
  await f.locator('select[name="customerType"]').selectOption({ index: 1 });
  await f.locator('button[type="submit"]').click();
  await settle(page);
  const events = await page.evaluate(() => (window.dataLayer ?? []).filter((e) => e?.event === "generate_lead").length);
  check("undelivered lead fires no conversion", events === 0 && adsHits(seen, LABELS.lead).length === 0);
  await ctx.close();
}

// ---- 6: other hosts stay silent ----
if (MAP_TO) {
  const { ctx, page, seen } = await session({ site: MAP_TO });
  if (COOKIE) await ctx.addCookies([{ name: COOKIE.split("=")[0], value: COOKIE.split("=").slice(1).join("="), url: MAP_TO }]);
  await page.goto(`${MAP_TO}/`, { waitUntil: "load" });
  await settle(page, 2500);
  check(`no tags on ${new URL(MAP_TO).host}`, seen.scripts.length === 0 && seen.hits.length === 0, seen.scripts.join(" "));
  await ctx.close();
}

await browser.close();
const failures = results.filter((r) => !r.ok);
const report = { site: SITE, mappedTo: MAP_TO ?? null, at: new Date().toISOString(), checks: results, failureCount: failures.length };
await writeFile(path.join(root, "docs/launch/tracking-check.json"), JSON.stringify(report, null, 2) + "\n");
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.ok ? `  — ${r.detail}` : ""}`);
console.log(`${failures.length} failures / ${results.length}`);
process.exit(failures.length ? 1 : 0);
