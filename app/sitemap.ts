import type { MetadataRoute } from "next";
import { finishes } from "@/content/collections";
import { siteUrl } from "@/content/site";

const pages = [
  "/",
  "/products/",
  "/wholesale-cabinets-for-contractors/",
  "/become-a-dealer/",
  "/find-a-dealer/",
  "/request-a-quote/",
  "/contact-us/",
  "/wholesale-cabinets/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...pages, ...finishes.map((f) => f.path)].map((p) => ({ url: `${siteUrl}${p}` }));
}
