import Image from "next/image";
import Link from "next/link";
import { finishesByLine, lines, type LineId } from "@/content/collections";
import { orderPolicy } from "@/content/site";
import { kindLabel, media } from "@/lib/media";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./Editorial.module.css";

function Photo({ id, sizes, className, position, alt }: { id: string; sizes: string; className?: string; position?: string; alt?: string }) {
  const m = media(id);
  return (
    <div className={`${styles.photo} photo-zoom ${className ?? ""}`}>
      <Image
        src={m.src}
        alt={alt ?? m.alt}
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
    <p className={styles.caption}>
      <span className="label">{kindLabel[media(id).kind]}</span>
      {children ? <span>{children}</span> : null}
    </p>
  );
}

/* ---------------------------------------------------------------------------
   Three lines
   --------------------------------------------------------------------------- */
const lineCards: { id: LineId; scene: string; position?: string; blurb: string }[] = [
  { id: "shaker", scene: "scene-shaker-luxe", position: "62% 50%", blurb: "The recessed-panel door, in six painted and stained finishes." },
  { id: "nano", scene: "scene-nano-green", position: "40% 50%", blurb: "A quieter flat panel on the same plywood box." },
  { id: "euro", scene: "scene-euro-white-oak", position: "45% 50%", blurb: "Frameless and full-access, in woodgrain, matte and gloss." },
];

