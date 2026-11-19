"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { kindLabel, media } from "@/lib/media";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import styles from "./Gallery.module.css";

interface Props {
  ids: string[];
  label: string;
}

export function Gallery({ ids, label }: Props) {
  const items = ids.map(media);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const start = useRef<number | null>(null);
  const uid = useId();
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = useCallback(
    (to: number, focusThumb = false) => {
      const next = (to + items.length) % items.length;
      if (next === index) return;
      setPrev(index);
      setIndex(next);
      const t = thumbs.current[next];
      t?.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (focusThumb) t?.focus();
    },
    [index, items.length],
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, (e.target as HTMLElement).dataset.thumb !== undefined);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, (e.target as HTMLElement).dataset.thumb !== undefined);
    }
  };

  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") start.current = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
  };

  const cur = items[index];
  const wide = (m: (typeof items)[number]) => m.width / m.height >= 1.3;
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;

  return (
    <section className={styles.gallery} aria-roledescription="gallery" aria-label={label} onKeyDown={onKey}>
      <div className={styles.stage} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (start.current = null)}>
        {prev !== null ? (
          <Image
            key={`p${prev}`}
            src={items[prev].src}
            alt=""
            fill
            sizes="(max-width: 1040px) 100vw, 62vw"
            className={`${styles.out} ${wide(items[prev]) ? styles.cover : styles.contain}`}
            onAnimationEnd={() => setPrev(null)}
          />
        ) : null}
        <Image
          key={`c${index}`}
          src={cur.src}
          alt={cur.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 1040px) 100vw, 62vw"
          placeholder={cur.blurDataURL ? "blur" : "empty"}
          blurDataURL={cur.blurDataURL}
          className={`${styles.in} ${wide(cur) ? styles.cover : styles.contain}`}
        />
        <div className={styles.controls}>
          <button type="button" className={styles.arrow} onClick={() => go(index - 1)} aria-controls={`${uid}-stage`}>
            <ArrowLeft />
            <span className="visually-hidden">Previous image</span>
          </button>
          <span className={`label ${styles.counter}`} aria-hidden="true">
            {counter}
          </span>
          <button type="button" className={styles.arrow} onClick={() => go(index + 1)} aria-controls={`${uid}-stage`}>
            <ArrowRight />
            <span className="visually-hidden">Next image</span>
          </button>
        </div>
      </div>

      <p id={`${uid}-stage`} className={styles.caption} aria-live="polite">
        <span className="visually-hidden">
          Image {index + 1} of {items.length}.{" "}
        </span>
        <span className="label">{kindLabel[cur.kind]}</span> <span>{cur.alt}</span>
      </p>

      <div className={styles.thumbs} role="group" aria-label="Choose an image">
        {items.map((m, i) => (
          <button
            key={m.id}
            ref={(el) => {
              thumbs.current[i] = el;
            }}
            type="button"
            data-thumb=""
            className={styles.thumb}
            aria-current={i === index ? "true" : undefined}
            aria-label={`Image ${i + 1}: ${kindLabel[m.kind]} — ${m.alt}`}
            onClick={() => go(i)}
          >
            <Image src={m.src} alt="" width={m.width} height={m.height} sizes="120px" />
          </button>
        ))}
      </div>
    </section>
  );
}
