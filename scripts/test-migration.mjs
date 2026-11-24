#!/usr/bin/env node
/**
 * Tests every old URL in docs/migration/url-inventory.csv against a running build, then crawls every
 * rebuilt page for internal links and checks each resolves. Every redirect is also requested with and without its
 * trailing slash, carrying gclid/utm parameters, which must survive to the destination.
 *   BASE=http://localhost:3000 node scripts/test-migration.mjs
 *   (for a protected Vercel preview also set COOKIE to the _vercel_jwt cookie header)
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const BASE = process.env.BASE ?? "http://localhost:3000";
const headers = process.env.COOKIE ? { cookie: process.env.COOKIE } : {};

const csv = await readFile(path.join(root, "docs/migration/url-inventory.csv"), "utf8");
const parse = (line) => [...line.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"'));
const [head, ...lines] = csv.trim().split("\n");
const cols = parse(head);
const rows = lines.map((l) => Object.fromEntries(parse(l).map((v, i) => [cols[i], v])));

const get = async (p, redirect = "manual") => {
  const url = p.startsWith("http") ? p : BASE + encodeURI(p).replace(/%25/g, "%");
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { redirect, headers });
      return { status: r.status, location: r.headers.get("location"), body: redirect === "follow" || r.status === 200 ? await r.text() : "" };
    } catch (e) {
      if (i === 2) return { status: 0, error: String(e) };
    }
  }
};
const strip = (u) => (u ? u.replace(/^https?:\/\/[^/]+/, "") : u);

const failures = [];
const results = { checked: 0, byStatus: {}, variantsChecked: 0 };
const CAMPAIGN = "gclid=TEST-GCLID&utm_source=google&utm_medium=cpc&utm_campaign=migration-test";
const pool = async (items, n, fn) => {
  const q = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()); }));
};

await pool(rows, 8, async (r) => {
  const exp = r["Expected HTTP"];
  if (exp === "n/a") return;
  const p = r["Old path"];
  const res = await get(p);
  results.checked++;
  results.byStatus[res.status] = (results.byStatus[res.status] ?? 0) + 1;
  if (String(res.status) !== exp) return failures.push(`${p}: expected ${exp}, got ${res.status} ${res.location ?? ""}`);
  if (exp === "308") {
    const want = r["New URL"].split("#")[0];
    // Follow the chain (a slashless old URL takes one extra hop to gain its trailing slash).
    let loc = strip(res.location), hops = 1;
    while (hops < 4) {
      const n = await get(loc);
      if (n.status !== 308 && n.status !== 301) break;
      loc = strip(n.location); hops++;
    }
    if (hops > 2) failures.push(`${p}: ${hops} redirect hops`);
    if (loc.split("#")[0] !== encodeURI(want)) failures.push(`${p}: redirects to ${loc}, expected ${want}`);
    const t = await get(want);
    if (t.status !== 200) failures.push(`${p}: redirect target ${want} returned ${t.status}`);
    // Variants: without / with the trailing slash, each carrying campaign parameters, must land on the same
    // destination in at most two hops with every parameter intact.
    if (!p.includes(".pdf") && !p.includes("?")) {
      const alt = p.endsWith("/") ? p.slice(0, -1) : `${p}/`;
      for (const v of [p, alt]) {
        let u = `${v}?${CAMPAIGN}`, h = 0, n;
        do {
          n = await get(u);
          if (n.status === 308 || n.status === 301) { u = strip(n.location); h++; }
        } while ((n.status === 308 || n.status === 301) && h < 4);
        const [pathPart, query = ""] = u.split("#")[0].split("?");
        results.variantsChecked++;
        if (n.status !== 200 || pathPart !== encodeURI(want) || h > 2 || !CAMPAIGN.split("&").every((kv) => query.split("&").includes(kv)))
          failures.push(`${v}?${CAMPAIGN}: ended at ${u} (${n.status}, ${h} hops), expected ${want} with parameters`);
      }
    }
  }
  if (exp === "200" && r.Status === "Rebuilt") {
    if (!/<h1[\s>]/.test(res.body)) failures.push(`${p}: no <h1>`);
    if (!/<link rel="canonical" href="[^"]+"/.test(res.body)) failures.push(`${p}: no canonical`);
  }
});

// Crawl internal links on every rebuilt page.
const linkStatus = new Map();
const rebuilt = rows.filter((r) => r.Status === "Rebuilt");
const pageLinks = new Map();
await pool(rebuilt, 8, async (r) => {
  const res = await get(r["Old path"]);
  const hrefs = [...res.body.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)].map((m) => m[1]).filter((h) => !h.startsWith("/_next/") && !h.startsWith("/media/"));
  pageLinks.set(r["Old path"], new Set(hrefs));
});
const allLinks = new Set([...pageLinks.values()].flatMap((s) => [...s]));
await pool([...allLinks], 8, async (h) => {
  const res = await get(h, "follow");
  linkStatus.set(h, res.status);
});
const broken = [...linkStatus].filter(([, s]) => s !== 200);
for (const [h, s] of broken) {
  const on = [...pageLinks].filter(([, set]) => set.has(h)).map(([p]) => p).slice(0, 3);
  failures.push(`internal link ${h} → ${s} (on ${on.join(", ")})`);
}

const report = { base: BASE, inventoryRows: rows.length, ...results, internalLinksChecked: allLinks.size, failures };
await writeFile(path.join(root, "docs/migration/test-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report, failures: failures.slice(0, 40) }, null, 1));
process.exit(failures.length ? 1 : 0);
