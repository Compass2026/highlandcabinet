"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface Slide {
  src: string;
  alt: string;
  blurDataURL?: string;
  label: string;
  position?: string;
}

const INTERVAL = 7000;

/**
 * A slow crossfade through Highland's own kitchen renderings. Autoplay is skipped for reduced
 * motion, pauses while the tab is hidden, and can be paused by the visitor (WCAG 2.2.2).
 */
export function HeroSlides({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const running = playing && !reduced && slides.length > 1;

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % slides.length);
    };
    const t = window.setInterval(tick, INTERVAL);
    return () => window.clearInterval(t);
  }, [running, slides.length]);

  return (
    <>
      <div data-hero-photo>
        {slides.map((s, i) => (
          <div key={s.src} data-hero-slide data-active={i === index ? "" : undefined} aria-hidden={i === index ? undefined : true}>
            <Image
              src={s.src}
              alt={i === index ? s.alt : ""}
              fill
              preload={i === 0}
              loading={i === 0 ? undefined : "eager"}
              sizes="100vw"
              quality={86}
              placeholder={s.blurDataURL ? "blur" : "empty"}
              blurDataURL={s.blurDataURL}
              style={{ objectPosition: s.position ?? "50% 55%" }}
            />
          </div>
        ))}
      </div>
      <p data-hero-caption aria-live="off">{slides[index].label}</p>
      {slides.length > 1 && !reduced ? (
        <div data-hero-controls>
          <div data-hero-dots aria-hidden="true">
            {slides.map((s, i) => (
              <span key={s.src} data-on={i === index ? "" : undefined} />
            ))}
          </div>
          <button type="button" data-hero-pause onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
            {playing ? (
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <rect x="2" y="1.5" width="2.6" height="9" fill="currentColor" />
                <rect x="7.4" y="1.5" width="2.6" height="9" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
              </svg>
            )}
            <span className="visually-hidden">{playing ? "Pause slideshow" : "Play slideshow"}</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
