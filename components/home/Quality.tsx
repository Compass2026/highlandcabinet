import Image from "next/image";
import { kindLabel, media } from "@/lib/media";
import { euroBuild, manifesto, pillars, qualitySource, service } from "@/content/quality";
import styles from "./Quality.module.css";

function Detail({ id, caption, className }: { id: string; caption: string; className?: string }) {
  const m = media(id);
  return (
    <figure className={`${styles.detail} ${className ?? ""} unveil`}>
      <div className={styles.detailPhoto}>
        <Image src={m.src} alt={m.alt} fill sizes="(max-width: 960px) 100vw, 40vw" placeholder="blur" blurDataURL={m.blurDataURL} />
      </div>
      <figcaption className={styles.cap}>
        <span className={styles.capKind}>{kindLabel[m.kind]}</span> {caption}
      </figcaption>
    </figure>
  );
}

/**
 * What makes a Highland cabinet — Highland's own words and catalog specifications,
 * told as reasons rather than a spec sheet. The interactive drawing follows as the proof.
 */
export function Quality() {
  return (
    <section id="quality" className={`section ${styles.quality}`} aria-labelledby="quality-title">
      <div className="container">
        <div className={styles.intro}>
          <div className="rise">
            <h2 id="quality-title" className={styles.title}>
              {manifesto.title}
            </h2>
            <p className={styles.lead}>
              What you&rsquo;ll notice when a Highland cabinet comes off the truck &mdash; and what you won&rsquo;t have to think about once
              it&rsquo;s on the wall.
            </p>
          </div>
          <figure className={`${styles.quote} rise`}>
            <blockquote>
              <p>&ldquo;{manifesto.quote}&rdquo;</p>
            </blockquote>
            <figcaption>From Highland&rsquo;s catalogs, June 2025</figcaption>
          </figure>
        </div>

        <div className={styles.body}>
          <div className={styles.visual}>
            <Detail id="detail-grain-luxe" caption="Shaker Luxe — real wood grain under a UV clear coat" />
            <p className={styles.supply}>
              <span className={styles.supplyMark} aria-hidden="true" />
              &ldquo;{manifesto.supplyChain}&rdquo;
            </p>
          </div>

          <ol className={styles.pillars}>
            {pillars.map((p, i) => (
              <li key={p.title} className={`${styles.pillar} rise`}>
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.pTitle}>{p.title}</h3>
                <p className={styles.pText}>{p.text}</p>
                <p className={styles.scope}>{p.scope}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.euro}>
          <Detail id="detail-pullout" caption="Euro White Oak pull-out on a full-extension runner" className={styles.euroPhoto} />
          <div className={`${styles.euroText} rise`}>
            <h3 className={styles.euroTitle}>{euroBuild.title}</h3>
            <p>{euroBuild.text}</p>
          </div>
          <Detail id="detail-profile-white" caption="White Shaker — the drawer-to-door reveal" className={styles.euroPhoto2} />
        </div>

        <div className={styles.service}>
          <h3 className={styles.serviceTitle}>And the service behind every cabinet.</h3>
          <dl className={styles.serviceList}>
            {service.map((s) => (
              <div key={s.k}>
                <dt>{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.source}>Specifications and policies: {qualitySource}.</p>
        </div>
      </div>
    </section>
  );
}
