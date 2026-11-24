import Image from "next/image";
import { kindLabel, media } from "@/lib/media";
import styles from "./Editorial.module.css";

function Photo({ id, sizes, className, position }: { id: string; sizes: string; className?: string; position?: string }) {
  const m = media(id);
  return (
    <div className={`${styles.photo} photo-zoom ${className ?? ""}`}>
      <Image
        src={m.src}
        alt={m.alt}
        fill
        sizes={sizes}
        placeholder={m.blurDataURL ? "blur" : "empty"}
        blurDataURL={m.blurDataURL}
        style={{ objectFit: "cover", objectPosition: position }}
      />
    </div>
  );
}

function Caption({ id, children }: { id: string; children?: React.ReactNode }) {
  return (
    <figcaption className={styles.caption}>
      <span className={styles.kind}>{kindLabel[media(id).kind]}</span>
      {children ? <span>{children}</span> : null}
    </figcaption>
  );
}

/* ---------------------------------------------------------------------------
   Projects — a curated set of large installed-project photographs
   --------------------------------------------------------------------------- */
export function Projects() {
  return (
    <section className="section" aria-labelledby="projects-title">
      <div className="container">
        <header className={`${styles.head} rise`}>
          <h2 id="projects-title">In real kitchens.</h2>
          <p className={styles.headText}>Projects from Highland&rsquo;s White Shaker gallery, photographed on site.</p>
        </header>

        <figure className={`${styles.pWide} unveil`}>
          <Photo id="project-white-shaker-06" sizes="(max-width: 860px) 100vw, 92vw" position="50% 58%" />
          <Caption id="project-white-shaker-06">An island run under perforated brass pendants</Caption>
        </figure>

        <div className={styles.pPair}>
          <figure className={`${styles.pTall} unveil`}>
            <Photo id="project-white-shaker-03" sizes="(max-width: 860px) 100vw, 38vw" position="50% 45%" />
            <Caption id="project-white-shaker-03">Drawer banks with matte black pulls</Caption>
          </figure>
          <figure className={`${styles.pLand} unveil`}>
            <Photo id="project-white-shaker-02" sizes="(max-width: 860px) 100vw, 52vw" position="50% 40%" />
            <Caption id="project-white-shaker-02">Tall cabinets framing a built-in refrigerator</Caption>
          </figure>
        </div>

        <figure className={`${styles.pOffset} unveil`}>
          <Photo id="project-white-shaker-05" sizes="(max-width: 860px) 100vw, 62vw" position="50% 50%" />
          <Caption id="project-white-shaker-05">Lit glass-front uppers around a hood surround</Caption>
        </figure>
      </div>
    </section>
  );
}
