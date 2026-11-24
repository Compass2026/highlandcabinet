# Domain cutover runbook — highlandcabinetry.com → Vercel

Status (24 Nov 2026): **ready except for the items marked ⛔.** Nothing about the live domain has been changed.

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
| `LEAD_TEST_TOKEN` | ⛔ set it yourself in the Vercel dashboard (any long random string, type *Sensitive*) and pass the same value to `verify-production.mjs`. A value set through the API connector did not arrive intact (verified by hash), so the current one must be overwritten |
| `SENDGRID_API_KEY` | ⛔ Highland's SendGrid account (domain already authenticated) — a key with *Mail Send* permission only |
| `LEAD_EMAIL_TO` | ⛔ who receives leads (e.g. `sales@highlandcabinetryinc.com`, comma-separate several) |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_SECRET` | optional — CRM hook, in addition to email |

## Decisions needed before cutover

1. ⛔ **Lead recipients and SendGrid key** (above). Until both are set, every form tells the visitor plainly that nothing was sent and gives the phone number.
2. ⛔ **CallRail number swapping.** CallRail swaps **480-755-2280** for tracking numbers on ad traffic. The new site shows
   **866-545-6280**, so calls from ad visitors would no longer be attributed. Either add 866-545-6280 as a swap target in
   CallRail (Numbers → swap target), or show 480-755-2280 on the site. `docs/launch/TRACKING.md`.
3. Which Luxe campaigns and the Q4 blowout offer are still running (`docs/LAUNCH-CHECKLIST.md` R12).
4. Remaining content blockers in `docs/LAUNCH-CHECKLIST.md` (privacy review, warehouse photo, KCMA).

## Cutover steps

**T-2 days**
1. Export the full GoDaddy zone file and keep it with this runbook (DNS-over-HTTPS cannot list every record).
2. Lower the TTL on `@ A` and `www CNAME` to 600 seconds.
3. Deploy the final commit to `highland-cabinetry` production; re-run locally against a production build:
   `test-launch-seo`, `test-migration`, `test-lead-delivery`, `verify-tracking` (all 0 failures).
4. `node scripts/verify-production.mjs --baseline` to refresh `dns-baseline.json`.

**T-0**
5. In Vercel → `highland-cabinetry` → Domains: add `highlandcabinetry.com` (primary) and `www.highlandcabinetry.com`
   (redirect 308 → apex). Vercel shows the exact records to set.
6. In GoDaddy change only:
   - `A  @    45.32.74.243  →  76.76.21.21` (or the value Vercel shows)
   - `CNAME www  highlandcabinetry.com.  →  cname.vercel-dns.com.`
   Do not touch MX, TXT (SPF, Google verification), `_dmarc`, `*._domainkey`, `autodiscover` or any other record.
   If GoDaddy has a CAA record, it must allow `letsencrypt.org`.
7. Wait for Vercel to show the domain as valid and issue the certificate (minutes, up to the old TTL).
8. Run the verification on the real domain:
   `LEAD_TEST_TOKEN=… node scripts/verify-production.mjs` — DNS (mail records unchanged), HTTPS, www/http redirects,
   SEO gate, every old URL, tracking, and one test lead (`[TEST — please ignore]`). Confirm the test lead reached the
   inbox by its reference number. Report: `docs/launch/production-verification.json`.
9. Submit a real quote from a phone; place a test call from a Google ad click (gclid) to confirm CallRail swapping.

**T+0 to T+14 days**
10. Search Console: submit `sitemap.xml`; watch Coverage / 404s daily for the first week.
11. Google Ads: confirm both conversion actions (lead, phone click) keep recording; CallRail: calls attributed.
12. Keep the WordPress server running read-only for at least 30 days (rollback, and as an archive).

## Rollback

Set `A @` back to `45.32.74.243` and `www` back to `CNAME highlandcabinetry.com.` (TTL 600 makes this take effect within
minutes). Nothing else was changed, so email and verification are unaffected either way.
