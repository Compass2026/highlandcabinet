# Highland: SEO baseline and Thursday launch plan

Prepared November 24, 2026. Confirmed old-host cutoff: Thursday, November 26, 2026 at 5:00 p.m. America/Chicago. Search Console access is pending.

## Findings that change the launch work

The DataForSEO pull succeeded through Compass's existing connection. It returned **4,061 distinct US-English organic keyword records across 215 URL paths**, plus **521 page records with backlink metrics**. Six requests cost **$0.590076**. All pagination completed; all requests returned successful task statuses.

The keyword observations range from **August 9 through November 22, 2026**. This is a dated provider database baseline, not 4,061 live rank checks today. Estimated traffic and search volume are provider estimates, not actual visits. Search Console is still needed for Google-reported page/query performance.

| Content group | Keyword records |
|---|---:|
| Blog posts | 3,189 |
| City pages | 684 |
| State pages | 70 |
| Homepage | 54 |
| All other URLs | 64 |

**4,048 records map to paths marked Rebuilt; two map to existing redirects; 11 map to paths absent from the migration inventory.** This is path mapping, not proof that the new content preserves every ranking signal. The rebuilt blog about new kitchen cabinet costs alone has 361 provider keyword records, making it a high-priority manual comparison.

## Thirteen concrete redirect candidates

Eleven older city addresses are absent from the migration inventory and current redirect source. Every one currently returns 404 on the OLD live site. Their corresponding current city destinations are already in the migration inventory. Adding explicit relevant redirects would recover existing broken paths with provider ranking evidence, rather than preserve nonexistent content.

The backlink data also identifies `/about/` (currently 404) and `/blog/how-/` (currently 301 to the kitchen cabinet cost article). Preserve the latter redirect and consider `/about/` to `/about-us/`.

These are proposed changes, not implemented changes. Update the migration generator's source data, regenerate redirects and inventory, and test both slash variants and campaign query parameters. Do not edit only the generated redirects file.

| Old path | Proposed destination | Current old-site status |
|---|---|---:|
| /wholesale-cabinets/texas-old/dallas/ | /wholesale-cabinets/texas/dallas/ | 404 |
| /wholesale-cabinets/alabama-old/birmingham/ | /wholesale-cabinets/alabama/birmingham/ | 404 |
| /wholesale-cabinets/new-york-old/buffalo/ | /wholesale-cabinets/new-york/buffalo/ | 404 |
| /wholesale-cabinets/california-old/anaheim/ | /wholesale-cabinets/california/anaheim/ | 404 |
| /wholesale-cabinets/california-old/los-angeles/ | /wholesale-cabinets/california/los-angeles/ | 404 |
| /wholesale-cabinets/florida-old/tampa/ | /wholesale-cabinets/florida/tampa/ | 404 |
| /wholesale-cabinets/new-mexico-old/albuquerque/ | /wholesale-cabinets/new-mexico/albuquerque/ | 404 |
| /wholesale-cabinets/california-old/san-diego/ | /wholesale-cabinets/california/san-diego/ | 404 |
| /wholesale-cabinets/florida-old/jacksonville/ | /wholesale-cabinets/florida/jacksonville/ | 404 |
| /wholesale-cabinets/texas-old/austin/ | /wholesale-cabinets/texas/austin/ | 404 |
| /wholesale-cabinets/massachusetts-old/worcester/ | /wholesale-cabinets/massachusetts/worcester/ | 404 |
| /about/ | /about-us/ | 404 |
| /blog/how-/ | /blog/how-much-do-new-kitchen-cabinets-cost/ | 301 |

Two additional backlink target paths need review: `/2026-kitchen-cost-trends/` and `/kitchen-remodel-roi/`, each reported with five referring domains. Both currently return 404. Inspect referring pages and original subject matter before assigning destinations. Backlink counts alone do not establish link quality or justify recreating a page.

## Today, Tuesday: secure evidence and remove access blockers

