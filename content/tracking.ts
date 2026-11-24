/**
 * Marketing tags carried over from the previous site so active campaigns keep measuring.
 *
 * Sourced on 2026-11-24 from every page of the live highlandcabinetry.com and from the public
 * container files at googletagmanager.com / cdn.callrail.com (docs/launch/TRACKING.md has the detail):
 *
 * - GTM-NM4FXR2B: Google Ads conversions for AW-341905256 — phone (click on any tel: link) and lead
 *   (dataLayer event "generate_lead"); GA4 G-C6W9KJ2WD5; Meta pixel 3327097927378760; conversion linker.
 * - GTM-P6MLRTDB: GA4 G-39WL49D4VK and Hotjar 5268522.
 * - GT-T5JX78GN: Google tag from WordPress Site Kit (GA4 G-39WL49D4VK), also configuring AW-341905256.
 * - CallRail company 843918300: swap.js replaces the swap-target number 480-755-2280 with a tracking
 *   number for visitors arriving from tracked sources.
 *
 * Tags load only in production (SITE_INDEXING=on) and only when the page is served from the
 * canonical host, so staging and *.vercel.app URLs never send hits. Set NEXT_PUBLIC_TRACKING=off to
 * disable them everywhere.
 */
export const tracking = {
  gtmContainers: ["GTM-NM4FXR2B", "GTM-P6MLRTDB"],
  googleTag: { id: "GT-T5JX78GN", alsoConfigure: ["AW-341905256"] },
  callRailSwapScript: "https://cdn.callrail.com/companies/843918300/wp-0-5-3/swap.js",
  /** The number CallRail is configured to swap. It must appear on the page for swapping to work. */
  callRailSwapTarget: "480-755-2280",
} as const;

/** The dataLayer event GTM-NM4FXR2B turns into a Google Ads lead conversion, GA4 generate_lead and Meta Lead. */
export const leadEvent = "generate_lead";

/** URL parameters kept with a lead so it can be matched back to the campaign that produced it. */
export const attributionParams = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;
