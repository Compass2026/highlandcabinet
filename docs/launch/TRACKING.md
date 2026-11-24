# Campaign tracking — what was preserved and how it is verified

Found on every page of the live site (captured 24 Nov 2026) and decoded from the public container files:

| Tag | What it does | On the new site |
|---|---|---|
| **GTM-NM4FXR2B** | Google Ads AW-341905256 conversions: **lead** (label `Cw3ACLXbtNscEOiehKMB`, on dataLayer event `generate_lead`) and **phone** (label `HWzwCN6-zdscEOiehKMB`, on any `tel:` link click); GA4 G-C6W9KJ2WD5 (scroll, video, contact_email, contact_phone, generate_lead); Meta pixel 3327097927378760 (Lead, Contact, Schedule); conversion linker; remarketing | Loaded unchanged |
| **GTM-P6MLRTDB** | GA4 G-39WL49D4VK, Hotjar 5268522 | Loaded unchanged |
| **GT-T5JX78GN** (Site Kit) | GA4 G-39WL49D4VK + `config AW-341905256` | Loaded unchanged (as before, G-39WL49D4VK is configured twice — tidy up in GTM later, not changed here) |
| **CallRail** company 843918300 | `swap.js` swaps **480-755-2280** for a tracking number on tracked traffic | Loaded — **but see the swap-target decision below** |

The old site fired `generate_lead` from a custom GTM tag that watches for WPForms' success message. The new forms push the
same event themselves — **only after the server confirms the lead was delivered** (never for validation errors, an
unconfigured destination, a failed delivery, or the spam honeypot). The old WPForms listener tag stays harmlessly idle.

**Where tags run:** production build (`SITE_INDEXING=on`) served from `highlandcabinetry.com` only. Staging, previews and
`*.vercel.app` load nothing. Tags load after the page has finished loading. Configuration: `content/tracking.ts`.

## Campaign landing pages

The six `/new-luxe-shaker-*` pages are rebuilt at their URLs (noindex, not in the sitemap, as before) with each page's own
number: AZ 602-529-3712 · CA 213-559-1679 · National 623-292-4614 · NM 505-576-8058 · TX 214-919-3467 · UT 801-877-0291.
All other redirects pass `gclid`/`utm_*` through to the destination.

## Lead attribution

Every lead now carries its first and latest campaign touch (gclid, gbraid, wbraid, fbclid, msclkid, utm_*, landing page,
external referrer), captured in the visitor's browser and shown in the lead email / webhook. This allows offline
conversion import from the CRM later; nothing is sent anywhere until the visitor submits a form.

## ⛔ CallRail swap target

The site shows 866-545-6280 (confirmed by the project team). CallRail is configured to swap 480-755-2280, which no longer
appears, so **ad-driven calls would not get a tracking number**. Fix in CallRail (add 866-545-6280 as a swap target,
or replace the target) — or show 480-755-2280. The six Luxe landing numbers are unaffected. The phone *click* conversion
in Google Ads is unaffected either way.

## Verification

`scripts/verify-tracking.mjs` runs a real browser against the site (before cutover: the production build served under
the real hostname inside the test browser only). It aborts every measurement request so nothing is recorded, and checks
that all four tags load, the lead conversion fires after a confirmed lead and not after a failed one, the phone
conversion fires on a `tel:` click, the lead carries gclid/utm, and other hosts load nothing. Latest: `tracking-check.json`
(12/12 pass against the production build).
