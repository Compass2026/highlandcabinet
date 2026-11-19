# URL migration

`url-inventory.csv` maps every archived URL to its page type, intended replacement, migration
status, redirect requirement and the content/factual issues found. It is generated — edit the rules
in `scripts/build-migration.mjs`, then run:

```bash
node scripts/build-migration.mjs   # rewrites url-inventory.csv and content/redirects.ts
```

## Sources (`source/`)

- `sitemap-urls.json` — the 287 URLs from the old page and post sitemaps (231 pages, 56 posts).
- `linked-not-in-sitemap.json` — linked URLs seen in the reference capture but absent from the sitemap.
  The preservation report says 8 such pages were recovered; their definitive list is in
  `Highland_All_Pages_Text_SEO_and_DNS.zip`, which could not be downloaded (36.7 MB, over the Drive
  connector's 10 MB limit). Re-run with that list when it is available.
- `broken-links-404.json` — the 8 linked URLs that returned 404 during capture.

## Summary (Milestone 1)

| Status | Rows | Meaning |
|---|---|---|
| built | 24 | Rebuilt on the same path (home, collections, 13 products, trade, dealer, contact, quote, service-area hub) or a catalog PDF with a stable new path |
| consolidated | 199 | State and city service-area pages → `/wholesale-cabinets/?state=…` (301). They described areas served, not locations |
| planned | 62 | Same path, rebuilt later: About, Gallery, FAQ, Privacy, Blog index + 56 posts, blog pagination |
| needs decision | 7 | Uptown White, the four legacy “European … gloss” pages (3 in sitemap), free-shipping landing, partner pages |
| redirect | 8 | Duplicate/malformed/404 URLs with an obvious target |
| fix source link | 2 | Broken blog links with no target — fix the links during blog migration |

Principles: keep every path that still has a page; 301 only where content was consolidated or
retired; never create thin pages to preserve a URL; physical locations (Phoenix) are kept distinct
from areas served.
