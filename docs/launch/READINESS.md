# Readiness record — 24 Nov 2026 (evening, Central)

**Tested commit:** `0b9d659f3796f5ce9d216eb73fe4ed3a9480e6f8` on `claude/tender-bardeen-aar7ky`.
Commits after it are test reports and this record only (no code).

| Target | ID / URL |
|---|---|
| Production project `highland-cabinetry` (not attached to any domain) | `dpl_Fn7db1AJcRCr8rvF2CAbhNEcGHL8` · highland-cabinetry-pt57rzm9h-compassmarketin.vercel.app — **known-good rollback target** |
| Review project `highland-cabinetry-preview` (staging, noindex, review notes) | `dpl_CsVAsc5eoggthbPVzNd4VHQUQbGE` |
| Static fallback | `fallback/highland-static-0b9d659.tar.gz` (37.2 MB, sha256 `a87dfdcd05b492ba…`), rebuilt with `node scripts/build-static-fallback.mjs` at this commit — not committed; must be uploaded to a Highland-controlled host (B5) |

## Results on that commit

| Check | Where run | Result |
|---|---|---|
| Migration: 338 requestable old URLs (291×200, 45×308, 2×410), 82 slash/campaign-parameter variants, 296 internal links | Vercel production deployment | 0 failures (`migration-test-vercel-production.json`) |
| Tracking: 4 tags load on the canonical host only; 1 Google Ads lead conversion + 1 GA4 generate_lead per confirmed lead; phone conversion on tel: click; nothing for an undelivered lead; gclid/utm carried | Vercel production deployment, served as highlandcabinetry.com inside the test browser; all measurement requests blocked | 14/14 (`tracking-check.json`) |
| Host gating: `*.vercel.app` answers `X-Robots-Tag: noindex`; HSTS present | Vercel production deployment | as intended |
| Test-token mechanism (hash only on server): valid token accepted, wrong token refused | Vercel production deployment | works; destinations `[]` (B1 open) |
| SEO gate: 283 indexable pages, 6 noindex campaign pages, sitemap, canonicals, no review text, tags on | Local production build of the same commit (the gate needs the canonical host) | 0 failures |
| Lead pipeline (email + signed webhook, failure paths, test marking) | Local production build, mock endpoints | 46/46 — **not proof of inbox delivery** |
| Static fallback: migration incl. variants; SEO gate | Local static host emulation (`serve-static-fallback.mjs`) | 0 failures each |

## Not yet verified (needs Highland)

Real inbox receipt per form type (B1–B2) · CallRail swap and call routing (B3) · account control (B4) · rollback hosting
under Highland (B5) · DNS access and zone export (B6) · operator's own test token (B7; the hash now set is a rehearsal
value whose token exists only in the builder's temporary workspace) · Meta pixel events (not observable from the test
environment) · anything on the real domain (DNS unchanged by instruction).
