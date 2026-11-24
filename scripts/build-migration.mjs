#!/usr/bin/env node
/**
 * Builds the complete URL migration inventory, the redirect map and the "gone" list.
 *
 *   in:  docs/migration/source/*.json   (archive sitemap + links, live sitemap and WordPress exports of 2026-11-24)
 *        content/collections.ts, content/blog/posts.json, content/service-areas.json  (what the new site builds)
 *   out: docs/migration/url-inventory.csv   one row per old URL, exactly one status
 *        content/redirects.ts               consumed by next.config.ts (308 permanent)
 *        content/gone.ts                    consumed by proxy.ts (410 Gone)
 *
 * Statuses
 *   Rebuilt      the same path serves a rebuilt page (expect 200)
 *   Redirect     permanently redirected to the most relevant page (expect 308)
 *   Removed      deliberately retired with no equivalent (expect 410, or 200 for CMS query artifacts on "/")
 *   Unresolved   no decision yet — must be zero before launch
 *
 * Rules live here, in one place, so the inventory, redirects and tests can never disagree.
 * Run: node scripts/build-migration.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = async (f) => JSON.parse(await readFile(path.join(root, f), "utf8"));

// ---------------------------------------------------------------- sources
const archiveSitemap = await read("docs/migration/source/sitemap-urls.json");
const archiveLinked = (await read("docs/migration/source/linked-not-in-sitemap.json")).urls;
const archive404 = (await read("docs/migration/source/broken-links-404.json")).urls;
const liveSitemap = (await read("docs/migration/source/live-sitemap-2026-11-24.json")).urls;
const wpPages = (await read("docs/migration/source/wp-pages-2026-11-24.json")).pages;
const wpPosts = (await read("docs/migration/source/wp-posts-2026-11-24.json")).posts;
// Paths surfaced by the DataForSEO baseline (keyword/backlink evidence) and their reviewed destinations.
const seoBaseline = (await read("docs/migration/source/seo-baseline-2026-11-24.json")).paths;

const pathOf = (u) => {
  if (u.startsWith("/")) return u;
  const m = u.match(/^https?:\/\/(?:www\.)?highlandcabinetry\.com(.*)$/);
  if (!m) return u;
  const rest = m[1] || "/";
  try {
    return decodeURI(rest);
  } catch {
    return rest;
  }
};

/** path -> { sources:Set, wp?:{modified,index} } */
const urls = new Map();
const note = (p, src, extra = {}) => {
  const e = urls.get(p) ?? { sources: new Set() };
  e.sources.add(src);
  Object.assign(e, extra);
  urls.set(p, e);
};
for (const u of archiveSitemap) note(pathOf(u), "archive sitemap");
for (const u of liveSitemap) note(pathOf(u), "live sitemap");
for (const p of wpPages) note(p.path, "WordPress page", { wp: p });
for (const p of wpPosts) note(p.path, "WordPress post");
for (const u of archiveLinked) note(pathOf(u), "linked (archive)");
for (const u of archive404) note(u.includes("https://", 9) ? u : pathOf(u), "linked, 404 at archive capture");
for (const b of seoBaseline) note(b.path, "SEO baseline (DataForSEO 2026-11-24)");

// ---------------------------------------------------------------- what the new site builds
const collections = await readFile(path.join(root, "content/collections.ts"), "utf8");
const productPaths = [...collections.matchAll(/path: "(\/wholesale-[^"]+\/)"/g)].map((m) => m[1]);
const posts = await read("content/blog/posts.json");
const areas = await read("content/service-areas.json");
const liveAreas = areas.filter((a) => !a.state.endsWith("-old") && !(a.city ?? "").endsWith("-old"));
const blogAudit = await read("docs/migration/wp/blog-audit.json");