- Completed: fresh old-site preservation archive, current migration review, complete DataForSEO pagination, page/keyword/backlink mapping, and direct HTTP checks of the 15 identified gap paths.
- Builder: add and test the 13 appropriate mappings; review the two ambiguous backlink targets. Keep existing useful location and blog content stable.
- Tom/Highland: provide access to the existing Search Console property when granted, confirm lead recipient addresses, and confirm company-controlled access to DNS, sending service, CallRail, Tag Manager, Ads and Analytics. Credentials should be configured through secure account settings, not copied into this report.
- Obtain a full DNS-zone export from the registrar. Public DNS snapshots cannot enumerate every record.
- Fix the rollback plan: it currently assumes the old WordPress server remains available for 30 days. Do not use that assumption after Thursday's shutdown. Preserve a known-good replacement deployment on company-controlled hosting.

## Wednesday: finish and rehearse

- Merge Search Console page/query data with this baseline when available. Retain source, date range, device/country context and reporting limits. Review branded versus non-branded searches. Do not interpret absent rows as proof of no SEO value.
- Prioritize manual content comparison for pages in page-preservation-priorities.csv, including cabinet costs, cabinet heights, two-tone cabinets, St. Petersburg and Denver. Provider visibility does not prove local branch ownership; confirm business relationships and location claims.
- Configure real email/webhook destinations. Submit each form type and confirm inbox/CRM receipt by reference number. Mock tests and provider acceptance are not proof of final inbox delivery.
- Verify CallRail number replacement and actual call routing, plus campaign-page numbers. Confirm which offers and campaigns remain active.
- Review tracking account ownership and possible duplicate analytics initialization. Establish one intended event per successful submission; avoid changing attribution blindly.
- Resolve factual presentation: privacy text, warehouse/photo provenance, business contact details, sales eligibility and product specifications. Omit or clearly label unverified optional claims rather than inventing them. Image dimensions alone do not prove AI generation.
- Rehearse the exact final production build, redirects, indexability, mobile forms, downloads, HTTPS and fallback deployment. Record the commit and deployment used for each test.

## Thursday: controlled cutover before 5 p.m.

- Aim to be ready Wednesday and schedule the switch with a substantial verification buffer before Thursday's 5 p.m. cutoff. Do not treat 5 p.m. as the start time.
- Use the exact DNS records assigned by Vercel for the project, not illustrative hard-coded values. Preserve email and verification records; verify certificate issuance and hostname redirects.
- Run the production checks against the actual domain. Confirm all known migration URLs, intended indexability, canonical URLs, sitemap, image/PDF access, form receipt, call routing and measurement behavior.
- Keep campaign landing pages noindex if that is their intended existing behavior; public content pages must be indexable. Verify preview protection independently.
- If Search Console is still unavailable, preserve the existing useful pages and record the data gap. Do not let a complete hosting outage become the fallback.
- Submit the sitemap once access permits. Compare subsequent performance with the same sources and time windows. Treat short-term movement as a signal to investigate, not automatic proof of migration failure.

## Remaining evidence gaps

- No Search Console or GA4 export has been analyzed yet.
- The identified redirects are proposed and have not been implemented by this audit.
- Real production inbox receipt, CallRail routing and account control remain to be confirmed.
- The builder reports passing migration/indexability tests; this report does not independently certify the live replacement deployment.
- No DNS or live-site cutover was performed as part of this baseline collection.

## Files

- `keyword-url-baseline.csv`: all 4,061 keyword records, dated observations and migration mapping.
- `backlink-page-baseline.csv`: all 521 page records and link metrics.
- `page-preservation-priorities.csv`: combined URL review priorities. Referring-domain figures use the maximum per URL variant, not a sum that would double-count overlaps.
- `migration-gap-review.csv`: 15 checked paths, observed old-site HTTP status and proposed mappings.
- `proposed-redirects-for-builder.json`: 13 explicit mappings for incorporation into the migration generator.
- `dataforseo-baseline.json`: selected source fields, request settings, task IDs and costs.
- `url-inventory.csv`: inventory snapshot used for the comparison.

The old 324-path inventory is not the full discovered historical URL universe. Reconcile a new total after reviewing and incorporating these additional sources.
