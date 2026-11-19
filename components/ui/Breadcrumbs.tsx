import Link from "next/link";
import { siteUrl } from "@/content/site";
import { jsonLd } from "@/lib/seo";
import styles from "./Breadcrumbs.module.css";

export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: `${siteUrl}${it.href}` })),
  };
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol>
        {items.map((it, i) => (
          <li key={it.href}>
            {i === items.length - 1 ? (
              <span aria-current="page">{it.label}</span>
            ) : (
              <Link href={it.href}>{it.label}</Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
    </nav>
  );
}
