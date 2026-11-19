# Launch checklist — facts to confirm and dependencies

Status of the first milestone (staging preview). Nothing here changes the live site at
highlandcabinetry.com; DNS and the existing host are untouched.

Legend: **[blocker]** must be resolved before production launch · **[content]** affects copy · **[nice]** can follow launch

---

## 1. Business facts requiring Highland's confirmation

The archive contradicts itself on several points. The preview does **not** silently pick a
winner for anything that matters commercially; where a value had to be shown, it is listed here
and centralised in `content/site.ts` with `status: "needs-confirmation"`.

| # | Fact | What the archive says | What the preview does | Priority |
|---|------|-----------------------|-----------------------|----------|
| 1 | **Shipping / delivery time** | Homepage hero: “Nationwide shipping 10–12 days”. Same homepage, lower: “shipping Nationwide in 7–9 days” and “AVG DELIVERY 7–9 DAYS”. Products page: “8 Days average delivery”. Product pages: “7 Days”. About: “3–5 days” from Phoenix warehouse and “average delivery time of 4 DAYS”. | States **no** delivery time anywhere. Copy says lead times depend on inventory and destination and are confirmed by the account manager. | [blocker] if Highland wants a delivery promise |
| 2 | Inventory / capacity | “Over 20,000 kitchens stocked”, “manufacturing over 25,000 kitchens a month”, “restocked bi-weekly” | Not used | [content] |
| 3 | Customer satisfaction | “97%” (counter, no source) | Not used | [content] |
| 4 | **Phone number** | 480-755-2280 (Contact, Products) · 866.853.7987 (Become a Dealer) · 866-411-2851 (live header bar, archive) · **866-545-6280** (live header bar, Become/Find a Dealer page, seen Nov 2026) | **Resolved (Nov 2026):** 866-545-6280 confirmed by the project team; shown everywhere (single constant in `content/site.ts`) | [done] |
| 5 | **Sales email** | sales@highlandcabinetryinc.com (Contact) · accounting@highlandcabinetry.com (catalogs) — two different domains | Shows sales@highlandcabinetryinc.com; also used for the preview's email fallback | [blocker] |
| 6 | **Phoenix address & role** | 3011 E Broadway Rd Suite 100, Phoenix AZ 85040; “Showroom and Warehouse locations in Phoenix” (plural) | Shown as “Phoenix showroom & warehouse”, the only physical location | [blocker] |
| 7 | Warehouse pickup hours | “Mon–Fri, 8am–3pm” (Phoenix page only) | Shown on service-area/contact pages | [content] |
| 8 | **Who Highland sells to** | Homepage: “suppliers, contractors and homeowners alike”. Phoenix page: “wholesale-only… not the general public… EIN or ROC required” | Trade-first; homeowners routed to dealer referral; quote form asks about EIN/ROC | [blocker] |
| 9 | Legal entity name | Catalogs: “Highland Cabinetry Inc.” · About: “Highland Cabinetry 08, Inc” | Footer uses “Highland Cabinetry Inc.” | [content] |
| 10 | Company history | “Founded in 2018” and “over ten years of experience” on the same page | Not used | [content] |
| 11 | Manufacturing origin | About: “manufactured in Vietnam”. Catalog: “we own our entire supply chain” | Not used | [content] |
| 12 | **Drawer construction** | Website: “5/8″ thick cabinet grade plywood sides”. June 2025 catalog: “½″ thick solid wood sides” | Uses the catalog (newer, dated) and cites it | [blocker] — spec accuracy |
| 13 | Door material | Website: “5 piece… on stained birch; 3 piece… on painted MDF; painted surfaces are MDF”. Catalog: “5-piece drawer fronts”, doors “¾″ full overlay” only. Old cutaway photo label: “birch wood door style” | Only catalog wording shown; door material not stated | [content] |
| 14 | Euro wood finishes | Catalog finish chart: “Melamine (MDF)”. Catalog construction page: “furniture board with laminated surface” | Finish chart wording used as finish type; construction wording in spec sheet | [content] |
| 15 | Uptown White | Listed on several old pages; absent from both June 2025 catalogs | Not shown; old URL proposed to redirect to Shaker line | [content] |
| 16 | “European … gloss” finishes (4) | Old “Euro Finishes Coming Soon” block | Not shown; URLs redirect to Euro line | [content] |
| 17 | **Certifications / memberships** | Brands section shows KCMA “Quality Tested” seal, NKBA logo and a “100% Wood” badge. KCMA's public certificate no. 25068 (kcma.org) lists Highland Cabinetry, Phoenix AZ, issued 1 Jul 2025, **expired 31 Aug 2026**; covers *factory-assembled* lines only (named Crimson, Matrix, Keystone, Castle etc. — not the website's line names); flat-pack not certified. No 2026 certificate found in KCMA's public listing. NKBA membership not verifiable publicly | Homepage “Standards & associations” shows KCMA + NKBA on the **staging preview only**, each tagged “Preview only · awaiting confirmation”. Both are removed automatically when `SITE_INDEXING=on` until marked `confirmed` in `content/site.ts`. “100% Wood” badge **not used**: Euro cabinets use a laminated furniture-board case, so the claim would be untrue for that line | [blocker] — supply the current KCMA certificate (and which lines it covers) and NKBA membership proof; vector logos wanted (archive NKBA logo is 101×61 px) |
| 18 | Warranty | Only appears inside a third-party testimonial (“lifetime warranty on all products”) and as “come with a warranty” on the contractors page | Not used | [content] |
| 19 | Testimonials | Ten “Posted on Google” reviews via Trustindex; no review URLs, dates or verifiable attribution preserved; one Phoenix quote is unattributed | **Not used.** Provide review links (or a live Google review feed) to reinstate | [content] |
| 20 | Volume pricing tiers | Phoenix page: “up to 10% / 15% / 20%” by kitchens per month | Not used | [content] |
| 21 | Design support | “3D renderings, layout planning” (contractors + Phoenix pages) | Mentioned once, generically (“layouts and renderings”) on the contractors page | [content] |
| 22 | Partners & financing | Interior Logic Group partner page; “Blue Tree Financing” | Not used | [content] |
| 23 | Free shipping landing page | `/free-shipping-landing/` | Proposed redirect to Request a Quote; confirm whether the offer still exists | [content] |
| 24 | Installed-project photos | IMG_48xx/49xx/00xx files from the White Shaker gallery (EXIF: iPhone 11 2021, Canon T3i 2022) | Used as “Installed project — White Shaker” | [blocker] — confirm they show Highland White Shaker and that Highland holds the rights |
| 24a | Warehouse photograph | `compressed_warehouseimage.webp` (Become/Find a Dealer section, 2026/03); no camera data | Used in the homepage dealer section, captioned “Highland warehouse” with the line “Stocked, picked and loaded in Phoenix.” | [blocker] — confirm it is Highland's Phoenix warehouse (not stock) |
| 24b | Detail imagery | Brass-pull close-up (`compressed_sigblue6.webp`, Signature Blue page) has no camera data; IMG_4916 crop shows black bar pulls in an installed kitchen | Labelled “Highland rendering” and “Installed project” | [content] — confirm the rendering is Highland's and the pulls shown are offered/compatible |
| 25 | Catalog edition | Two Shaker/Nano PDFs, both “Effective June 2025” (Oct 2025 upload and April 2026 web edition) | Links the April 2026 edition (the one the live nav links) | [content] |

