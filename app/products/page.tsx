import Link from "next/link";
import { FinishTray } from "@/components/home/FinishTray";
import { Catalogs, ClosingCta } from "@/components/home/Sections";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { SampleCard } from "@/components/ui/SampleCard";
import { finishesByLine, lineOrder, lines } from "@/content/collections";
import { ArrowRight } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Cabinet Collections & Product Catalog — Shaker, Nano & Euro",
  description: "Browse Highland Cabinetry's thirteen finishes across the Shaker, Nano and Euro lines, with specifications and downloadable catalogs.",
  path: "/products/",
  image: "/media/scene-shaker-luxe.jpg",
});

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Products", href: "/products/" }]} eyebrow="Collections" title={<>Three lines. <em>Thirteen finishes.</em></>}>
        <p className="lead">
          Framed Shaker and Nano cabinets on a plywood box, and frameless Euro cabinets with laminate and PET fronts. Pull a sample from the tray,
          or browse each line below.
        </p>
      </PageIntro>

      <section className="section on-linen" aria-labelledby="tray-title">
        <div className="container">
          <h2 id="tray-title" className="visually-hidden">
            Finish tray
          </h2>
          <FinishTray headingId="tray-title" />
        </div>
      </section>

      {lineOrder.map((id) => {
        const line = lines[id];
        const items = finishesByLine(id);
        return (
          <section key={id} id={`line-${id}`} className={`section ${styles.line}`} aria-labelledby={`line-${id}-title`}>
            <div className={`container ${styles.lineGrid}`}>
              <div className={styles.lineText}>
                <p className="label eyebrow">
                  {line.construction} · {items.length} finishes
                </p>
                <h2 id={`line-${id}-title`} className={styles.h2}>
                  {line.name}
                </h2>
                <p className="lead">{line.summary}</p>
                <Link href={items[0].path} className="link-arrow">
                  {line.name} specifications <ArrowRight />
                </Link>
              </div>
              <Media id={items[0].id === "shaker-white" ? "scene-shaker-white" : items[0].media.scene} sizes="(max-width: 900px) 100vw, 55vw" caption={`${items[0].name}`} />
            </div>
            <ul className={`container ${styles.cards}`}>
              {items.map((f) => (
                <SampleCard key={f.id} finish={f} href={f.path} as="li" headingLevel="h3" />
              ))}
            </ul>
          </section>
        );
      })}

      <Catalogs />
      <ClosingCta source="products-closing" />
    </>
  );
}
