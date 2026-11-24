import { Hero } from "@/components/home/Hero";
import { FinishTray } from "@/components/home/FinishTray";
import { Collections, RealKitchens } from "@/components/home/Editorial";
import { Construction } from "@/components/home/Construction";
import { Quality } from "@/components/home/Quality";
import { Affiliations, DealerSection, LocationSection } from "@/components/home/Showroom";
import { ClosingCta } from "@/components/home/Sections";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/content/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Highland Cabinetry — Wholesale Kitchen & Bath Cabinets for the Trade",
  description:
    "Wholesale Shaker, Nano and Euro kitchen and bath cabinets for contractors, builders, remodelers and dealers. Thirteen finishes, plywood-box Shaker construction, and a dedicated account manager.",
  path: "/",
  image: "/media/scene-shaker-white.jpg",
});

export default function HomePage() {
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: "Highland Cabinetry", url: siteUrl };
  return (
    <>
      <Hero />
      <Affiliations />

      <section id="collections" className={`section ${styles.sampler}`} aria-labelledby="collections-title">
        <div className="container">
          <header className={styles.head}>
            <h2 id="collections-title">Pull a sample from the tray.</h2>
            <p>Three cabinet lines, thirteen finishes. Choose a sample to see it on the cabinet and in the room.</p>
          </header>
          <FinishTray headingId="collections-title" sceneOverride={{ "shaker-white": "project-white-shaker-04" }} />
        </div>
      </section>

      <Collections />
      <RealKitchens />
      <Quality />
      <section className="section on-linen" aria-labelledby="construction">
        <div className="container">
          <Construction
            title="Every part, on Highland’s own drawing."
            intro="The Shaker and Nano box as drawn in Highland’s catalog. Select a feature to find it on the cabinet."
          />
        </div>
      </section>
      <DealerSection />
      <LocationSection />
      <ClosingCta source="home-closing" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
