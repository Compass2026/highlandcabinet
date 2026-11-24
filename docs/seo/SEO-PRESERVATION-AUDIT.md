# SEO preservation audit — highlandcabinetry.com → rebuilt site

Audit date: 24 November 2026. Compared: every rebuilt URL of the previous site against the new site built in
**production mode** (`SITE_INDEXING=on`, `NEXT_PUBLIC_SITE_URL=https://highlandcabinetry.com`).

Detail files in this folder:

| File | What it holds |
|---|---|
| `page-comparison.csv` | One row per rebuilt URL (282): old vs new title, meta description, H1, inferred keywords, word count, headings not covered, internal links, structured data, images, PDFs, robots, canonical |
| `summary-by-type.json` | The same, aggregated by page type |
| `launch-check.json` | Production indexability gate (`scripts/test-launch-seo.mjs`) |
| `migration-test-production.json` | Every old URL + every internal link, against the production build |

## 1. Method and limits

- **Original pages.** The preservation archive's page-text bundle (`Highland_All_Pages_Text_SEO_and_DNS.zip`, 36.7 MB)
  could not be read through the Drive connector (10 MB limit). The originals were therefore captured from the live
  site on 24 Nov 2026 — the same WordPress content the archive was taken from on 17 Nov (per-page WordPress modified
  dates are in `docs/migration/source/wp-pages-2026-11-24.json`). 319 URLs fetched; 312 returned 200, 7 were
  already 404 on the old site (broken internal links, all now redirected).
- **Elements compared** from rendered HTML, excluding the site-wide header and footer: `<title>`, meta description,
  meta robots, canonical, H1, H2/H3 topics, word count, in-content internal links, JSON-LD types, images, PDF links.
- **Topic coverage** is measured by whether a heading's words appear on the new page. It is a heuristic: it
  catches lost sections well but also reports a few false positives.
- **Keywords.** No search-query data was available. Every keyword in this report and the CSV is **inferred** from the
  original title, H1 and URL — *not* a verified query. See §6.

## 2. Preserved

