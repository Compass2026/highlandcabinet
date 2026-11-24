# Domain cutover runbook — highlandcabinetry.com → Vercel

Status (24 Nov 2026): **ready except for the items marked ⛔** (open blockers: `docs/LAUNCH-CHECKLIST.md` §A). Nothing about
the live domain has been changed, and DNS is not to be changed without explicit go-ahead.

**Old-host cutoff: Thursday 26 Nov 2026, 5:00 pm Central.** The WordPress server (45.32.74.243) may disappear then; it
is **not** a rollback target.

## Current state (recorded in `dns-baseline.json`)

| What | Where |
|---|---|
| DNS host | GoDaddy (`ns53/ns54.domaincontrol.com`) |
| Website | `A @ 45.32.74.243` (nginx, WordPress); `www` is a CNAME to the apex; www → apex and http → https are 301s |
| Email | Microsoft 365: `MX 0 highlandcabinetry-com.mail.protection.outlook.com`, DKIM `selector1/selector2._domainkey`, `autodiscover` |
| Sending services | SPF `include:spf.protection.outlook.com include:_spf.google.com include:sendgrid.net -all`; SendGrid DKIM `s1/s2._domainkey` |
| Policy / verification | DMARC `p=none` (reports to highlandcabinetryinc.com); `google-site-verification=CWQq…` (Search Console) |

**Only two records change. Every other record stays exactly as it is.**

## Vercel

- Production project: **`highland-cabinetry`** (team Compass Marketing), separate from the review project
  `highland-cabinetry-preview` (which stays noindex with review notes).
- Its `*.vercel.app` URLs require Vercel login; the custom domain will be public.
- Production environment variables:

| Variable | Status |
|---|---|
| `SITE_INDEXING=on`, `NEXT_PUBLIC_SITE_URL=https://highlandcabinetry.com` | set |
| `LEAD_EMAIL_FROM=Highland Cabinetry Website <website@highlandcabinetry.com>` | set |
| `LEAD_TEST_TOKEN_SHA256` | ⛔ operator runs `node scripts/make-lead-test-token.mjs` locally, sets the printed hash here, keeps the token in a password manager. Only the hash is stored on the server. Delete the obsolete `LEAD_TEST_TOKEN` variable (a value sent through the API connector did not arrive intact) |
| `SENDGRID_API_KEY` | ⛔ Highland's SendGrid account (domain already authenticated) — a key with *Mail Send* permission only |
| `LEAD_EMAIL_TO` | ⛔ who receives leads (e.g. `sales@highlandcabinetryinc.com`, comma-separate several) |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_SECRET` | optional — CRM hook, in addition to email |

## Decisions needed before cutover

See `docs/LAUNCH-CHECKLIST.md` §B (each has a default if Highland has not answered by Wednesday noon Central).

## Schedule (Central time)

| When | Step |
|---|---|
| **Tue 24 (done)** | 15 baseline paths added and tested; priority content checks; fallback built and verified; token mechanism; this plan |
| **Wed 25 by noon** | Highland: SendGrid key + recipients (B1), CallRail decision/change (B3, D1), account-control confirmations (B4), GoDaddy access + zone export (B6), hosting account for rollback (B5) |
| **Wed 25 afternoon** | Set test-token hash (B7); lower TTLs to 600 s; deploy final commit; inbox receipt for all four form types (B2) on the production deployment URL; build the fallback from the same commit and upload it to Highland's host; rehearse rollback; record IDs in READINESS.md |
| **Thu 26, 9:00 am** | Go/no-go: all of §A closed. Add domains in Vercel, change the two GoDaddy records |
| **Thu 26, 9:30–12:00** | `verify-production.mjs` on the real domain, inbox receipt again, test call; fix or roll back |
| **Thu 26, 12:00–5:00 pm** | Buffer. The old host must not be needed after this point |

## Cutover steps

**Wednesday**
1. Export the full GoDaddy zone file and keep it with this runbook (DNS-over-HTTPS cannot list every record).
2. Lower the TTL on `@ A` and `www CNAME` to 600 seconds.
3. Deploy the final commit to `highland-cabinetry` production; re-run against it: `test-launch-seo`, `test-migration`
   (incl. slash/campaign variants), `test-lead-delivery`, `verify-tracking` (all 0 failures). Record commit and
   deployment ID in `READINESS.md`; mark that deployment as the known-good rollback target.
4. Build the static fallback from the same commit (`node scripts/build-static-fallback.mjs`), verify it
   (`serve-static-fallback.mjs` + the same suites), upload it to Highland's static host and check it there.
5. `node scripts/verify-production.mjs --baseline` to refresh `dns-baseline.json`.

**Thursday (go/no-go 9:00 am Central)**
6. In Vercel → `highland-cabinetry` → Domains: add `highlandcabinetry.com` (primary) and `www.highlandcabinetry.com`
   (redirect 308 → apex). Vercel shows the exact records to set.
7. In GoDaddy change only the two records, using **exactly the values Vercel shows for this project** (do not use
   remembered or illustrative values):
   - `A @` (apex) → value shown by Vercel
   - `CNAME www` → value shown by Vercel
   Do not touch MX, TXT (SPF, Google verification), `_dmarc`, `*._domainkey`, `autodiscover` or any other record.
   If GoDaddy has a CAA record, it must allow `letsencrypt.org`.
8. Wait for Vercel to show the domain as valid and issue the certificate (minutes, up to the old TTL).
9. Run the verification on the real domain:
   `LEAD_TEST_TOKEN=… node scripts/verify-production.mjs` — DNS (mail records unchanged), HTTPS, www/http redirects,
   SEO gate, every old URL, tracking, and one marked test lead per form type. Confirm each reference arrived in the
   inbox (`docs/launch/lead-receipt.json`). Report: `docs/launch/production-verification.json`.
10. Submit a real quote from a phone; place a test call from a Google ad click (gclid) to confirm CallRail swapping.

**Thursday to +14 days**
11. Search Console: submit `sitemap.xml`; watch Coverage / 404s daily for the first week.
12. Google Ads: confirm both conversion actions (lead, phone click) keep recording; CallRail: calls attributed.
13. The WordPress server goes away at the cutoff; the preservation archive and `docs/migration/` are the record of the old site.

## Rollback (without the old host)

The old WordPress server is not a rollback target after Thursday 5 pm. Two independent lines, both prepared before the
switch:

1. **Instant rollback in Vercel** (minutes, no DNS change). The verified deployment recorded in `READINESS.md` is the
   known-good target: Vercel → `highland-cabinetry` → Deployments → that deployment → *Instant Rollback* (or *Promote*).
   Covers a bad release. Requires access to the Vercel team that owns the project — which must be Highland's (B5).
2. **Static fallback on a Highland-controlled host** (if the project or account itself is unavailable). The tarball from
   `scripts/build-static-fallback.mjs` for the same commit, uploaded to e.g. Netlify or Cloudflare Pages under
   Highland's account (`_redirects`/`_headers` included; `vercel.json` for a Vercel account). Point `A @`/`www` at
   that host. Same pages, URLs, redirects, canonicals and tracking; lead forms cannot deliver there and show the phone
   number and sales email instead (“Not sent”, never a false confirmation).

Email and Search Console verification are unaffected by either, because only the two web records ever change.
