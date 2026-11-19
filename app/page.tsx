import { Hero } from "@/components/home/Hero";
import { FinishTray } from "@/components/home/FinishTray";
import { Craft, FullBleed, Lines, Paths, Trade } from "@/components/home/Editorial";
import { Catalogs, ClosingCta, Location } from "@/components/home/Sections";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/content/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Highland Cabinetry — Wholesale Kitchen & Bath Cabinets for the Trade",
  description:
    "Wholesale Shaker, Nano and Euro kitchen and bath cabinets for contractors, builders, remodelers and dealers. Thirteen finishes, plywood-box Shaker construction, and a dedicated account manager.",
  path: "/",
  image: "/media/hero-kitchen-wide.jpg",
});

export default function HomePage() {
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: "Highland Cabinetry", url: siteUrl };
  return (
    <>
      <Hero />
      <Lines />
      <FullBleed id="project-white-shaker-01" caption="White Shaker perimeter around a dark island" position="50% 62%" />

      <section className="section" aria-labelledby="finish-title">
        <div className="container">
          <header className={styles.head}>
            <p className="label eyebrow">Finishes</p>
            <h2 id="finish-title">See each finish on the cabinet.</h2>
          </header>
          <FinishTray headingId="finish-title" sceneOverride={{ "shaker-white": "scene-shaker-white" }} />
        </div>
      </section>

      <Craft />
      <FullBleed id="scene-shaker-onyx-black" caption="Shaker Onyx Black with brass hardware" position="50% 55%" />
      <Trade />
      <Paths />
      <Catalogs />
      <Location />
      <ClosingCta source="home-closing" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
