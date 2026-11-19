import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FactStrip } from "@/components/home/FactStrip";
import { FinishTray } from "@/components/home/FinishTray";
import { Construction } from "@/components/home/Construction";
import { Audiences, Catalogs, ClosingCta, Featured, Location, TradeProcess } from "@/components/home/Sections";
import { ArrowRight } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/content/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Highland Cabinetry — Wholesale Kitchen & Bath Cabinets for the Trade",
  description:
    "Wholesale Shaker, Nano and Euro kitchen and bath cabinets for contractors, builders, remodelers and dealers. Thirteen finishes, plywood-box Shaker construction, and a dedicated account manager.",
  path: "/",
  image: "/media/project-white-shaker-01.jpg",
});

export default function HomePage() {
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: "Highland Cabinetry", url: siteUrl };
  return (
    <>
      <Hero />
      <FactStrip />

      <section id="collections" className={`section on-linen ${styles.collections}`} aria-labelledby="collections-title">
        <div className="container">
          <div className={styles.collectionsHead}>
            <div>
              <p className="label eyebrow">Collections</p>
              <h2 id="collections-title" className={styles.h2}>
                Pull a sample from the tray.
              </h2>
            </div>
            <div className={styles.collectionsIntro}>
              <p className="lead">
                Three cabinet lines, thirteen finishes. Choose a sample to see it on the cabinet and in the room, then open the collection for
                specifications and catalogs.
              </p>
              <Link href="/products/" className="link-arrow">
                All collections <ArrowRight />
              </Link>
            </div>
          </div>
          <FinishTray headingId="collections-title" sceneOverride={{ "shaker-white": "project-white-shaker-02" }} />
        </div>
      </section>

      <Audiences />

      <section className="section on-linen" aria-labelledby="construction">
        <div className="container">
          <Construction />
        </div>
      </section>

      <Featured />
      <TradeProcess />
      <Catalogs />
      <Location />
      <ClosingCta source="home-closing" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