| Element | Result |
|---|---|
| URLs | 282 rebuilt at their original path (+6 noindex campaign landings rebuilt later for ad tracking); 30 redirected; 6 removed; 0 unresolved (`docs/migration/`) |
| Titles | 198 service-area pages keep their **original title verbatim** (brand suffix “\| HCI” → “\| Highland Cabinetry”). 56 blog posts keep their original titles (the old “\| HCI” suffix on 14 of them is replaced by “\| Highland Cabinetry”, not appended to). All other titles keep the original's search terms (see §3) |
| Meta descriptions | Present and unique on every page. Blog posts keep their originals (54 had one; the 3 without use a short excerpt of the corrected text) |
| H1 | Present on every page. Service-area H1s keep the original wording (“Wholesale kitchen & bathroom cabinets for {Place} contractors”). Blog H1s unchanged |
| Topics | Blog posts: no article content lost (only the old sidebar's “Related Articles” widget). Service-area pages: every accurate topic restored (§4) |
| Internal links | All 296 internal links on the new site resolve. Service-area pages keep links to products, contact, the hub, the state page, sibling cities and the catalogs |
| Structured data | BreadcrumbList on every page (was provided by Yoast; restored on static pages during this audit). Added: Product (13), Service (198), FAQPage (199), BlogPosting (56), Organization/WebSite |
| PDFs | All four old PDFs redirect to stable local copies (Shaker/Nano catalog ×2 editions, Euro catalog, remodeling checklist); catalog links restored on every service-area page and the gallery |
| Images | Every product, finish and service-area page carries an image; blog posts keep their images except those removed for AI-generation evidence (§3) |

## 3. Material changes (deliberate)

**Unsupported claims removed** everywhere — they were the bulk of the lost words on the service-area pages:
“20,000+ kitchens in stock”, “25,000 kitchens a month”, “97% satisfaction”, “5-star Google reviews”, delivery-day
promises (7–9 / 10–12 / 3–5 / 4 days), “all-wood”, soft-close doors on Shaker/Nano, savings tiers of 10–20%,
installation, 3D renderings included, “container-direct shipments”, unattributed testimonials, and the superseded
phone number. The adjective “Premium” was dropped from 12 product titles.

**Word counts** fall on most templated pages because of those removals:

| Page type | Pages | Avg words, old | Avg words, new |
|---|---|---|---|
| City | 148 | 1,397 | 732 |
| State | 50 | 1,311 | 645 |
| Product collection | 13 | 726 | 563 |
| Blog post (old count includes sidebar widgets) | 56 | 2,331 | 2,187 |
| Trade (contractors) | 1 | 877 | 418 |
| Large-scale projects | 1 | 689 | 320 |
| Home | 1 | 435 | 1,194 |

**Titles changed** (core pages) — search terms kept, wording tidied:

| URL | Old title | New title |
|---|---|---|
| / | RTA Kitchen & Bathroom Wholesale Cabinets \| Highland Cabinetry | RTA Kitchen & Bathroom Wholesale Cabinets for the Trade \| Highland Cabinetry |
| /products/ | Product Catalog | Cabinet Collections & Product Catalog — Shaker, Nano & Euro |
| /wholesale-cabinets-for-contractors/ | Wholesale Cabinets For Contractors Builders & Flippers \| HCI | Wholesale Kitchen & Bathroom Cabinets for Contractors, Builders & Flippers |
| /wholesale-cabinets/ | Find Highland Cabinetry Wholesale Cabinets Near You | Wholesale Cabinets Near You — Service Areas from Phoenix, AZ |
| /gallery-of-highland-cabinets/ | Highland Cabinetry Gallery \| Wholesale Kitchen Cabinets | Kitchen Cabinet Gallery — Shaker, Nano & Euro Wholesale Cabinets |
| /wholesale-white-shaker-cabinets/ (pattern for all 13) | Wholesale White Shaker Cabinets | Wholesale RTA White Shaker Cabinets |
| /wholesale-gray-shaker-cabinets/ | Wholesale Gray Shaker Cabinets | Wholesale RTA Grey Shaker Cabinets (Gray Shaker) |
| /wholesale-white-frost-euro-cabinets/ | Premium RTA Wholesale White Frost Euro Cabinets | Wholesale RTA Frost White Euro Cabinets (White Frost) |
| /about-us/ | (brand only) | About Highland Cabinetry — Wholesale RTA Cabinets from Phoenix, AZ |
| /most-searched-questions-for-kitchen-renovation/ | Learn the Most Searched Questions for Kitchen Renovation | The Most Searched Questions for Kitchen Renovation, Answered |
| /wholesalers-large-scale-projects/ | Wholesalers & Large Scale Projects | Commercial Cabinetry for Wholesalers & Large-Scale Projects |

Words dropped from core titles: “learn more” (About), “locate” (Find a dealer), “find” (hub), “learn/expert” (FAQ),
“built/grade” (large projects) — none carry distinct intent.

**Images.** Blog: 22 AI-generated images removed (DALL·E filenames or OpenAI C2PA metadata), 6 dead hot-linked
images removed, 46 images that were broken on the old site (malformed URLs) now load. Gallery: 89 images excluded
(AI-generated, stock, apparent third-party “CWS”, or unverifiable — `docs/migration/wp/gallery-exclusions.md`).
The old site's image counts in the CSV are understated because many were CSS backgrounds.

**Structured data.** The old site's Yoast graph (`WebPage`, `ImageObject`, `Person` author) is not reproduced. Blog
authorship is attributed to the organisation, not to an individual.

## 4. Fixed during this audit

1. **All 56 blog posts shared one `<title>` and one meta description** (“What are The Best Cities for Gen Z…”). The
   WordPress REST API returned the same Yoast fields for every post; titles/descriptions are now taken from each
   post's rendered HTML (`content/blog/post-meta.json`).
2. **Blog excerpts were ~1,000 words of uncorrected copy**, inflating `/blog/` to 840 KB and re-exposing removed
   claims. Excerpts now come from the corrected text (`/blog/` 211 KB, no removed claims).
3. **Service-area pages lost legitimate intent.** Restored, accurately:
   - original titles verbatim, and the original H1 wording;
   - “We serve {Place} trade professionals” (builders & developers, general contractors, flippers & investors,
     remodelers, handymen & installers, restoration companies, dealers & suppliers);
   - “How it works” (four steps, rewritten to Highland's actual account process);
   - “RTA cabinet styles for every project” with all 13 finishes and both catalog PDFs;
   - “Delivery options” (catalog-verified), “Large projects & multi-unit developments”;
   - “Questions from {Place} contractors”: license/EIN, minimum order, multi-unit projects, lead times, design support
     — with FAQPage markup. *Not restored:* “Do you provide installation?” (unsupported);
   - “{Place} city facilities and services”, links to the state page, sibling cities and all service locations;
   - descriptions keep the original phrasing (“Improve your {Place} projects with … RTA kitchen & bathroom
     cabinets”) without the “shipped in 7–9 days” promise, and include the state to stay unique.
4. **Product pages**: “RTA”, “Wholesale” and “Euro” restored in titles/H1s; “Gray” and “White Frost” variants kept;
   every product page links to every other finish, the gallery and contact (as the old pages did).
5. **Contractors page** links to the Nano and Euro finishes again; **gallery** links the catalog PDFs again.
6. **BreadcrumbList** restored on 15 static pages.
7. **Redirect relevance** — two targets changed (§5).
8. **Brand repeated in 18 titles** (“… \| HCI \| Highland Cabinetry”, “About Highland Cabinetry \| Highland Cabinetry”):
   fixed, and the launch gate now fails on any repeated brand.

## 5. Redirect relevance review (36 at audit time; 30 now)

| Old URL | Original page | Target | Verdict |
|---|---|---|---|
| /wholesale-uptown-white-cabinets/ | Indexed product page, painted white Shaker door | /wholesale-white-shaker-cabinets/ | **Changed** from /products/ — closest current product |
| /free-shipping-landing/ | Indexed duplicate of the old homepage | / | **Changed** from /request-a-quote/ — same content as the homepage |
| /european-{dark-mirror,dark-wood,light-mirror}-gloss-finish/ (+2 broken variants) | Indexed “coming soon” gloss finishes, ~1,000 words each | /products/#line-euro | Relevant: Euro line section; no gloss finish exists to match. Search engines treat this as /products/ |
| /new-luxe-shaker-{arizona,california,national,new-mexico,texas,utah}/ | noindex campaign landings, each with its own call-tracking number | /wholesale-luxe-shaker-cabinets/ | **Superseded:** now rebuilt at their URLs with their own call-tracking numbers (noindex), so ad calls stay attributed — `docs/launch/TRACKING.md` |
| /blowout-specials/ | noindex, expired Q4 promotion | /request-a-quote/ | Acceptable — promotion retired |
| /blog/category/uncategorized/, /blog/author/…/, /blog/page/2/ | Blog archives | /blog/ | Relevant |
| /blog/gallery-tab-category/{shaker,nano,euro}-style/ | Gallery category archives | /gallery-of-highland-cabinets/#{line}-style | Relevant |
| /blog/replace-cabinets-keep-countertops/ | Old slug (404) | /blog/can-you-replace-cabinets-and-keep-countertops/ | Exact match |
| /wholesale-cabinets/wisconsin-old/…, /wholesale-cabinets/North Dakota/ | Outdated duplicate / malformed link | Current Madison / North Dakota pages | Exact match |
| /wholesale-onyx-black-shaker-cabinets/ | Plural duplicate | /wholesale-onyx-black-shaker-cabinet/ | Exact match |
| /find-a-dealer-2/, /old-gallery-of-highland-cabinets/, /thank-you/, /locate-dealer-thank-you/ | noindex utility pages | Find a dealer / Gallery / Contact / Find a dealer | Relevant |
| /white-shaker-cabinets/, /shaker-cabinets, /collections/all, /wholesale/ | Broken links (404) | White Shaker / Shaker line / Products / Contractors | Relevant |
| 4 × /wp-content/uploads/…pdf | Catalogs and checklist | /catalogs/…, /downloads/… | Same documents |

All redirects are single-hop 308s except the two slash-less legacy links (one extra hop to add the slash).

## 6. Keywords — inferred vs verified

- **Verified queries: none.** No Search Console, analytics or rank data was available.
- **Inferred keywords** (CSV column `inferred_keywords`) come from each original page's title, H1 and URL — e.g.
  `/wholesale-cabinets/texas/dallas/` → *rta, bathroom, kitchen, cabinet, contractor, dallas, texas*. They describe
  what the page was *built* to target, not what it ranked for.
- Every inferred keyword is still present in the new title, H1 or body on every page except where noted in §3.

## 7. Production indexability — confirmed

`scripts/test-launch-seo.mjs` against the production build: **283 pages, 0 failures.**

- No `noindex` in meta robots or `X-Robots-Tag` on any indexable page (only the two 410 pages carry noindex).
- Canonical = `https://highlandcabinetry.com` + path on every page.
- `robots.txt` allows crawling (except `/api/`) and points to `https://highlandcabinetry.com/sitemap.xml`.
- Sitemap lists exactly the 282 rebuilt URLs plus `/request-a-quote/`; no redirected or removed URL.
- Titles and meta descriptions present and unique site-wide (three same-named city pairs were de-duplicated); no title
  repeats the brand.
- **Internal review notes are absent in production:** no “Preview only”, migration-review, “awaiting confirmation”
  or staging text on any page; the preview bar and the unconfirmed KCMA/NKBA marks are not rendered. These notes
  remain visible only on the staging preview (`SITE_INDEXING` unset), for Highland's review.

Launch requires `SITE_INDEXING=on` and `NEXT_PUBLIC_SITE_URL=https://highlandcabinetry.com` on the production
deployment (see `docs/LAUNCH-CHECKLIST.md`).

## 8. Unresolved risks

1. **Thinner service-area pages.** City/state pages are ~half their former length. The missing half was unsupported
   claims, but the pages are still template-led; Google may treat many as near-duplicates (it may already have).
2. **No ranking data.** Titles/H1s were preserved conservatively because we cannot see which pages earn traffic.
3. **Removed AI images** may have ranked in image search; they are not replaced.
4. **Campaign call tracking** on the six Luxe landing pages is lost on redirect.
5. **Yoast `Person` author markup** dropped; low risk.
6. **Facts awaiting Highland** (launch checklist): KCMA status, EIN/ROC requirement wording, soft-close hinges (the old
   Uptown White spec lists them; the June 2025 catalog does not), local office details on 144 city pages.

## 9. Awaiting Search Console data

When Highland grants access, export *Pages* and *Queries* (16 months) and *Links*, then:

- **Service-area pages:** keep and strengthen pages with impressions/clicks; consolidate pages with none into the state
  page (301) — decide per page.
- **Titles:** for pages whose top queries differ from the inferred keywords, retune titles to the verified queries.
- **Blog:** prioritise refreshes for posts with impressions; check whether any removed image drove image-search traffic.
- **Euro gloss redirects:** if those URLs still draw impressions, consider a dedicated Euro line page.
- **Backlinks:** confirm every externally linked URL is in the inventory (any not listed would 404).
