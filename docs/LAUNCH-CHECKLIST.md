# Launch checklist — reconciled 24 Nov 2026

Old-host cutoff: **Thursday 26 Nov, 5:00 pm Central.** Target: preparation finished **Wednesday**, DNS switched
**Thursday morning**, with the full verification run and the afternoon kept as buffer. DNS is not to be changed without
explicit go-ahead. Evidence behind every fact and asset: `docs/launch/FACTS-REGISTER.md`. Procedure: `docs/launch/CUTOVER.md`.

## A. Launch blockers — must be closed before the DNS switch

| # | Blocker | Owner | Status |
|---|---|---|---|
| B1 | **Lead delivery configured** — `SENDGRID_API_KEY` (Mail Send only, from Highland's SendGrid account, which already authenticates highlandcabinetry.com) and `LEAD_EMAIL_TO`, entered in Vercel → `highland-cabinetry` → Production | Highland / Tom | Open — code and tests done (46/46 mock checks); production reports “not-configured” until set |
| B2 | **Inbox receipt confirmed for each form type** (quote, dealer application, dealer referral, contact) — `verify-production.mjs` sends marked test leads; a person confirms each reference arrived in `docs/launch/lead-receipt.json` | Highland recipient + builder | Open — depends on B1. An accepted API request is not proof |
| B3 | **CallRail**: swap target changed to the number the site shows, or the site number changed (see D1); a test call from an ad-click session routes to the right phone | Highland (CallRail admin) | Open |
| B4 | **Account control confirmed** — Highland (not only an agency or former vendor) has admin access to each account in §E | Highland | Open |
| B5 | **Rollback hosting Highland controls** — either `highland-cabinetry` transferred to a Highland-owned Vercel team, or the static fallback uploaded to a Highland-owned static host (§D in CUTOVER.md) | Highland account + builder | Open — fallback built and verified; needs a Highland account to live in |
| B6 | **GoDaddy**: access for the switch and a full zone export | Highland | Open |
| B7 | **Production test token**: run `node scripts/make-lead-test-token.mjs` on the operator's machine, set `LEAD_TEST_TOKEN_SHA256` (the hash) in Vercel, keep the token in a password manager; delete the obsolete `LEAD_TEST_TOKEN` variable | Operator | Open — mechanism deployed and tested |
| B8 | Final production deployment re-verified (SEO gate, migration incl. variants, tracking) on the exact commit going live | Builder | Done for `READINESS.md`'s commit; repeat if anything changes |

## B. Highland decisions (with the default if there is no answer by Wednesday noon Central)

| # | Decision | Default |
|---|---|---|
| D1 | Phone number shown site-wide: keep **866-545-6280** and add it as CallRail swap target, or show **480-755-2280** (CallRail's current swap target) | Keep 866-545-6280; CallRail target must then be changed (B3) |
| D2 | Which Luxe campaigns and the Q4 blowout offer are live | Luxe pages stay (noindex, own numbers); blowout keeps redirecting to Request a quote, offer not restated |
| D3 | Warehouse photograph: confirm it is a real photo of Highland's warehouse, with rights | **Omitted in production** (labelled catalog rendering shown instead); set `warehousePhoto.status = "confirmed"` in `content/site.ts` to show it |
| D4 | Any Florida/Colorado branch or partner (third-party articles claim a “local St. Petersburg branch”) | No local presence claimed; Phoenix only |
| D5 | Lead recipients per form type (one inbox, or split) | One list for all types |
| D6 | Who hosts long-term: Highland Vercel team (keeps forms working) vs. static host (fallback only) | Highland Vercel team, static fallback as second line |

## C. Omitted by default — may remain omitted at launch

Not shown in production; nothing breaks without them. Reinstate only with evidence (see FACTS-REGISTER).

| Item | Production behaviour |
|---|---|
| Delivery-day promises (3–5 / 7–9 / 10–12 days), inventory and capacity counts, “97% satisfaction”, “all wood”, soft-close on Shaker/Nano, lifetime warranty, volume-discount tiers, free shipping, installation, founding year, origin | Not stated anywhere |
| KCMA and NKBA marks | Hidden in production until marked confirmed (KCMA certificate 25068 expired 31 Aug 2026) |
| Testimonials / Google reviews | Not shown (no verifiable sources) |
| Warehouse photo | Rendering shown instead (D3) |
| 89 gallery images and 22 blog images with AI, stock or third-party evidence | Excluded |
| Close-up and non-White-Shaker installed photography | Labelled catalog renderings used |

## D. Should be reviewed by Highland, not blocking

Privacy policy wording (restored from Highland's own previous policy, placeholders filled) · sales email on
highlandcabinetryinc.com · Phoenix address/hours · trade-only wording (EIN/ROC) · drawer-box spec (catalog ½″ solid
wood used) · FAQ byline · ILG partnership · installed-photo rights · 45 logged blog claim corrections · local office
listings on city pages.

## E. Accounts Highland must control (B4)

| Service | Identifier found | Used for |
|---|---|---|
| GoDaddy DNS | ns53/ns54.domaincontrol.com | Domain, mail records |
| Microsoft 365 | MX highlandcabinetry-com.mail.protection.outlook.com | Email |
| SendGrid | DKIM `s1/s2._domainkey` → u59662958.wl209.sendgrid.net | Lead email |
| Google Tag Manager | GTM-NM4FXR2B, GTM-P6MLRTDB | All tags |
| Google Ads | AW-341905256 (lead label Cw3ACLXbtNscEOiehKMB, phone label HWzwCN6-zdscEOiehKMB) | Conversions |
| Google Analytics 4 | G-C6W9KJ2WD5, G-39WL49D4VK (Site Kit tag GT-T5JX78GN) | Analytics |
| Meta | Pixel 3327097927378760 | Lead/Contact events |
| Hotjar | 5268522 | Session analytics |
| CallRail | Company 843918300 | Call tracking, swap target 480-755-2280 |
| Search Console | `google-site-verification=CWQq…` (DNS TXT) | Indexing, sitemap |
| Vercel | Team Compass Marketing → project `highland-cabinetry` (production), `highland-cabinetry-preview` (review) | Hosting |

## F. After launch

Search Console: submit sitemap; merge page/query data with the provider baseline (`docs/seo/PRIORITY-CONTENT-CHECKS.md`)
before any service-area decision; no page is removed or merged because an export shows no traffic. Watch 404s and
Google Ads conversions daily for the first week. Confirm the Meta pixel in Events Manager (not observable from the test
environment).

## G. Completed (evidence)

| Work | Evidence |
|---|---|
| 339 old URLs: 288 rebuilt, 45 redirects (incl. 15 from the SEO baseline), 6 removed, 0 unresolved; every redirect also tested without/with slash and with gclid/utm (82 variants) | `docs/migration/`, `docs/launch/READINESS.md` |
| `/2026-kitchen-cost-trends/`, `/kitchen-remodel-roi/` reviewed (linking pages + relevance) → Kitchen Remodeling Cost Breakdown for 2026 | `docs/migration/source/seo-baseline-2026-11-24.json` |
| 209 priority pages checked against the old pages; HCI brand alias restored | `docs/seo/PRIORITY-CONTENT-CHECKS.md` |
| Indexability gate (canonicals, sitemap, noindex only where intended, no review text) | `docs/seo/launch-check.json` |
| Tracking: tags load on the canonical host only; 1 Ads lead conversion + 1 GA4 generate_lead per confirmed lead; phone conversion on tel: click; nothing on failed leads | `docs/launch/tracking-check.json` |
| Lead pipeline: email + signed webhook, honest failure states, reference numbers, attribution | `docs/launch/lead-delivery-test.json` |
| Static fallback independent of Vercel, verified with the same suites | `docs/launch/fallback-*.json` |
| DNS baseline (mail, DKIM, DMARC, verification) | `docs/launch/dns-baseline.json` |
