import Link from "next/link";
import Image from "next/image";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import { kindLabel, media } from "@/lib/media";
import { finishes, lineOrder } from "@/content/collections";
import "./hero.css";

/**
 * Full-bleed, naturally bright kitchen with the headline set into the photograph.
 * No introduction sequence — only a slow settle of the photograph and a short text rise
 * (both disabled with reduced motion). A ribbon of verified facts sits beneath.
 */
export function Hero() {
  const photo = media("project-white-shaker-01");
  const facts = [
    { big: String(lineOrder.length), label: "Cabinet lines", sub: "Shaker, Nano and Euro" },
    { big: String(finishes.length), label: "Finishes", sub: "Painted, stained and textured" },
    { big: "3 PM", label: "Same-day cut-off", sub: "Arizona time, Monday–Friday" },
    { big: "PHX", label: "Showroom & warehouse", sub: "Phoenix, Arizona" },
  ];
  return (
    <section data-hero aria-labelledby="hero-title">
      <figure data-hero-figure>
        <div data-hero-photo>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            preload
            sizes="100vw"
            quality={84}
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL}
          />
        </div>
        <div data-hero-scrim aria-hidden="true" />
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
        <figcaption data-hero-caption>
          {kindLabel[photo.kind]} · White Shaker
        </figcaption>
      </figure>

      <div className="container">
        <dl data-hero-facts>
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>
                <span data-big>{f.big}</span>
                <span data-sub>{f.sub}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
