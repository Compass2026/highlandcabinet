import type { ReactNode } from "react";
import { siteUrl } from "@/content/site";
import { jsonLd } from "@/lib/seo";
import styles from "./PageIntro.module.css";

/**
 * `crumbs` emits BreadcrumbList structured data (Home › … › this page), which the previous site's SEO plugin
 * provided on every page.
 */
export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
  crumbs,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  crumbs?: { label: string; href: string }[];
}) {
  const trail = crumbs ? [{ label: "Home", href: "/" }, ...crumbs] : null;
  return (
    <header className={styles.intro}>
      {trail ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${siteUrl}${c.href}` })),
          })}
        />
      ) : null}
      <div className={`container ${styles.grid}`}>
        <div className={styles.main}>
          <p className="label eyebrow">{eyebrow}</p>
          <h1 className={styles.h1}>{title}</h1>
          {children ? <div className={styles.body}>{children}</div> : null}
        </div>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
      <hr className="reveal" />
    </header>
  );
}
