#!/usr/bin/env node
/**
 * Builds the URL migration inventory and the redirect map from the preserved archive's URL lists.
 *
 *   in:  docs/migration/source/*.json
 *   out: docs/migration/url-inventory.csv   (one row per archived URL)
 *        content/redirects.ts               (consumed by next.config.ts)
 *
 * Rules live here, in one place, so the inventory and the redirects can never disagree.
 * Run: node scripts/build-migration.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = async (f) => JSON.parse(await readFile(path.join(root, f), "utf8"));

const sitemap = await read("docs/migration/source/sitemap-urls.json");
const broken = (await read("docs/migration/source/broken-links-404.json")).urls;
const linked = (await read("docs/migration/source/linked-not-in-sitemap.json")).urls;

// Paths built in this milestone (must match app/ routes).
const productPaths = {
  "/wholesale-white-shaker-cabinets/": "Featured — full gallery of installed-project photos",
  "/wholesale-gray-shaker-cabinets/": "",
  "/wholesale-modern-slate-cabinets/": "",
  "/wholesale-onyx-black-shaker-cabinet/": "Singular “cabinet” slug kept as canonical; plural variant redirects here",
  "/wholesale-signature-blue-shaker-cabinets/": "",
  "/wholesale-luxe-shaker-cabinets/": "",
  "/wholesale-nano-green-cabinets/": "",
  "/wholesale-nano-white-cabinets/": "",
  "/wholesale-white-oak-euro-cabinets/": "Old page repeated White Shaker specs and “plywood support” copy under a furniture-board Euro product — removed",
  "/wholesale-natural-walnut-euro-cabinets/": "",
  "/wholesale-stone-grey-euro-cabinets/": "",
  "/wholesale-glacial-white-euro-cabinets/": "",
  "/wholesale-white-frost-euro-cabinets/": "",
};
const commonProductIssue =
  "Removed unverified stats (7-day delivery, 97% satisfaction, 20,000 kitchens stocked, 25,000/month). Old site says drawers have 5/8″ plywood sides; June 2025 catalog says 1/2″ solid wood — catalog used, confirm.";

const builtPages = {
  "/": ["Home", "Rebuilt. Conflicting shipping timelines (10–12 days vs 7–9 days) and inventory/satisfaction counters removed pending confirmation. Trustindex “Google” testimonials not reused — individual review sources not preserved."],
  "/products/": ["Collections index", "Rebuilt as three lines / thirteen finishes from the June 2025 catalogs. “Uptown White” and the four “European … gloss” finishes are not in the current catalogs."],
  "/wholesale-cabinets-for-contractors/": ["Trade / audience", "Removed: “20,000 kitchens in stock”, “rigorous quality checks… warranty”, “real-time order tracking”, financing partner (Blue Tree), contractor branding program — all need confirmation."],
  "/become-a-dealer/": ["Lead form", "Phone shown on old page (866.853.7987) differs from Contact page (480-755-2280). “Reply within 24 hours” promise removed pending confirmation."],
  "/find-a-dealer/": ["Lead form", "Old page promised “top cabinet dealers in your area”; there is no public dealer directory — rebuilt as a referral request."],
  "/contact-us/": ["Contact / lead form", "Address, phone, email need confirmation (see launch checklist)."],
  "/wholesale-cabinets/": ["Service-area hub", "Rebuilt to separate the one physical location (Phoenix) from areas served."],
};

const planned = {
  "/about-us/": ["About", "Milestone 2", "Conflicts: founded 2018 vs “over ten years of experience”; “manufactured in Vietnam” vs catalog “we own our entire supply chain”; delivery “3–5 days” and “average 4 days” vs other pages; “largest in-stock Shaker inventory in Arizona” unverified; testimonials unverifiable."],
  "/blog/": ["Blog index", "Milestone 3 (CMS)", "Move 56 posts into the CMS keeping /blog/<slug>/ paths."],
  "/gallery-of-highland-cabinets/": ["Gallery", "Milestone 2", "Separate installed-project photos from catalog renderings; several gallery/blog images are AI-generated (DALL·E, Gemini, ChatGPT filenames) or stock — do not present as Highland projects."],
  "/most-searched-questions-for-kitchen-renovation/": ["FAQ", "Milestone 2", "Review answers for shipping/warranty claims before republishing."],
  "/privacy-policy/": ["Legal", "Required before launch", "Forms collect personal data; needs a current privacy policy reviewed by Highland."],
};

const needsDecision = {
  "/wholesale-uptown-white-cabinets/": ["Product (legacy)", "/products/#line-shaker", "Uptown White is not in either June 2025 catalog. Confirm discontinued → 301 to Shaker line, or supply current product data."],
  "/european-dark-mirror-gloss-finish/": ["Product (legacy)", "/products/#line-euro", "From the old “Euro finishes coming soon” block; not in the current Euro catalog."],
  "/european-dark-wood-gloss-finish/": ["Product (legacy)", "/products/#line-euro", "From the old “Euro finishes coming soon” block; not in the current Euro catalog."],
  "/european-light-mirror-gloss-finish/": ["Product (legacy)", "/products/#line-euro", "From the old “Euro finishes coming soon” block; not in the current Euro catalog."],
  "/free-shipping-landing/": ["Campaign landing", "/request-a-quote/", "“Free shipping” offer must be confirmed as current before any reuse; otherwise retire with a redirect."],
  "/hci-partners/": ["Partners", "", "Partner relationships (e.g. Interior Logic Group) need written confirmation and logo permission before republishing."],
  "/hci-partners/interior-logic-group-ilg/": ["Partner profile", "", "Confirm the ILG relationship and permission to use their name and logo."],
};

const rows = [];
const redirects = [];
const add = (r) => rows.push(r);
const pathOf = (u) => {
  const p = new URL(u.replace(/ /g, "%20")).pathname;
  return decodeURIComponent(p);
};
const addRedirect = (source, destination) => {
  const src = source.endsWith("/") ? source : `${source}/`;
  redirects.push({ source: encodeURI(src), destination, permanent: true });
};

for (const url of sitemap) {
  const p = pathOf(url);
  const isPost = p.startsWith("/blog/") && p !== "/blog/";
  const src = isPost ? "sitemap (post)" : "sitemap (page)";

  if (productPaths[p] !== undefined) {
    add({ url, path: p, source: src, type: "Product collection", replacement: p, status: "built", redirect: "none (path preserved)", issues: [productPaths[p], commonProductIssue].filter(Boolean).join(" ") });
  } else if (builtPages[p]) {
    add({ url, path: p, source: src, type: builtPages[p][0], replacement: p, status: "built", redirect: "none (path preserved)", issues: builtPages[p][1] });
  } else if (planned[p]) {
    add({ url, path: p, source: src, type: planned[p][0], replacement: p, status: `planned — ${planned[p][1]}`, redirect: "none (path preserved)", issues: planned[p][2] });
  } else if (needsDecision[p]) {
    const [type, dest, issue] = needsDecision[p];
    add({ url, path: p, source: src, type, replacement: dest || p, status: "needs decision", redirect: dest ? "301 (proposed)" : "none until decided", issues: issue });
    if (dest) addRedirect(p, dest);
  } else if (isPost) {
    add({ url, path: p, source: src, type: "Blog post", replacement: p, status: "planned — Milestone 3 (CMS)", redirect: "none (path preserved)", issues: "Audit for unverified shipping/warranty claims and AI-generated imagery before migrating." });
  } else if (p.startsWith("/wholesale-cabinets/")) {
    const parts = p.split("/").filter(Boolean);
    const stateSlug = parts[1].replace(/-old$/, "");
    const isCity = parts.length > 2;
    const dest = `/wholesale-cabinets/?state=${stateSlug}`;
    const isPhoenix = p === "/wholesale-cabinets/arizona/phoenix/";
    add({
      url,
      path: p,
      source: src,
      type: isCity ? "Service area — city" : "Service area — state",
      replacement: dest,
      status: "consolidated",
      redirect: "301",
      issues: isPhoenix
        ? "Only page for the real physical location. Old copy includes trade pricing tiers (“up to 10–20%”), warehouse hours and “20,000+ kitchens… restocked bi-weekly” — confirm, then consider a dedicated Phoenix location page in Milestone 2."
        : isCity
          ? "Describes an area served, not a physical location. Consolidated to avoid thin duplicate pages; rebuild only with genuinely local content."
          : "Coverage for this state needs confirmation. Can become a substantive state page later.",
    });
    addRedirect(p, dest);
  } else {
    add({ url, path: p, source: src, type: "Unclassified", replacement: "", status: "needs review", redirect: "", issues: "Not matched by a migration rule." });
  }
}

for (const url of linked) {
  const p = pathOf(url);
  let dest = "";
  let type = "Linked page";
  let issue = "";
  if (p === "/blog/page/2/") {
    type = "Blog pagination";
    dest = "";
    issue = "Recreate pagination when the blog moves to the CMS.";
  } else if (p === "/wholesale-onyx-black-shaker-cabinets/") {
    type = "Product (duplicate slug)";
    dest = "/wholesale-onyx-black-shaker-cabinet/";
    issue = "Plural variant of the sitemap URL.";
  } else if (p.startsWith("/wholesale-cabinets/")) {
    type = "Service area — malformed";
    dest = `/wholesale-cabinets/?state=${p.split("/")[2].toLowerCase().replace(/ /g, "-")}`;
    issue = "URL contains a space; linked from the old navigation.";
  }
  add({ url, path: p, source: "linked, not in sitemap", type, replacement: dest || p, status: dest ? "redirect" : "planned — Milestone 3 (CMS)", redirect: dest ? "301" : "none", issues: issue });
  if (dest) addRedirect(p, dest);
}

const brokenMap = {
  "/white-shaker-cabinets/": "/wholesale-white-shaker-cabinets/",
  "/shaker-cabinets/": "/products/#line-shaker",
  "/shaker-cabinets": "/products/#line-shaker",
  "/wholesale/": "/wholesale-cabinets-for-contractors/",
  "/collections/all": "/products/",
  "/european-light-wood-gloss-finish/": "/products/#line-euro",
  "/index.php/european-light-wood-gloss-finish/": "/products/#line-euro",
};
for (const url of broken) {
  let p;
  try {
    p = pathOf(url);
  } catch {
    p = url;
  }
  const dest = brokenMap[p];
  const malformed = url.split("https://").length > 2;
  add({
    url,
    path: p,
    source: "linked, returned 404 at capture",
    type: "Broken link",
    replacement: dest ?? "",
    status: dest ? "redirect" : "fix source link",
    redirect: dest ? "301" : "none",
    issues: malformed ? "Malformed internal link (URL repeated) in an old blog post — fix the link when migrating the post." : dest ? "Recover link equity from inbound/internal links." : "Post no longer exists; remove internal links or point them to a related post during the blog migration.",
  });
  if (dest) addRedirect(p.replace(/\/?$/, "/"), dest);
}

// Catalog PDFs referenced by the old site → local, stable paths.
const pdfs = [
  ["https://highlandcabinetry.com/wp-content/uploads/2026/05/341793_HCI-Shaker-Nano-Catalog-June-2025_Web_04.17.26_compressed-1.pdf", "/catalogs/highland-shaker-nano-catalog.pdf", "Current web edition linked from the old navigation."],
  ["https://highlandcabinetry.com/wp-content/uploads/2025/10/341793_HCI-Shaker-Nano-Catalog-Ocotber_2025_Web_10.24.25.pdf", "/catalogs/highland-shaker-nano-catalog.pdf", "Earlier upload of the same June 2025 edition (one wording difference)."],
  ["https://highlandcabinetry.com/wp-content/uploads/2025/07/341792_HCI-Euro-Catalog-June-2025_Final_07.08.25-2-1.pdf", "/catalogs/highland-euro-catalog.pdf", ""],
  ["https://highlandcabinetry.com/wp-content/uploads/2026/01/Kitchen-Remodeling-Checklis.pdf", "/catalogs/kitchen-remodeling-checklist.pdf", "Homeowner checklist; not yet linked from the new site."],
];
for (const [url, dest, issue] of pdfs) {
  const p = new URL(url).pathname;
  add({ url, path: p, source: "document", type: "PDF", replacement: dest, status: "built", redirect: "301", issues: issue });
  redirects.push({ source: p, destination: dest, permanent: true });
}

// ---- write CSV ----
const cols = ["url", "path", "source", "type", "replacement", "status", "redirect", "issues"];
const head = ["Archived URL", "Path", "Discovered via", "Page type", "Intended replacement URL", "Migration status", "Redirect", "Content / factual issues"];
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv = [head.map(esc).join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
await writeFile(path.join(root, "docs/migration/url-inventory.csv"), csv);

// ---- write redirects ----
const seen = new Set();
const unique = redirects.filter((r) => (seen.has(r.source) ? false : (seen.add(r.source), true)));
const ts = `// GENERATED by scripts/build-migration.mjs from docs/migration/source — do not edit by hand.
// ${unique.length} redirects. Paths that are rebuilt in place need no redirect and are not listed.
export const redirects: { source: string; destination: string; permanent: boolean }[] = ${JSON.stringify(unique, null, 2)};
`;
await writeFile(path.join(root, "content/redirects.ts"), ts);

const by = rows.reduce((a, r) => ((a[r.status.split(" — ")[0]] = (a[r.status.split(" — ")[0]] ?? 0) + 1), a), {});
console.log(`${rows.length} inventory rows, ${unique.length} redirects`);
console.log(by);
