"use client";

import Image from "next/image";
import { useState } from "react";
import { lines } from "@/content/collections";
import styles from "./Construction.module.css";

/**
 * Positions (percent of the illustration box) of the numbered callouts printed in Highland's own
 * catalog illustration, measured from the vector drawing. Several numbers appear twice (wall and
 * base cabinet).
 */
const marks: Record<number, [number, number][]> = {
  1: [[30, 4.5], [30, 50.2]],
  2: [[57, 49.3]],
  3: [[8.3, 25.1], [13.9, 75.6]],
  4: [[46.3, 18.9], [57.2, 74.6]],
  5: [[66.3, 32.4], [77.2, 82.7]],
  6: [[73, 19.5], [84.3, 73.9]],
  7: [[58.9, 63.9]],
  8: [[31.3, 66.2]],
  9: [[48.3, 35.7], [57.4, 85.4]],
  10: [[22.2, 94.3]],
};

interface Props {
  headingLevel?: "h2" | "h3";
  title?: string;
  intro?: string;
  id?: string;
  /** Printed under the list when the section serves as a product's specification. */
  source?: string;
}

export function Construction({ headingLevel = "h2", title = "Built square, inside and out.", intro, id = "construction", source }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const shown = active ?? pinned;
  const specs = lines.shaker.specs;
  const H = headingLevel;

  return (
    <div className={styles.grid}>
      <figure className={`${styles.sheet} marks`}>
        <span className="marks__b" aria-hidden="true" />
        <div className={styles.sheetHead}>
          <span className="label">Fig. 1 — Wall &amp; base cabinet</span>
          <span className="label">Shaker / Nano</span>
        </div>
        <div className={styles.drawing}>
          <Image
            src="/brand/construction-shaker-nano.svg"
            alt="Line illustration of a Highland wall cabinet and base cabinet with numbered construction callouts"
            width={460}
            height={824}
            unoptimized
          />
          {shown
            ? marks[shown].map(([x, y], i) => (
                <span key={`${shown}-${i}`} className={styles.ring} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
              ))
            : null}
        </div>
        <figcaption className={styles.cap}>
          <span className="label">Illustration</span> Reproduced from Highland&rsquo;s Shaker/Nano catalog, Construction Features, p. 3
          (effective June 2025).
        </figcaption>
      </figure>

      <div className={styles.text}>
        <p className="label eyebrow">Construction</p>
        <H id={id} className={styles.title}>
          {title}
        </H>
        <p className="lead">
          {intro ??
            "Shaker and Nano cabinets share one box: cabinet-grade plywood, L-bracket reinforcement for stone tops, dovetail drawers and soft-close hardware. Select a feature to find it on the drawing."}
        </p>

        <ol className={styles.list}>
          {specs.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                className={styles.item}
                aria-pressed={pinned === s.callout}
                onClick={() => setPinned((p) => (p === s.callout ? null : (s.callout ?? null)))}
                onMouseEnter={() => setActive(s.callout ?? null)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.callout ?? null)}
                onBlur={() => setActive(null)}
              >
                <span className={styles.num} aria-hidden="true">
                  {s.callout}
                </span>
                <span className={styles.itemText}>
                  <span className={styles.itemLabel}>{s.label}</span>
                  <span className={styles.itemValue}>{s.value}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className={styles.foot}>
          {lines.shaker.specNotes[0]} Euro cabinets use frameless construction with a laminated furniture-board case — see the Euro collections
          for their specifications.
        </p>
        {source ? (
          <p className={styles.source}>
            <span className="label">Source</span> {source}. Highland may change specifications without notice; confirm current details with your
            account manager.
          </p>
        ) : null}
      </div>
    </div>
  );
}
