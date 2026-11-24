# Highland Cabinetry — website rebuild

Next.js (App Router) + TypeScript + CSS Modules, built for Vercel. Type: Jost (OFL, self-hosted).
Milestone 4: light, photographic homepage; simple bright-kitchen hero (`components/home/Hero.tsx`); the original finish sampler restored (`components/home/FinishTray.tsx`); homepage sections in `components/home/Editorial.tsx`. See `docs/DESIGN.md`.
First milestone: design system,
homepage, collection browsing, the White Shaker product page (and the 12 other collections on the
same template), quote/dealer/contact flows, service-area hub, URL migration inventory and redirects.

The live site at highlandcabinetry.com is untouched. All non-production deployments are noindexed.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint + content validation + production build
```

Launch checks (run against a production-mode build: `SITE_INDEXING=on NEXT_PUBLIC_SITE_URL=https://highlandcabinetry.com`):

```bash
node scripts/test-launch-seo.mjs          # indexability, canonicals, sitemap, no review text, campaign pages noindex
node scripts/test-migration.mjs           # every old URL and internal link
node scripts/test-lead-delivery.mjs       # email + webhook delivery and every failure path (mock endpoints)
SITE=https://highlandcabinetry.com MAP_TO=http://localhost:3001 node scripts/verify-tracking.mjs
node scripts/verify-production.mjs        # after DNS cutover, on the real domain — docs/launch/CUTOVER.md
node scripts/build-static-fallback.mjs    # portable static copy for rollback on any static host
```

## Environment

See `.env.example`. Nothing is required to run the preview.

| Variable | Purpose |
|---|---|
| `SITE_INDEXING` | `on` only in production at launch. Anything else ⇒ `X-Robots-Tag: noindex`, robots meta noindex, `robots.txt` disallow, preview bar. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (default `https://highlandcabinetry.com`). |
| `SENDGRID_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Leads emailed through SendGrid (reply-to the visitor, with reference and campaign attribution). |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_SECRET` | Optional additional destination: leads POSTed as JSON (HMAC-signed if a secret is set). With no destination configured, forms say plainly that nothing was sent and offer email/phone. A lead counts as sent when at least one destination accepts it. |
| `LEAD_TEST_TOKEN_SHA256` | SHA-256 of a test token (`node scripts/make-lead-test-token.mjs`). Lets `scripts/verify-production.mjs` send marked test leads and read which destinations are configured. Only the hash is stored on the server. |
| `NEXT_PUBLIC_TRACKING=off` | Disables the marketing tags (GTM, Google tag, CallRail), which otherwise load only in production on the canonical host — `docs/launch/TRACKING.md`. |

## Where things live

| Path | What |
|---|---|
| `content/collections.ts` | Lines, finishes, specs (with catalog citations), preserved URLs — CMS-shaped plain data |
| `content/site.ts` | Business facts with `status: confirmed | needs-confirmation` and source |
| `content/locations.ts` | Service-area states/cities from the old sitemap (areas served, not locations) |
| `content/media-sources.json` → `content/media.generated.json` | Approved assets with source URL + SHA-256; generated dimensions/blur |
| `content/redirects.ts` | **Generated** — do not edit |
| `scripts/build-media.mjs` | Verifies archive checksums, writes optimised local images |
| `scripts/build-map.mjs` | Builds the location map (`public/map/us-states.svg`, `content/map.generated.json`) from public-domain Census boundaries |
| `scripts/build-migration.mjs` | Writes `docs/migration/url-inventory.csv` and `content/redirects.ts` from one rule set |
| `scripts/validate-content.mjs` | Media/provenance/alt/redirect integrity checks |
| `docs/LAUNCH-CHECKLIST.md` | Reconciled launch view: blockers, decisions, omitted items, completed work |
| `docs/launch/` | Cutover runbook, tracking, facts register, readiness record and verification reports |
| `docs/migration/url-inventory.csv` | Every archived URL → type, replacement, status, redirect, issues |
| `docs/ASSET-PROVENANCE.md` | Source and checksum for every image and document |
| `docs/DESIGN.md` | Design language and motion rules |

## Adding a collection

Add the finish to `content/collections.ts` (keeping its old URL as `path`), add its renders/scene to
`content/media-sources.json`, run `build-media.mjs`, then `build-migration.mjs` (mark its path built)
and `npm run check`.
