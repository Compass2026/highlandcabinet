# Priority content checks — DataForSEO baseline (24 Nov 2026)

Source: `baseline-2026-11-24/page-preservation-priorities.csv` (provider observations Aug–Nov 2026; estimated traffic is a
provider model, **not** Search Console data). All 209 “PRESERVE AND VERIFY” pages are rebuilt at their URLs and stay;
nothing was consolidated. Re-run: `ORIG=<captured old pages> BASE=<production build> python3 scripts/seo/priority_checks.py`.

## Method

For every page, each provider keyword counts as *answerable* if all its significant words appear in the page's title,
H1 or body. The check compares the **old page** (captured 24 Nov) with the **rebuilt page**, so it reports only what the
rebuild lost — not keywords the old page never answered either. Full results: `priority-content-checks.csv`.

## Result

| | Pages |
|---|---|
| No loss against the old page | 193 |
| Flagged for reading (≥1 keyword the old page answered and the new page does not) | 16 |

**Blog posts** (the bulk of provider keywords — 3,189 records): kitchen-cabinet cost (361 records), cabinet heights (216),
two-tone ideas (118), cabinet-door replacement cost, refacing, drawers, cabinets-to-the-ceiling and the rest lose
nothing material. The only flag (`standard-kitchen-cabinet-sizes-and-dimensions`, “how deep…”) is a false positive:
on the old page “deep” occurred only in the author bio.

**The one real loss — the HCI brand name.** The old site used Highland's abbreviation “HCI” in titles and text; the
rebuild did not. Provider data attribute branded searches to it (“hci cabinets”, est. 786/month on the homepage; also
the partners page, St. Petersburg, West Jordan, Chicago). **Restored** without touching titles: footer brand line
“Highland Cabinetry (HCI)” on every page, logo alt text, and `alternateName: ["HCI", "Highland Cabinetry Inc."]` in
the Organization structured data.

**Deliberately not restored** (words that came only from removed claims or other companies' names): “nationwide”,
“import”, “bulk/shipping” template lines, “Cabinets To Go” (a competitor), “Highland Cabinetry Inc reviews” (no
verifiable reviews are published).

## Location pages: St. Petersburg and Denver

Both are high on the list because of links (11 and 18 referring domains) and branded local queries (“highland
cabinetry st pete”, “… fort myers”, “… west palm”). The linking pages (reviewed via DataForSEO, 24 Nov) are
article-network placements that describe Highland with claims the company's own materials do not support: a “local
St. Petersburg branch”, “200,000 cabinets in stock”, “Colorado's largest inventory”, “lifetime warranty”, “all-wood”,
“4-day freight”. The rebuilt pages make **no** local-branch or inventory claims; Phoenix is stated as the only location.

- **Highland to confirm:** whether it has any Florida or Colorado branch, showroom or partner. If not, the branded
  “Highland Cabinetry Fort Myers / West Palm / St Pete” searches may concern a different business; nothing should be
  added that implies a local office.
- Treat these links as low-quality: do not build on them; consider them when reviewing Search Console's Links report.

## Waiting for Search Console

Re-rank this list with Google-reported clicks/impressions per page and query (16 months), then read the top pages by
real traffic first. Absence from the provider export is not evidence of no value; no page is to be removed or merged
on that basis.
