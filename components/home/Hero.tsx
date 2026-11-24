import Link from "next/link";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import { kindLabel, media } from "@/lib/media";
import { finishes, lineOrder } from "@/content/collections";
import { HeroSlides } from "./HeroSlides";
import "./hero.css";

/**
 * Full-bleed kitchen renderings with the headline set into the lower third. A slow crossfade
 * (pausable, off for reduced motion) and a short text rise. A ribbon of verified facts sits beneath.
 */
export function Hero() {
  // Highland's own kitchen renderings (labelled as such), the strongest imagery the brand has.
  const slides = [
    { id: "scene-shaker-white", label: "White Shaker", position: "50% 60%" },
    { id: "scene-euro-white-oak", label: "Euro White Oak", position: "50% 62%" },
    { id: "scene-shaker-signature-blue", label: "Signature Blue Shaker", position: "50% 58%" },
  ].map((s) => {
    const m = media(s.id);
    return { src: m.src, alt: m.alt, blurDataURL: m.blurDataURL, label: `${kindLabel[m.kind]} · ${s.label}`, position: s.position };
  });
  const facts = [
    { big: String(lineOrder.length), label: "Cabinet lines", sub: "Shaker, Nano and Euro" },
    { big: String(finishes.length), label: "Finishes", sub: "Painted, stained and textured" },
    { big: "3 PM", label: "Same-day cut-off", sub: "Arizona time, Monday–Friday" },
    { big: "PHX", label: "Showroom & warehouse", sub: "Phoenix, Arizona" },
  ];
  return (
    <section data-hero aria-labelledby="hero-title">
      <figure data-hero-figure>
        <HeroSlides slides={slides} />
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
