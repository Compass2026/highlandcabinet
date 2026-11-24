# URL migration

`url-inventory.csv` lists **every URL of the previous site** — 324 unique paths — with exactly one status.
It is generated, together with `content/redirects.ts` and `content/gone.ts`, by:

```bash
node scripts/build-migration.mjs          # inventory + redirects + 410 list
BASE=http://localhost:3000 node scripts/test-migration.mjs   # tests every row and every internal link
```

## Sources reconciled

| Source | URLs |
|---|---|
| archive sitemap | 287 |
| live sitemap (2026-11-24) | 295 |
| WordPress published pages | 245 |
| WordPress posts | 56 |
| linked (archive) | 3 |
| linked 404 (archive) | 8 |
| documents (PDF) | 4 |
| **Unique paths after de-duplication** | **324** |

The live sitemap and the WordPress page export overlap heavily with the archive; the WordPress export adds 13 published pages
that were never in the sitemap (campaign landings, thank-you pages, an embed fragment, an old gallery and the large-projects page).

## Result

| Status | Paths | Meaning |
|---|---|---|
| Rebuilt | 282 | Same path serves a rebuilt page (200) |
| Redirect | 36 | Permanent redirect (308) to the most relevant page |
| Removed | 6 | Deliberately retired: 2 answer 410 Gone (`/oops/`, `/iframe-36/`); 3 mega-menu query URLs resolve to the homepage; 1 malformed doubled link |
| Unresolved | 0 | — |

Rebuilt breaks down as: home 1, collections index 1, product collections 13, trade 1, large projects 1, dealer/find-a-dealer forms 2, contact 1,
about 1, gallery 1, FAQ 1, privacy 1, partners 2, blog index 1, blog posts 56, service-area hub 1,
state pages 50, city pages 148.

**Test run:** 323 paths requested (the malformed link is not requestable) — 285 × 200, 36 × 308, 2 × 410 — plus
296 internal links crawled from every rebuilt page: **0 failures**. Report: `test-report.json`.

## Review flags (207 rows)

Rebuilt does not mean approved. Rows carry flags for individual review:

| Flag | Rows |
|---|---|
| thin/templated original | 190 |
| verify local office details | 143 |
| needs Highland confirmation | 4 |
| review images | 4 |
| confirm offer retired | 1 |
| wrong metro in delivery line | 1 |
| confirm discontinued | 1 |

### Service-area pages (199 → 198 rebuilt, 1 redirected)

The previous state and city pages were one ~1,200-word template with the place name swapped: 49 of 50 state pages and
141 of 149 city pages had fewer than 150 words of their own. Every page repeated claims that are not supported
(“20,000+ kitchens in stock”, “5-star Google reviews”, “thousands of contractors”, an unattributed contractor
testimonial with the city name swapped in, savings tiers of 10–20%, installation, 3D renderings included, no minimum
order, “Highlend” typo, an outdated phone number).

They are rebuilt at their original paths — so existing rankings and links keep resolving — with the genuinely local
material they held (nearby communities served; local city-hall, permit and housing-office contacts) plus verified
ordering facts, line/finish links and a location-tagged quote form. None of the unsupported claims were carried over.
Each page shows a preview-only review note listing what was flagged and what was dropped.
`/wholesale-cabinets/wisconsin-old/madison-old/` (an outdated duplicate) redirects to the current Madison page.
**Decide per page with Search Console data**: keep, strengthen with local projects, or consolidate.

### Blog (56 posts)

Imported from the WordPress REST API with HTML sanitised to an allow-list (`scripts/wp-export/`). 45 Highland-specific
claims were corrected to what the June 2025 catalogs support (delivery-day promises, “all-wood”, soft-close doors,
semi-custom, “since 2018” …) — every change is logged in `wp/blog-audit.json`. 28 images were removed: 22 carry
AI-generation evidence (DALL·E filenames or OpenAI C2PA metadata) and 6 were hot-linked Google Docs images that are
already broken on the live site; 46 image links that were malformed on the live site now work. 6 images are flagged
for AI-generator dimensions without proof either way. Posts without a usable cover show a labelled Highland rendering.

### Gallery

Rebuilt from images whose origin is clear. `wp/gallery-exclusions.md` lists the 89 previous gallery images left out
and why (AI-generated, stock, apparent third-party brand, retired finish, or unverifiable).

## Files

- `source/` — archive URL lists, live sitemap and WordPress exports (2026-11-24)
- `wp/blog-audit.json`, `wp/gallery-exclusions.md` — content review logs
- `summary.json`, `test-report.json` — generated counts and the latest test run
