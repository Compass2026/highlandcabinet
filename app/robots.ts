import type { MetadataRoute } from "next";
import { indexingEnabled, siteUrl } from "@/content/site";

/** Staging blocks all crawling. Production (SITE_INDEXING=on) allows it and lists the sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
