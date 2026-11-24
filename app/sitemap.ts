export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { finishes } from "@/content/collections";
import { siteUrl } from "@/content/site";
import { posts } from "@/lib/blog";
import { liveServiceAreas } from "@/lib/serviceAreas";

const pages = [
  "/",
  "/products/",
  "/wholesale-cabinets-for-contractors/",
  "/wholesalers-large-scale-projects/",
  "/become-a-dealer/",
  "/find-a-dealer/",
  "/request-a-quote/",
  "/contact-us/",
  "/about-us/",
  "/gallery-of-highland-cabinets/",
  "/most-searched-questions-for-kitchen-renovation/",
  "/hci-partners/",
  "/hci-partners/interior-logic-group-ilg/",
  "/privacy-policy/",
  "/blog/",
  "/wholesale-cabinets/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}` })),
    ...finishes.map((f) => ({ url: `${siteUrl}${f.path}` })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}/`, lastModified: p.modified })),
    ...liveServiceAreas.map((a) => ({ url: `${siteUrl}${a.path}` })),
  ];
}
