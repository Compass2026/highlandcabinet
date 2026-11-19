import Link from "next/link";
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import { kindLabel, media } from "@/lib/media";
import { introRules } from "./heroIntro";
import "./hero.css";

/**
 * “Open something extraordinary.”
 *
 * The settled hero (photograph, headline, calls to action) is ordinary, always-present HTML.
 * The cabinet doors are a decorative layer on top of it: aria-hidden, pointer-events: none,
 * no focusable content. They are shown only on the first home-page view of a browser session,
 * never with reduced motion, and they get out of the way on their own if anything fails.
 *
 * State lives on <html data-intro>:
 *   (absent)  settled — e.g. client-side navigation back to home
 *   pending   doors closed, waiting briefly for the photograph (max ~0.9 s)
 *   play      doors opening (≈1.8 s total choreography)
 *   done/skip settled
 * Without JavaScript a <noscript> stylesheet plays the same CSS animation once.
 */

// Runs during HTML parsing, before the hero paints — decides whether the intro plays.
const decide = `(function(){var d=document.documentElement;try{var r=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;var k='hc-intro-seen';if(r||sessionStorage.getItem(k)){d.setAttribute('data-intro','skip');return}sessionStorage.setItem(k,'1');d.setAttribute('data-intro','pending')}catch(e){d.setAttribute('data-intro','skip')}})();`;

// Runs right after the hero markup — starts the opening once the photograph is ready (or after a
// short cap), wires the skip control, and ends the intro if focus moves into the hero.
const control = `(function(){var d=document.documentElement;var fi=document.querySelector('[data-hero-img]');function fail(){d.setAttribute('data-hero-failed','')}if(fi){if(fi.complete&&!fi.naturalWidth)fail();fi.addEventListener('error',fail)}if(d.getAttribute('data-intro')!=='pending')return;var h=document.querySelector('[data-hero]');if(!h)return;var img=h.querySelector('[data-hero-img]');var skip=h.querySelector('[data-intro-skip]');var t0=performance.now();var go=false;function end(){var s=d.getAttribute('data-intro');if(s==='pending'||s==='play')d.setAttribute('data-intro','done')}function play(){if(go)return;go=true;var wait=Math.max(0,420-(performance.now()-t0));setTimeout(function(){if(d.getAttribute('data-intro')!=='pending')return;d.setAttribute('data-intro','play');setTimeout(end,2000)},wait)}if(skip)skip.addEventListener('click',function(){end();var t=h.querySelector('h1');if(t){t.setAttribute('tabindex','-1');t.focus({preventScroll:true})}});h.addEventListener('focusin',function(e){if(e.target!==skip)end()});if(!img||(img.complete&&img.naturalWidth))play();else{img.addEventListener('load',play);img.addEventListener('error',play);setTimeout(play,700)}})();`;

function Door({ side }: { side: "left" | "right" }) {
  return (
    <div data-door={side}>
      <div data-face>
        <i data-rail="top" />
        <i data-rail="mid" />
        <i data-rail="bottom" />
        <i data-panel="1" />
        <i data-panel="2" />
        <i data-pull />
        <i data-shade />
      </div>
      <i data-edge />
    </div>
  );
}

export function Hero() {
  const wide = media("hero-kitchen-wide");
  const tall = media("hero-kitchen-tall");
  const common = { alt: wide.alt, sizes: "100vw", quality: 78 };
  const {
    props: { srcSet: wideSet, ...imgProps },
  } = getImageProps({ ...common, src: wide.src, width: wide.width, height: wide.height, fetchPriority: "high", loading: "eager" });
  const {
    props: { srcSet: tallSet },
  } = getImageProps({ ...common, src: tall.src, width: tall.width, height: tall.height });

  const phone = "(max-width: 760px) and (orientation: portrait)";
  const notPhone = "not all and (max-width: 760px) and (orientation: portrait)";
  preload(tall.src, { as: "image", imageSrcSet: tallSet, imageSizes: "100vw", fetchPriority: "high", media: phone });
  preload(wide.src, { as: "image", imageSrcSet: wideSet, imageSizes: "100vw", fetchPriority: "high", media: notPhone });

  return (
    <section data-hero className="on-dark" aria-labelledby="hero-title">
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <style dangerouslySetInnerHTML={{ __html: introRules('html[data-intro="play"]') }} />

      <button type="button" data-intro-skip>
        Skip intro
      </button>

      <div data-hero-media style={{ backgroundImage: `url("${wide.blurDataURL}")` }}>
        <picture>
          <source media={phone} srcSet={tallSet} sizes="100vw" />
          <img {...imgProps} srcSet={wideSet} data-hero-img alt={wide.alt} />
        </picture>
        <span data-hero-dim aria-hidden="true" />
        <span data-hero-scrim aria-hidden="true" />
      </div>

      <div className="container" data-hero-content>
        <div data-hero-copy>
          <p className="label" data-hero-kicker>
            Wholesale kitchen &amp; bath cabinetry
          </p>
          <h1 id="hero-title">
            <span>Extraordinary spaces.</span> <span>Begin with Highland.</span>
          </h1>
          <p data-hero-lead>Wholesale cabinetry for the professionals who bring exceptional spaces to life.</p>
        </div>
        <div data-hero-ctas>
          <Link href="#collections" className="btn">
            Explore Collections <ArrowRight />
          </Link>
          <QuoteButton source="home-hero" className="btn btn--ghost" />
        </div>
        <p data-hero-caption>
          <span className="label">{kindLabel[wide.kind]}</span> White Shaker
        </p>
      </div>

      <div data-doors aria-hidden="true">
        <Door side="left" />
        <Door side="right" />
        <i data-seam />
      </div>

      <script dangerouslySetInnerHTML={{ __html: control }} />
      <noscript dangerouslySetInnerHTML={{ __html: `<style>${introRules("html:not([data-intro])", 0.4)}</style>` }} />
    </section>
  );
}
