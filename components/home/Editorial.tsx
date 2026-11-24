import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { finishById, lines } from "@/content/collections";
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
   Collections — Highland's kitchen renderings, large, each opening its finish
   --------------------------------------------------------------------------- */
function Tile({ finishId, sizes, className, position }: { finishId: string; sizes: string; className: string; position?: string }) {
  const f = finishById(finishId)!;
  const m = media(f.media.scene);
  return (
    <figure className={`${className} unveil`}>
      <Link href={f.path} className={styles.tile}>
        <Photo id={f.media.scene} sizes={sizes} position={position} />
        <figcaption className={styles.tileCap}>
          <span className={styles.tileName}>{f.name}</span>
          <span className={styles.tileMeta}>
            {lines[f.line].name} · {kindLabel[m.kind]}
          </span>
          <span className={styles.tileGo} aria-hidden="true">
            <ArrowRight />
          </span>
        </figcaption>
      </Link>
    </figure>
  );
}

export function Collections() {
  return (
    <section className="section" aria-labelledby="gallery-title">
      <div className="container">
        <header className={`${styles.head} rise`}>
          <h2 id="gallery-title">Rooms worth walking into.</h2>
          <p className={styles.headText}>Highland&rsquo;s renderings of each line, finished and furnished. Open one to see the finish up close.</p>
        </header>

        <Tile finishId="euro-natural-walnut" className={styles.pWide} sizes="(max-width: 860px) 100vw, 92vw" position="50% 55%" />
        <div className={styles.pPair}>
          <Tile finishId="shaker-onyx-black" className={styles.pTall} sizes="(max-width: 860px) 100vw, 38vw" position="62% 50%" />
          <Tile finishId="nano-green" className={styles.pLand} sizes="(max-width: 860px) 100vw, 52vw" position="40% 50%" />
        </div>
        <Tile finishId="shaker-luxe" className={styles.pOffset} sizes="(max-width: 860px) 100vw, 62vw" position="50% 55%" />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   In real kitchens — installed White Shaker, photographed on site
   --------------------------------------------------------------------------- */
const installed = [
  { id: "project-white-shaker-01", text: "Perimeter in White Shaker around a dark island", position: "50% 60%" },
  { id: "project-white-shaker-06", text: "An island run under perforated brass pendants", position: "50% 55%" },
  { id: "project-white-shaker-03", text: "Drawer banks with matte black pulls", position: "50% 45%" },
];

export function RealKitchens() {
  return (
    <section className={`section ${styles.real}`} aria-labelledby="real-title">
      <div className={`container ${styles.realGrid}`}>
        <header className={`${styles.realHead} rise`}>
          <h2 id="real-title">And in real kitchens.</h2>
          <p className={styles.headText}>White Shaker as installed, photographed on site &mdash; no styling, no rendering.</p>
          <Link href="/wholesale-white-shaker-cabinets/" className="link-arrow">
            See White Shaker <ArrowRight />
          </Link>
        </header>
        <div className={styles.realStrip}>
          {installed.map((p) => (
            <figure key={p.id} className="unveil">
              <Photo id={p.id} sizes="(max-width: 860px) 100vw, 24vw" position={p.position} />
              <Caption id={p.id}>{p.text}</Caption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
