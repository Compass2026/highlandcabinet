import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { SampleCard } from "@/components/ui/SampleCard";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import { finishById } from "@/content/collections";
import styles from "./Hero.module.css";

export function Hero() {
  const white = finishById("shaker-white")!;
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.image}>
        <Media id="project-white-shaker-01" fill priority sizes="(max-width: 1040px) 100vw, 60vw" caption={false} objectPosition="50% 60%" />
        <div className={styles.detail}>
          <p className={styles.detailCap}>
            <span className="label">Shown</span> White Shaker perimeter · installed project
          </p>
          <SampleCard finish={white} href={white.path} />
        </div>
      </div>

      <div className={styles.copy}>
        <p className="label eyebrow">Wholesale cabinetry · Phoenix, Arizona</p>
        <h1 id="hero-title" className={styles.title}>
          Cabinetry built for the trade. <em>Finished for the home.</em>
        </h1>
        <p className={styles.lead}>
          Shaker, Nano and Euro kitchen and bath cabinets for contractors, builders, remodelers and dealers — thirteen finishes, backed by a
          dedicated account manager.
        </p>
        <div className={styles.ctas}>
          <Link href="#collections" className="btn">
            Explore Collections <ArrowRight />
          </Link>
          <QuoteButton source="home-hero" className="btn btn--ghost" />
        </div>
        <p className={styles.homeowner}>
          Planning your own kitchen?{" "}
          <Link href="/find-a-dealer/" className={styles.inlineLink}>
            We&rsquo;ll help you find a dealer
          </Link>
          .
        </p>

      </div>
    </section>
  );
}