const pageNotes = {
  "/": ["Home", "Rebuilt. Unsupported stats (inventory, satisfaction, delivery days) and unattributed testimonials not carried over."],
  "/products/": ["Collections index", "Rebuilt from the June 2025 catalogs (3 lines, 13 finishes)."],
  "/wholesale-cabinets-for-contractors/": ["Trade", "Rebuilt; “20,000 kitchens in stock”, warranty, order-tracking and financing claims not carried over."],
  "/become-a-dealer/": ["Lead form", "Rebuilt with an honest form (no false ‘sent’)."],
  "/find-a-dealer/": ["Lead form", "Rebuilt as a dealer-referral request; there is no public dealer directory."],
  "/contact-us/": ["Contact", "Rebuilt; phone now 866-545-6280."],
  "/wholesale-cabinets/": ["Service-area hub", "Rebuilt; Phoenix is the only physical location; links to every state and city page."],
  "/blog/": ["Blog index", "Rebuilt; lists all 56 posts."],
  "/about-us/": ["About", "Rebuilt; founding year, origin, delivery-day, ‘largest inventory’ and ‘all-wood’ claims not carried over pending confirmation."],
  "/gallery-of-highland-cabinets/": ["Gallery", "Rebuilt from Highland renderings, Highland SKU renderings and camera-verified installed photos. Excluded: AI-generated (DALL·E/ChatGPT metadata), stock (shutterstock), third-party (CWS) and unverifiable images — see docs/migration/wp/gallery-exclusions.md."],
  "/most-searched-questions-for-kitchen-renovation/": ["FAQ article", "Rebuilt; inventory/lead-time, material and coat-count claims corrected to the catalogs. Confirm byline."],
  "/privacy-policy/": ["Legal", "Rebuilt from the previous policy; placeholders filled with confirmed contact details. Needs legal review."],
  "/hci-partners/": ["Partners", "Rebuilt; confirm the ILG relationship."],
  "/hci-partners/interior-logic-group-ilg/": ["Partner profile", "Rebuilt; undocumented partner logo wall (incl. Lowe’s) and third-party quote not carried over."],
  "/wholesalers-large-scale-projects/": ["Wholesale / large projects", "Rebuilt; ‘25,000 kitchens/month’, ‘15+ years’, regional hubs and certification claims not carried over."],
};

const rebuilt = new Map(); // path -> [type, notes, flags]
// Paid-campaign landings: kept at their URLs with each page's own call-tracking number (noindex, not in the sitemap).
for (const c of ["arizona", "california", "national", "new-mexico", "texas", "utah"])
  rebuilt.set(`/new-luxe-shaker-${c}/`, ["Campaign landing (noindex)", "Rebuilt at the same URL with the page's own call-tracking number so ad calls stay attributed; noindex and out of the sitemap, as before. Unsupported copy (award-winning, fade/scratch resistance) not carried over.", "confirm campaign still active"]);
for (const p of productPaths)
  rebuilt.set(p, ["Product collection", "Rebuilt from the June 2025 catalogs; unsupported delivery/inventory stats not carried over.", ""]);
for (const [p, [t, n]] of Object.entries(pageNotes)) rebuilt.set(p, [t, n, /confirm|review/i.test(n) ? "needs Highland confirmation" : ""]);
for (const post of posts) {
  const a = blogAudit[post.slug] ?? { edits: [], imagesRemoved: [], imagesFlagged: [] };
  const bits = [];
  if (a.edits.length) bits.push(`${a.edits.length} unsupported claim(s) corrected`);
  if (a.imagesRemoved.length) bits.push(`${a.imagesRemoved.length} image(s) removed (AI-generated or broken)`);
  if (a.imagesFlagged.length) bits.push(`${a.imagesFlagged.length} image(s) flagged: AI-generator dimensions`);
  rebuilt.set(`/blog/${post.slug}/`, ["Blog post", bits.join("; ") || "Rebuilt; no changes needed.", a.imagesFlagged.length ? "review images" : ""]);
}
for (const a of liveAreas) {
  const thin = (a.uniqueWords ?? 0) < 150;
  rebuilt.set(a.path, [
    a.city ? "Service area — city" : "Service area — state",
    `Rebuilt at the same path with local data (${a.areas.length} nearby areas, ${a.facilities.length} local offices) and verified ordering facts. Not carried over: ${a.removedClaims.join(", ") || "—"}.`,
    [thin ? `thin/templated original (${a.uniqueWords ?? 0} unique words)` : "", ...a.issues.filter((i) => !i.startsWith("thin")), a.facilities.length ? "verify local office details" : ""].filter(Boolean).join("; "),
  ]);
}

