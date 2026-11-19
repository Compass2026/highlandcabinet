import Link from "next/link";
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import { kindLabel, media } from "@/lib/media";
import { introRules } from "./heroIntro";
import "./hero.css";

/**
 * “Open something extraordinary” — a showroom moment.
 *
 * The headline and calls to action sit above the photograph on warm white and are usable from
 * the first frame. Inside the photo frame, a pair of Shaker wall-cabinet doors hangs on a plaster
 * wall; they swing open onto the kitchen, and the opening widens into the full-bleed photograph.
 *
 * The doors and wall are decorative (aria-hidden, pointer-events: none, nothing focusable).
 * State on <html data-intro>: pending → play → done; skip (repeat visit / reduced motion);
 * absent after client-side navigation (settled). Without JavaScript a <noscript> stylesheet
 * plays the same CSS once.
 */

const decide = `(function(){var d=document.documentElement;try{var r=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;var k='hc-intro-seen';if(r||sessionStorage.getItem(k)){d.setAttribute('data-intro','skip');return}sessionStorage.setItem(k,'1');d.setAttribute('data-intro','pending')}catch(e){d.setAttribute('data-intro','skip')}})();`;

const control = `(function(){var d=document.documentElement;var fi=document.querySelector('[data-hero-img]');function fail(){d.setAttribute('data-hero-failed','')}if(fi){if(fi.complete&&!fi.naturalWidth)fail();fi.addEventListener('error',fail)}if(d.getAttribute('data-intro')!=='pending')return;var h=document.querySelector('[data-hero]');if(!h)return;var img=fi;var skip=h.querySelector('[data-intro-skip]');var t0=performance.now();var go=false;function end(){var s=d.getAttribute('data-intro');if(s==='pending'||s==='play')d.setAttribute('data-intro','done')}function play(){if(go)return;go=true;var wait=Math.max(0,220-(performance.now()-t0));setTimeout(function(){if(d.getAttribute('data-intro')!=='pending')return;d.setAttribute('data-intro','play');setTimeout(end,1550)},wait)}if(skip)skip.addEventListener('click',end);window.addEventListener('wheel',end,{passive:true,once:true});window.addEventListener('touchmove',end,{passive:true,once:true});if(!img||(img.complete&&img.naturalWidth))play();else{img.addEventListener('load',play);img.addEventListener('error',play);setTimeout(play,600)}})();`;

function Door({ side }: { side: "left" | "right" }) {
  return (
    <div data-door={side}>
      <div data-face>
        <i data-rail="top" />
        <i data-rail="bottom" />
        <i data-panel />
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
  const common = { alt: wide.alt, sizes: "100vw", quality: 80 };
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
    <section data-hero aria-labelledby="hero-title">
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <style dangerouslySetInnerHTML={{ __html: introRules('html[data-intro="play"]') }} />

      <div className="container" data-hero-text>
        <div data-hero-head>
          <p className="label eyebrow">Wholesale kitchen &amp; bath cabinetry</p>
          <h1 id="hero-title">
            <span>Extraordinary spaces</span> <span>begin with Highland.</span>
          </h1>
        </div>
        <div data-hero-aside>
          <p data-hero-lead>Shaker, Nano and Euro cabinetry for the builders, remodelers and dealers who create them.</p>
          <div data-hero-ctas>
            <Link href="#collections" className="btn">
              Explore collections <ArrowRight />
            </Link>
            <QuoteButton source="home-hero" className="btn btn--ghost" arrow={false}>
              Request a quote
            </QuoteButton>
          </div>
          <Link href="/become-a-dealer/" className="link-arrow" data-hero-dealer>
            Become a dealer <ArrowRight />
          </Link>
        </div>
      </div>

      <div data-hero-frame>
        <div data-wall aria-hidden="true" />
        <div data-hero-clip style={{ backgroundImage: `url("${wide.blurDataURL}")` }}>
          <picture>
            <source media={phone} srcSet={tallSet} sizes="100vw" />
            <img {...imgProps} srcSet={wideSet} data-hero-img alt={wide.alt} />
          </picture>
        </div>
        <div data-cab aria-hidden="true">
          <i data-cab-shadow />
          <i data-cab-frame />
          <i data-cab-depth />
          <Door side="left" />
          <Door side="right" />
          <i data-seam />
        </div>
        <button type="button" data-intro-skip>
          Skip intro
        </button>
      </div>
      <p className="container" data-hero-caption>
        <span className="label">{kindLabel[wide.kind]}</span> White Shaker
      </p>

      <script dangerouslySetInnerHTML={{ __html: control }} />
      <noscript dangerouslySetInnerHTML={{ __html: `<style>${introRules("html:not([data-intro])", 0.3)}</style>` }} />
    </section>
  );
}
