import Link from "next/link";
import Image from "next/image";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import { kindLabel, media } from "@/lib/media";
import "./hero.css";

/**
 * A naturally bright kitchen, cabinetry as the subject, minimal copy. No introduction sequence —
 * only a gentle settle of the photograph and a short fade-up of the text (disabled for reduced motion).
 */
export function Hero() {
  const photo = media("project-white-shaker-01");
  return (
    <section data-hero aria-labelledby="hero-title">
      <div className="container" data-hero-text>
        <h1 id="hero-title">Extraordinary spaces begin with Highland.</h1>
        <div data-hero-aside>
          <p data-hero-lead>Wholesale Shaker, Nano and Euro cabinetry for builders, remodelers and dealers.</p>
          <div data-hero-ctas>
            <Link href="#collections" className="btn">
              Explore finishes <ArrowRight />
            </Link>
            <QuoteButton source="home-hero" className="btn btn--ghost" arrow={false}>
              Request a quote
            </QuoteButton>
          </div>
        </div>
      </div>

      <figure data-hero-figure>
        <div data-hero-photo>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            preload
            sizes="100vw"
            quality={82}
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL}
          />
        </div>
        <figcaption className="container" data-hero-caption>
          <span className="label">{kindLabel[photo.kind]}</span> White Shaker
        </figcaption>
      </figure>
    </section>
  );
}