// ---------------------------------------------------------------- redirects & removals
const redirectRules = {
  "/wholesale-uptown-white-cabinets/": ["/wholesale-white-shaker-cabinets/", "Retired finish (not in the June 2025 catalogs). The old page described a painted white Shaker door, so White Shaker is the closest current product (changed from /products/ in the SEO audit).", "confirm discontinued"],
  "/european-dark-mirror-gloss-finish/": ["/products/#line-euro", "Retired ‘coming soon’ finish.", ""],
  "/european-dark-wood-gloss-finish/": ["/products/#line-euro", "Retired ‘coming soon’ finish.", ""],
  "/european-light-mirror-gloss-finish/": ["/products/#line-euro", "Retired ‘coming soon’ finish.", ""],
  "/european-light-wood-gloss-finish/": ["/products/#line-euro", "Retired ‘coming soon’ finish (linked, 404).", ""],
  "/index.php/european-light-wood-gloss-finish/": ["/products/#line-euro", "Malformed legacy link.", ""],
  "/free-shipping-landing/": ["/", "Indexed duplicate of the old homepage (same title and H1), not a distinct offer page — redirected to the homepage (changed from /request-a-quote/ in the SEO audit).", "confirm no free-shipping offer is advertised"],
  "/blowout-specials/": ["/request-a-quote/", "Expired Q4 promotion (noindex); price-match guarantee not carried over.", ""],
  "/find-a-dealer-2/": ["/find-a-dealer/", "Empty duplicate (noindex).", ""],
  "/old-gallery-of-highland-cabinets/": ["/gallery-of-highland-cabinets/", "Superseded gallery (noindex).", ""],
  "/thank-you/": ["/contact-us/", "Form confirmation page (noindex); new forms confirm inline.", ""],
  "/locate-dealer-thank-you/": ["/find-a-dealer/", "Form confirmation page (noindex); new forms confirm inline.", ""],
  "/wholesale-cabinets/wisconsin-old/madison-old/": ["/wholesale-cabinets/wisconsin/madison/", "Outdated duplicate of the Madison page.", ""],
  "/wholesale-cabinets/wisconsin-old/": ["/wholesale-cabinets/wisconsin/", "Outdated duplicate.", ""],
  "/wholesale-cabinets/North Dakota/": ["/wholesale-cabinets/north-dakota/", "Malformed link (space) from the old navigation.", ""],
  "/wholesale-onyx-black-shaker-cabinets/": ["/wholesale-onyx-black-shaker-cabinet/", "Plural variant of the product URL.", ""],
  "/blog/page/2/": ["/blog/", "Blog pagination; the new index lists every post.", ""],
  "/blog/category/uncategorized/": ["/blog/", "WordPress category archive.", ""],
  "/blog/author/jamesmhighlandcabinetryinc-com/": ["/blog/", "WordPress author archive.", ""],
  "/blog/gallery-tab-category/shaker-style/": ["/gallery-of-highland-cabinets/#shaker-style", "Gallery category archive.", ""],
  "/blog/gallery-tab-category/nano-style/": ["/gallery-of-highland-cabinets/#nano-style", "Gallery category archive.", ""],
  "/blog/gallery-tab-category/euro-style/": ["/gallery-of-highland-cabinets/#euro-style", "Gallery category archive.", ""],
  "/blog/replace-cabinets-keep-countertops/": ["/blog/can-you-replace-cabinets-and-keep-countertops/", "Old slug of an existing post (linked, 404).", ""],
  "/white-shaker-cabinets/": ["/wholesale-white-shaker-cabinets/", "Broken internal link (404).", ""],
  "/shaker-cabinets": ["/products/#line-shaker", "Broken internal link (404).", ""],
  "/collections/all": ["/products/", "Broken internal link (404).", ""],
  "/wholesale/": ["/wholesale-cabinets-for-contractors/", "Broken internal link (404).", ""],
};
for (const b of seoBaseline)
  if (b.destination)
    redirectRules[b.path] = [
      b.destination,
      `${b.rationale} Old site: HTTP ${b.oldHttpStatus}. Provider evidence: ${b.providerKeywordRecords} keyword record(s), ${b.providerReferringDomains} referring domain(s).`,
      "",
    ];
const pdfRules = {
  "/wp-content/uploads/2026/05/341793_HCI-Shaker-Nano-Catalog-June-2025_Web_04.17.26_compressed-1.pdf": "/catalogs/highland-shaker-nano-catalog.pdf",
  "/wp-content/uploads/2025/10/341793_HCI-Shaker-Nano-Catalog-Ocotber_2025_Web_10.24.25.pdf": "/catalogs/highland-shaker-nano-catalog.pdf",
  "/wp-content/uploads/2025/07/341792_HCI-Euro-Catalog-June-2025_Final_07.08.25-2-1.pdf": "/catalogs/highland-euro-catalog.pdf",
  "/wp-content/uploads/2026/01/Kitchen-Remodeling-Checklis.pdf": "/downloads/kitchen-remodeling-checklist.pdf",
};
for (const p of Object.keys(pdfRules)) note(p, "document (PDF)");
const goneRules = {
  "/oops/": "Geo-block error page (“Your country has been blocked”), noindex.",
  "/iframe-36/": "Embed fragment of an old homepage design, noindex.",
};
const queryArtifact = (p) => /^\/\?wpr_mega_menu=/.test(p);
const malformedPost = (p) => /^https:\/\/highlandcabinetry\.com\/blog\/how-to-make-a-small-kitchen-look-bigger\/https:/.test(p);

