"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { finishes, lineOrder, lines, type Finish } from "@/content/collections";
import { kindLabel, media } from "@/lib/media";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./FinishTray.module.css";

interface Props {
  initial?: string;
  /** Use a different scene for a finish in this context (e.g. to avoid repeating the hero photo). */
  sceneOverride?: Record<string, string>;
  headingId: string;
}

/**
 * A curated tray of finish samples. Each chip is a crop of Highland's own product rendering —
 * real finishes, never recoloured photographs. Native radio inputs give arrow-key navigation.
 */
export function FinishTray({ initial = "shaker-white", sceneOverride = {}, headingId }: Props) {
  const name = useId();
  const [selected, setSelected] = useState(initial);
  const [previous, setPrevious] = useState<string | null>(null);
  const current = finishes.find((f) => f.id === selected)!;

  const choose = (id: string) => {
    if (id === selected) return;
    setPrevious(selected);
    setSelected(id);
  };

  const sceneId = (f: Finish) => sceneOverride[f.id] ?? f.media.scene;
  const scene = media(sceneId(current));
  const render = media(current.media.render);
  const prevScene = previous ? media(sceneId(finishes.find((f) => f.id === previous)!)) : null;

  return (
    <div className={styles.wrap}>
      <fieldset className={styles.tray} aria-labelledby={headingId}>
        <legend className="visually-hidden">Choose a finish</legend>
        {lineOrder.map((line) => (
          <div key={line} className={styles.row} role="presentation">
            <p className={styles.rowLabel} aria-hidden="true">
              <span className={styles.rowName}>{lines[line].name}</span>
              <span className={styles.rowMeta}>
                {lines[line].construction} · {finishes.filter((f) => f.line === line).length} finishes
              </span>
            </p>
            <div className={styles.chips}>
              {finishes
                .filter((f) => f.line === line)
                .map((f) => {
                  const chip = media(f.media.chip);
                  return (
                    <label key={f.id} className={styles.chip} data-selected={f.id === selected ? "" : undefined}>
                      <input
                        type="radio"
                        name={name}
                        value={f.id}
                        checked={f.id === selected}
                        onChange={() => choose(f.id)}
                        className={styles.input}
                        aria-describedby={`${name}-${f.id}-d`}
                      />
                      <span className={styles.swatch}>
                        <Image src={chip.src} alt="" width={chip.width} height={chip.height} sizes="(max-width: 640px) 22vw, 88px" />
                      </span>
                      <span className={styles.chipName}>{f.name}</span>
                      <span id={`${name}-${f.id}-d`} className="visually-hidden">
                        {lines[f.line].name} line, {f.finishType}
                      </span>
                    </label>
                  );
                })}
            </div>
          </div>
        ))}
        <p className={styles.trayNote}>
          Samples are cropped from Highland&rsquo;s product renderings — the reveal, frame and face of each door. Actual finishes vary with
          lighting and natural woodgrain.
        </p>
      </fieldset>

      <div className={styles.display}>
        <p className="visually-hidden" aria-live="polite">
          Showing {current.name}, {lines[current.line].name} line.
        </p>
        <div className={styles.stage}>
          {prevScene ? (
            <Image
              key={`prev-${previous}`}
              src={prevScene.src}
              alt=""
              fill
              sizes="(max-width: 1040px) 100vw, 58vw"
              className={styles.sceneOut}
              onAnimationEnd={() => setPrevious(null)}
            />
          ) : null}
          <Image
            key={current.id}
            src={scene.src}
            alt={scene.alt}
            fill
            sizes="(max-width: 1040px) 100vw, 58vw"
            className={styles.sceneIn}
            placeholder={scene.blurDataURL ? "blur" : "empty"}
            blurDataURL={scene.blurDataURL}
          />
          <p className={`label ${styles.stageTag}`}>{kindLabel[scene.kind]}</p>
        </div>

        <div className={styles.card} key={`card-${current.id}`}>
          <div className={styles.render}>
            <Image src={render.src} alt={render.alt} width={render.width} height={render.height} sizes="(max-width: 640px) 34vw, 180px" />
          </div>
          <div className={styles.cardText}>
            <p className={styles.meta}>
              <span className="code">{current.code}</span>
              <span>
                {lines[current.line].name} · {current.finishType}
              </span>
            </p>
            <h3 className={styles.name}>{current.name}</h3>
            <p className={styles.desc}>{current.description}</p>
            <div className={styles.actions}>
              <Link href={current.path} className="link-arrow">
                View {current.name} <ArrowRight />
              </Link>
              <QuoteButton finishId={current.id} source="home-finish-tray" className={`btn ${styles.quote}`}>
                Quote this finish
              </QuoteButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
