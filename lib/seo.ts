import type { Metadata } from "next";
import { indexingEnabled, siteUrl } from "@/content/site";

interface PageMeta {
  title: string;
  /** Use the title as-is, without the " | Highland Cabinetry" template. */
  absoluteTitle?: boolean;
  description: string;
  path: string;
  image?: string;
  /** Keep the page out of search results even in production (campaign landing pages). */
  noindex?: boolean;
}

/** Builds per-page metadata with a canonical URL on the production origin. */
export function pageMetadata({ title, description, path, image, absoluteTitle, noindex }: PageMeta): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Highland Cabinetry",
      type: "website",
      locale: "en_US",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
    robots: !indexingEnabled ? { index: false, follow: false, nocache: true } : noindex ? { index: false, follow: true } : undefined,
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