// ---------------------------------------------------------------- classify
const rows = [];
const redirects = [];
const gone = [];
// With trailingSlash on, Next adds the slash before redirects are matched — so sources always end in "/".
const addRedirect = (source, destination) => {
  const src = source.endsWith("/") ? source : `${source}/`;
  redirects.push({ source: encodeURI(src), destination, permanent: true });
};

for (const [p, e] of [...urls.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const sources = [...e.sources].join("; ");
  const wpNote = e.wp ? `WordPress: modified ${e.wp.modified.slice(0, 10)}${e.wp.index === "noindex" ? ", noindex" : ""}.` : "";
  let r;
  if (rebuilt.has(p)) {
    const [type, notes, flags] = rebuilt.get(p);
    r = { type, status: "Rebuilt", target: p, expect: 200, notes, flags };
  } else if (redirectRules[p]) {
    const [dest, notes, flags] = redirectRules[p];
    r = { type: "Retired / duplicate", status: "Redirect", target: dest, expect: 308, notes, flags };
    addRedirect(p, dest);
  } else if (pdfRules[p]) {
    r = { type: "Document (PDF)", status: "Redirect", target: pdfRules[p], expect: 308, notes: "Served from a stable local path.", flags: "" };
    redirects.push({ source: p, destination: pdfRules[p], permanent: true });
  } else if (goneRules[p]) {
    r = { type: "CMS artifact", status: "Removed", target: "", expect: 410, notes: goneRules[p], flags: "" };
    gone.push(p);
  } else if (queryArtifact(p)) {
    r = { type: "CMS artifact (mega-menu query)", status: "Removed", target: "/", expect: 200, notes: "WordPress mega-menu item listed in the sitemap; the query string resolves to the homepage, which carries a canonical URL.", flags: "" };
  } else if (malformedPost(p)) {
    r = { type: "Malformed link", status: "Removed", target: "", expect: "n/a", notes: "A doubled URL inside an old post; not a reachable path. The link was not carried into the rebuilt post.", flags: "" };
  } else {
    r = { type: "Unclassified", status: "Unresolved", target: "", expect: "?", notes: "No migration rule matched.", flags: "decide before launch" };
  }
  rows.push({ path: p, sources, ...r, notes: [r.notes, wpNote].filter(Boolean).join(" ") });
}

// ---------------------------------------------------------------- write outputs
const cols = ["path", "sources", "type", "status", "target", "expect", "flags", "notes"];
const head = ["Old path", "Found in", "Page type", "Status", "New URL", "Expected HTTP", "Review flags", "Notes"];
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
await writeFile(
  path.join(root, "docs/migration/url-inventory.csv"),
  [head.map(esc).join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n",
);
const seen = new Set();
const unique = redirects.filter((r) => (seen.has(r.source) ? false : (seen.add(r.source), true)));
await writeFile(
  path.join(root, "content/redirects.ts"),
  `// GENERATED by scripts/build-migration.mjs — do not edit by hand.\n// ${unique.length} permanent redirects (308). Rebuilt paths need none.\nexport const redirects: { source: string; destination: string; permanent: boolean }[] = ${JSON.stringify(unique, null, 2)};\n`,
);
await writeFile(
  path.join(root, "content/gone.ts"),
  `// GENERATED by scripts/build-migration.mjs — do not edit by hand.\n// Deliberately retired paths answered with 410 Gone (see proxy.ts).\nexport const gone: string[] = ${JSON.stringify(gone, null, 2)};\n`,
);

const count = (k) => rows.reduce((a, r) => ((a[r[k]] = (a[r[k]] ?? 0) + 1), a), {});
const summary = {
  generated: new Date().toISOString().slice(0, 10),
  total: rows.length,
  byStatus: count("status"),
  byType: count("type"),
  flagged: rows.filter((r) => r.flags).length,
  bySource: {
    "archive sitemap": archiveSitemap.length,
    "live sitemap (2026-11-24)": liveSitemap.length,
    "WordPress published pages": wpPages.length,
    "WordPress posts": wpPosts.length,
    "linked (archive)": archiveLinked.length,
    "linked 404 (archive)": archive404.length,
    "documents (PDF)": Object.keys(pdfRules).length,
    "SEO baseline (DataForSEO 2026-11-24)": seoBaseline.length,
  },
  redirects: unique.length,
  gone: gone.length,
};
await writeFile(path.join(root, "docs/migration/summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 1));
