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
  /** Use a different room photograph for a finish in this context (avoids repeating a photo used nearby). */
  sceneOverride?: Record<string, string>;
  headingId: string;
}

/**
 * Finish selector. Choosing a sample updates the cabinet itself (Highland's product rendering in that
 * finish), the room photograph, the description and the links. Samples are crops of the same
 * renderings — real finishes, never recoloured. Native radios give arrow-key navigation.
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

  const sceneOf = (f: Finish) => media(sceneOverride[f.id] ?? f.media.scene);
  const render = media(current.media.render);
  const prevRender = previous ? media(finishes.find((f) => f.id === previous)!.media.render) : null;
  const scene = sceneOf(current);

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <div className={styles.floor} aria-hidden="true" />
        <div className={styles.cabinet}>
          {prevRender ? (
            <Image
              key={`p-${previous}`}
              src={prevRender.src}
              alt=""
              width={prevRender.width}
              height={prevRender.height}
              sizes="(max-width: 900px) 70vw, 34vw"
              className={styles.out}
              onAnimationEnd={() => setPrevious(null)}
            />
          ) : null}
          <Image
            key={current.id}
            src={render.src}
            alt={render.alt}
            width={render.width}
            height={render.height}
            sizes="(max-width: 900px) 70vw, 34vw"
            className={styles.in}
          />
        </div>
        <figure className={styles.scene}>
          <div className={styles.sceneImg}>
            <Image key={`s-${current.id}`} src={scene.src} alt={scene.alt} fill sizes="(max-width: 900px) 40vw, 18vw" className={styles.sceneIn} />
          </div>
          <figcaption>
            <span className="label">{kindLabel[scene.kind]}</span>
          </figcaption>
        </figure>
        <p className={styles.stageCap}>
          <span className="code">B21</span> Base cabinet, 21″ wide · product rendering
        </p>
      </div>

      <div className={styles.panel}>
        <p className="visually-hidden" aria-live="polite">
          Showing {current.name}, {lines[current.line].name} line.
        </p>
        <div className={styles.info} key={`i-${current.id}`}>
          <p className={styles.meta}>
            <span className="code">{current.code}</span> {lines[current.line].name} · {current.finishType}
          </p>
          <h3 className={styles.name}>{current.name}</h3>
          <p className={styles.desc}>{current.description}</p>
        </div>

        <fieldset className={styles.chips} aria-labelledby={headingId}>
          <legend className="visually-hidden">Choose a finish</legend>
          {lineOrder.map((line) => (
            <div key={line} className={styles.group}>
              <p className={styles.groupName} aria-hidden="true">
                {lines[line].name}
              </p>
              <div className={styles.row}>
                {finishes
                  .filter((f) => f.line === line)
                  .map((f) => {
                    const chip = media(f.media.chip);
                    return (
                      <label key={f.id} className={styles.chip} data-selected={f.id === selected ? "" : undefined} title={f.name}>
                        <input
                          type="radio"
                          name={name}
                          value={f.id}
                          checked={f.id === selected}
                          onChange={() => choose(f.id)}
                          className={styles.input}
                        />
                        <span className={styles.swatch}>
                          <Image src={chip.src} alt="" width={chip.width} height={chip.height} sizes="64px" />
                        </span>
                        <span className={styles.chipName}>{f.name}</span>
                      </label>
                    );
                  })}
              </div>
            </div>
          ))}
        </fieldset>

        <div className={styles.actions}>
          <Link href={current.path} className="btn btn--ghost">
            View {current.name} <ArrowRight />
          </Link>
          <QuoteButton finishId={current.id} source="home-finish-selector" className="link-arrow">
            Quote this finish
          </QuoteButton>
        </div>
        <p className={styles.note}>Samples are taken from Highland&rsquo;s product renderings. Real wood and paint vary with light and grain.</p>
      </div>
    </div>
  );
}
