import type { Metadata } from "next";
import { indexingEnabled, siteUrl } from "@/content/site";

interface PageMeta {
  title: string;
  /** Use the title as-is, without the " | Highland Cabinetry" template. */
  absoluteTitle?: boolean;
  description: string;
  path: string;
  image?: string;
}

/** Builds per-page metadata with a canonical URL on the production origin. */
export function pageMetadata({ title, description, path, image, absoluteTitle }: PageMeta): Metadata {
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
    robots: indexingEnabled ? undefined : { index: false, follow: false, nocache: true },
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
