/**
 * Paid-campaign landing pages kept at their original URLs so live ads keep working.
 *
 * Each previous "new-luxe-shaker-*" page (noindex, follow) showed its own local phone number — a
 * per-region call-tracking number — under "Save Now!". Those numbers are reproduced exactly so calls
 * from each campaign stay attributed. Source: live pages captured 2026-11-24.
 *
 * Not carried over from the old copy: "award-winning", "premium craftsmanship", "stain resists fading,
 * scratches, and everyday wear" (no supporting source in the June 2025 catalog).
 */
export interface Campaign {
  path: string;
  region: string;
  /** Call-tracking number shown on the previous landing page. */
  phone: string;
}

export const luxeCampaigns: Campaign[] = [
  { path: "/new-luxe-shaker-arizona/", region: "Arizona", phone: "602-529-3712" },
  { path: "/new-luxe-shaker-california/", region: "California", phone: "213-559-1679" },
  { path: "/new-luxe-shaker-national/", region: "National", phone: "623-292-4614" },
  { path: "/new-luxe-shaker-new-mexico/", region: "New Mexico", phone: "505-576-8058" },
  { path: "/new-luxe-shaker-texas/", region: "Texas", phone: "214-919-3467" },
  { path: "/new-luxe-shaker-utah/", region: "Utah", phone: "801-877-0291" },
];

export const campaignByPath = (path: string) => luxeCampaigns.find((c) => c.path === path)!;
