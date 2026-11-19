import Image from "next/image";
import Link from "next/link";
import { kindLabel, media } from "@/lib/media";
import { ArrowRight } from "@/components/ui/icons";
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
        <header className={styles.head}>
          <h2 id="projects-title">In real kitchens.</h2>
          <p className={styles.headText}>Projects from Highland&rsquo;s White Shaker gallery, photographed on site.</p>
        </header>

        <figure className={styles.pWide}>
          <Photo id="project-white-shaker-06" sizes="(max-width: 860px) 100vw, 92vw" position="50% 58%" />
          <Caption id="project-white-shaker-06">An island run under perforated brass pendants</Caption>
        </figure>

        <div className={styles.pPair}>
          <figure className={styles.pTall}>
            <Photo id="project-white-shaker-03" sizes="(max-width: 860px) 100vw, 38vw" position="50% 45%" />
            <Caption id="project-white-shaker-03">Drawer banks with matte black pulls</Caption>
          </figure>
          <figure className={styles.pLand}>
            <Photo id="project-white-shaker-02" sizes="(max-width: 860px) 100vw, 52vw" position="50% 40%" />
            <Caption id="project-white-shaker-02">Tall cabinets framing a built-in refrigerator</Caption>
          </figure>
        </div>

        <figure className={styles.pOffset}>
          <Photo id="project-white-shaker-05" sizes="(max-width: 860px) 100vw, 62vw" position="50% 50%" />
          <Caption id="project-white-shaker-05">Lit glass-front uppers around a hood surround</Caption>
        </figure>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Craft — concise
   --------------------------------------------------------------------------- */
const craftSpecs = [
  { k: "Box", v: "Cabinet-grade plywood, L-bracket reinforced bases" },
  { k: "Drawers", v: "Dovetailed, ½″ solid wood sides" },
  { k: "Glides", v: "Full-extension, undermount, soft-close" },
  { k: "Hinges", v: "Concealed, six-way adjustable" },
];

export function Craft() {
  return (
    <section className={`section ${styles.craft}`} aria-labelledby="craft-title">
      <div className={`container ${styles.craftGrid}`}>
        <div className={styles.craftText}>
          <h2 id="craft-title">Built to be opened every day.</h2>
          <p className={styles.headText}>Every Shaker and Nano cabinet shares the same box, drawers and hardware.</p>
          <dl className={styles.specs}>
            {craftSpecs.map((s) => (
              <div key={s.k}>
                <dt>{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
          <Link href="/wholesale-white-shaker-cabinets/#construction" className="link-arrow">
            Full specifications <ArrowRight />
          </Link>
        </div>
        <div className={styles.details}>
          <figure>
            <Photo id="detail-grain-luxe" sizes="(max-width: 860px) 50vw, 20vw" />
            <Caption id="detail-grain-luxe">Shaker Luxe grain</Caption>
          </figure>
          <figure>
            <Photo id="detail-profile-white" sizes="(max-width: 860px) 50vw, 20vw" />
            <Caption id="detail-profile-white">The Shaker reveal</Caption>
          </figure>
          <figure>
            <Photo id="detail-pullout" sizes="(max-width: 860px) 50vw, 20vw" />
            <Caption id="detail-pullout">Full-extension pull-out</Caption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Contractor and dealer paths
   --------------------------------------------------------------------------- */
export function Paths() {
  return (
    <section className={`section ${styles.paths}`} aria-labelledby="paths-title">
      <div className="container">
        <h2 id="paths-title" className="visually-hidden">
          Work with Highland
        </h2>
        <div className={styles.pathGrid}>
          <Link href="/wholesale-cabinets-for-contractors/" className={styles.path}>
            <Photo id="project-white-shaker-07" sizes="(max-width: 860px) 100vw, 45vw" className={styles.pathPhoto} position="40% 55%" />
            <h3 className={styles.pathTitle}>Contractors &amp; builders</h3>
            <p className={styles.pathText}>A dedicated account manager, ordering by Excel form, portal or 2020 SKU list, and same-day processing before 3 PM Arizona time.</p>
            <span className={styles.more}>
              Open a trade account <ArrowRight />
            </span>
          </Link>
          <Link href="/become-a-dealer/" className={styles.path}>
            <Photo id="detail-brass" sizes="(max-width: 860px) 100vw, 45vw" className={styles.pathPhoto} position="50% 30%" />
            <h3 className={styles.pathTitle}>Dealers &amp; suppliers</h3>
            <p className={styles.pathText}>Carry Highland&rsquo;s Shaker, Nano and Euro lines — thirteen finishes — in your showroom.</p>
            <span className={styles.more}>
              Become a dealer <ArrowRight />
            </span>
          </Link>
        </div>
        <p className={styles.homeowner}>
          Planning your own kitchen? Highland sells through the trade —{" "}
          <Link href="/find-a-dealer/">we&rsquo;ll help you find a dealer</Link>.
        </p>
      </div>
    </section>
  );
}