export function Lines() {
  return (
    <section id="collections" className={`section ${styles.lines}`} aria-labelledby="lines-title">
      <div className="container">
        <header className={styles.head}>
          <p className="label eyebrow">Collections</p>
          <h2 id="lines-title">Three lines, thirteen finishes.</h2>
        </header>
        <ul className={styles.lineGrid}>
          {lineCards.map((c) => {
            const line = lines[c.id];
            const n = finishesByLine(c.id).length;
            return (
              <li key={c.id}>
                <Link href={`/products/#line-${c.id}`} className={styles.lineCard}>
                  <Photo id={c.scene} sizes="(max-width: 860px) 100vw, 31vw" className={styles.portrait} position={c.position} />
                  <p className={styles.lineMeta}>
                    {line.construction} · {n} finishes
                  </p>
                  <h3 className={styles.lineName}>{line.name}</h3>
                  <p className={styles.lineBlurb}>{c.blurb}</p>
                  <span className={styles.more}>
                    Explore {line.name} <ArrowRight />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Full-bleed photograph
   --------------------------------------------------------------------------- */
export function FullBleed({ id, caption, position, tall }: { id: string; caption: string; position?: string; tall?: boolean }) {
  return (
    <figure className={styles.bleed}>
      <Photo id={id} sizes="100vw" className={tall ? styles.bleedTall : styles.bleedImg} position={position} />
      <figcaption className="container">
        <Caption id={id}>{caption}</Caption>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------------------
   Craft, up close
   --------------------------------------------------------------------------- */
const craftSpecs = [
  { k: "Box", v: "Cabinet-grade plywood: ½″ end panels, ⅝″ back, L-bracket reinforced bases" },
  { k: "Drawers", v: "Dovetailed, with ½″ solid wood sides" },
  { k: "Glides", v: "Full-extension, undermount, soft-close" },
  { k: "Hinges", v: "Concealed, six-way adjustable" },
];

export function Craft() {
  return (
    <section className={`section ${styles.craft}`} aria-labelledby="craft-title">
      <div className={`container ${styles.craftGrid}`}>
        <div className={styles.craftText}>
          <p className="label eyebrow">Construction</p>
          <h2 id="craft-title">Made to be opened every day.</h2>
          <p className="lead">Every Shaker and Nano cabinet shares the same box, drawers and hardware.</p>
          <dl className={styles.specs}>
            {craftSpecs.map((s) => (
              <div key={s.k}>
                <dt>{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.source}>From the Shaker/Nano catalog, effective June 2025.</p>
          <Link href="/wholesale-white-shaker-cabinets/#construction" className="link-arrow">
            Full specifications <ArrowRight />
          </Link>
        </div>

        <div className={styles.mosaic}>
          <figure className={styles.mA}>
            <Photo id="detail-grain-luxe" sizes="(max-width: 860px) 50vw, 26vw" />
            <Caption id="detail-grain-luxe">Shaker Luxe — stained oak, grain set across the rail</Caption>
          </figure>
          <figure className={styles.mB}>
            <Photo id="detail-hardware" sizes="(max-width: 860px) 50vw, 26vw" />
            <Caption id="detail-hardware">White Shaker drawers, matte black pulls</Caption>
          </figure>
          <figure className={styles.mC}>
            <Photo id="detail-profile-white" sizes="(max-width: 860px) 50vw, 26vw" />
            <Caption id="detail-profile-white">The reveal and the recessed panel</Caption>
          </figure>
          <figure className={styles.mD}>
            <Photo id="detail-pullout" sizes="(max-width: 860px) 50vw, 26vw" />
            <Caption id="detail-pullout">Euro pull-out on a full-extension runner</Caption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   For the trade
   --------------------------------------------------------------------------- */
export function Trade() {
  return (
    <section className={`section ${styles.trade}`} aria-labelledby="trade-title">
      <div className={`container ${styles.split}`}>
        <figure className={styles.splitImg}>
          <Photo id="project-white-shaker-07" sizes="(max-width: 860px) 100vw, 46vw" className={styles.tallPhoto} position="40% 50%" />
          <Caption id="project-white-shaker-07">White Shaker with stacked wall ovens</Caption>
        </figure>
        <div className={styles.splitText}>
          <p className="label eyebrow">For the trade</p>
          <h2 id="trade-title">One account manager, every order.</h2>
          <p className="lead">
            Contractors, builders and remodelers get a dedicated account manager who knows their projects and manages every order.
          </p>
          <ul className={styles.facts}>
            <li>
              <span>Order</span> by Excel form, customer portal or 2020 SKU list
            </li>
            <li>
              <span>Same-day</span> processing for orders in by {orderPolicy.cutoff.value.split(",")[0]}
            </li>
            <li>
              <span>Delivery</span> by pickup, Highland delivery truck or common carrier
            </li>
          </ul>
          <div className={styles.ctas}>
            <Link href="/wholesale-cabinets-for-contractors/" className="btn">
              Open a trade account <ArrowRight />
            </Link>
            <QuoteButton source="home-trade" className="btn btn--ghost" arrow={false}>
              Request a quote
            </QuoteButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Two paths: dealers and homeowners
   --------------------------------------------------------------------------- */
export function Paths() {
  return (
    <section className={`section ${styles.paths}`} aria-label="Dealers and homeowners">
      <div className={`container ${styles.pathGrid}`}>
        <Link href="/become-a-dealer/" className={styles.path}>
          <Photo id="detail-brass" sizes="(max-width: 860px) 100vw, 44vw" className={styles.landscape} position="50% 30%" />
          <p className="label eyebrow">Dealers &amp; suppliers</p>
          <h2 className={styles.pathTitle}>Carry Highland in your showroom.</h2>
          <p className={styles.pathText}>Three lines and thirteen finishes, with a dedicated account manager.</p>
          <span className={styles.more}>
            Become a dealer <ArrowRight />
          </span>
        </Link>
        <Link href="/find-a-dealer/" className={styles.path}>
          <Photo id="project-white-shaker-02" sizes="(max-width: 860px) 100vw, 44vw" className={styles.landscape} position="50% 40%" />
          <p className="label eyebrow">Homeowners</p>
          <h2 className={styles.pathTitle}>Planning your own kitchen?</h2>
          <p className={styles.pathText}>Highland sells through the trade. Tell us where you are and we&rsquo;ll find you a dealer.</p>
          <span className={styles.more}>
            Find a dealer <ArrowRight />
          </span>
        </Link>
      </div>
    </section>
  );
}