## 2. Access and assets needed

| Item | Why | Priority |
|------|-----|----------|
| **Lead destination** (CRM webhook, Zapier/Make hook, or form service) | Forms currently report honestly that nothing was sent. Set `LEAD_WEBHOOK_URL` (+ optional `LEAD_WEBHOOK_SECRET`) in Vercel | [blocker] |
| Who receives each form type | Quote, dealer application, dealer referral, contact | [blocker] |
| Privacy policy (current text) | Forms collect personal data; old `/privacy-policy/` not yet migrated | [blocker] |
| Full page archive (`Highland_All_Pages_Text_SEO_and_DNS.zip`, 36.7 MB) | Exceeds the Drive connector's 10 MB limit; needed to review every page's text, SEO metadata, and the 8 “recovered” URLs. Share as split ZIPs < 10 MB, or attach to the repo/Release | [blocker] for Milestone 2 |
| Search Console + Analytics access, top-landing-page export | Prioritise which blog/location URLs carry traffic before consolidating | [blocker] |
| Domain registrar + DNS provider control, full zone export | Cut-over plan; preserve email/verification records | [blocker] |
| Close-up photography: dovetail drawer, soft-close glide, hinge, L-bracket, door edge | No usable verified close-ups exist; the old cutaway photo has baked-in labels that conflict with the catalog | [nice] |
| Installed photography for finishes other than White Shaker | Every other collection currently uses catalog renderings (clearly labelled) | [nice] |
| Logo source files (AI/EPS/SVG) | The site uses a vector logo extracted from the catalog PDF; confirm it matches the master | [content] |

## 3. Launch steps (production)

1. Resolve every **[blocker]** above; update `content/site.ts` and flip each confirmed fact's `status`.
2. Set Vercel env vars on **Production only**: `SITE_INDEXING=on`, `NEXT_PUBLIC_SITE_URL=https://highlandcabinetry.com`, `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`.
   - With `SITE_INDEXING` unset (all previews/staging), every response carries `X-Robots-Tag: noindex, nofollow`, pages carry `<meta name="robots" content="noindex,nofollow">`, `robots.txt` disallows all, and the preview bar is shown. Setting it to `on` removes all four.
3. Submit a test lead from production and confirm it arrives.
4. Re-run `node scripts/build-migration.mjs` after decisions on “needs decision” rows; confirm redirects with a crawl of the old sitemap against the new host.
5. Point DNS at Vercel only after Highland confirms; keep the old host available read-only until redirects are verified.
6. Submit `sitemap.xml` in Search Console; monitor 404s for two weeks.
