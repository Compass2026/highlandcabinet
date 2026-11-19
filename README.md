# Highland Cabinetry — website rebuild

Next.js (App Router) + TypeScript + CSS Modules, built for Vercel. Type: Libre Caslon Display + Mona Sans (OFL, self-hosted).
Milestone 3: airy photographic redesign; showroom cabinet opening (`components/home/Hero.tsx`, `hero.css`, `heroIntro.ts`); editorial homepage sections in `components/home/Editorial.tsx`.
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

## Environment

See `.env.example`. Nothing is required to run the preview.

| Variable | Purpose |
|---|---|
| `SITE_INDEXING` | `on` only in production at launch. Anything else ⇒ `X-Robots-Tag: noindex`, robots meta noindex, `robots.txt` disallow, preview bar. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (default `https://highlandcabinetry.com`). |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_SECRET` | Where form submissions are POSTed as JSON (HMAC-signed if a secret is set). Unset ⇒ forms say plainly that nothing was sent and offer email/phone. |

## Where things live

| Path | What |
|---|---|
| `content/collections.ts` | Lines, finishes, specs (with catalog citations), preserved URLs — CMS-shaped plain data |
| `content/site.ts` | Business facts with `status: confirmed | needs-confirmation` and source |
| `content/locations.ts` | Service-area states/cities from the old sitemap (areas served, not locations) |
| `content/media-sources.json` → `content/media.generated.json` | Approved assets with source URL + SHA-256; generated dimensions/blur |
| `content/redirects.ts` | **Generated** — do not edit |
| `scripts/build-media.mjs` | Verifies archive checksums, writes optimised local images |
| `scripts/build-migration.mjs` | Writes `docs/migration/url-inventory.csv` and `content/redirects.ts` from one rule set |
| `scripts/validate-content.mjs` | Media/provenance/alt/redirect integrity checks |
| `docs/LAUNCH-CHECKLIST.md` | Facts to confirm, access needed, launch steps |
| `docs/migration/url-inventory.csv` | Every archived URL → type, replacement, status, redirect, issues |
| `docs/ASSET-PROVENANCE.md` | Source and checksum for every image and document |
| `docs/DESIGN.md` | Design language and motion rules |

## Adding a collection

Add the finish to `content/collections.ts` (keeping its old URL as `path`), add its renders/scene to
`content/media-sources.json`, run `build-media.mjs`, then `build-migration.mjs` (mark its path built)
and `npm run check`.
