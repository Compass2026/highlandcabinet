#!/usr/bin/env node
/**
 * Pre-launch SEO gate. Run against a PRODUCTION-MODE build:
 *   SITE_INDEXING=on NEXT_PUBLIC_SITE_URL=https://highlandcabinetry.com npx next build && ... next start -p 3001
 *   BASE=http://localhost:3001 node scripts/test-launch-seo.mjs
 * Fails on: noindex anywhere it shouldn't be, wrong canonical origin, missing/duplicate titles or descriptions,
 * sitemap/inventory mismatch, robots.txt blocking, or any internal review / preview text in the HTML.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const BASE = process.env.BASE ?? "http://localhost:3001";
const ORIGIN = process.env.ORIGIN ?? "https://highlandcabinetry.com";
const csv = await readFile(path.join(root, "docs/migration/url-inventory.csv"), "utf8");
const parse = (l) => [...l.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"'));
const [h, ...ls] = csv.trim().split("\n"); const cols = parse(h);
const rows = ls.map((l) => Object.fromEntries(parse(l).map((v, i) => [cols[i], v])));
const rebuilt = rows.filter((r) => r.Status === "Rebuilt").map((r) => r["Old path"]);
const nonCanonical = rows.filter((r) => r.Status !== "Rebuilt").map((r) => r["Old path"]);
const fail = [];
const REVIEW = /Preview only|migration review|awaiting confirmation|review needed|Staging build|hidden from search engines/i;

const robots = await (await fetch(BASE + "/robots.txt")).text();
if (/Disallow:\s*\/\s*$/m.test(robots)) fail.push("robots.txt disallows the whole site");
if (!robots.includes(`${ORIGIN}/sitemap.xml`)) fail.push("robots.txt does not reference the production sitemap");
const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const smPaths = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, "")));
for (const p of rebuilt) if (!smPaths.has(p)) fail.push(`sitemap missing rebuilt page ${p}`);
for (const p of nonCanonical) if (smPaths.has(p)) fail.push(`sitemap lists non-200 path ${p}`);
for (const u of [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) if (!u.startsWith(ORIGIN)) fail.push(`sitemap URL on wrong origin ${u}`);

const pages = [...new Set([...rebuilt, ...smPaths])];
const titles = new Map(), descs = new Map();
const q = [...pages];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (q.length) {
    const p = q.shift();
    const r = await fetch(BASE + encodeURI(p), { redirect: "manual" });
    const html = await r.text();
    if (r.status !== 200) { fail.push(`${p}: HTTP ${r.status}`); continue; }
    if (/noindex/i.test(r.headers.get("x-robots-tag") ?? "")) fail.push(`${p}: X-Robots-Tag noindex`);
    const robotsMeta = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? "";
    if (/noindex/i.test(robotsMeta)) fail.push(`${p}: meta robots ${robotsMeta}`);
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canon !== ORIGIN + p) fail.push(`${p}: canonical ${canon}`);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
    if (!title) fail.push(`${p}: no title`); else titles.set(title, [...(titles.get(title) ?? []), p]);
    if (!desc) fail.push(`${p}: no meta description`); else descs.set(desc, [...(descs.get(desc) ?? []), p]);
    if (!/<h1[\s>]/.test(html)) fail.push(`${p}: no h1`);
    const visible = html.replace(/<script[\s\S]*?<\/script>/g, "");
    if (REVIEW.test(visible)) fail.push(`${p}: internal review/preview text present (${visible.match(REVIEW)[0]})`);
  }
}));
for (const [t, ps] of titles) if (ps.length > 1) fail.push(`duplicate title "${t}" on ${ps.join(", ")}`);
for (const ps of descs.values()) if (ps.length > 1) fail.push(`duplicate description on ${ps.join(", ")}`);
const report = { base: BASE, origin: ORIGIN, pagesChecked: pages.length, sitemapUrls: smPaths.size, rebuiltInInventory: rebuilt.length, failures: fail };
await writeFile(path.join(root, "docs/seo/launch-check.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report, failures: fail.slice(0, 30), failureCount: fail.length }, null, 1));
process.exit(fail.length ? 1 : 0);
