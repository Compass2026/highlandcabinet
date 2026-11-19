import Image from "next/image";
import Link from "next/link";
import { DealerDesk } from "./DealerDesk";
import { ArrowRight, Phone } from "@/components/ui/icons";
import { kindLabel, media } from "@/lib/media";
import { contact, phoenixLocation, telHref, visibleAffiliations } from "@/content/site";
import map from "@/content/map.generated.json";
import styles from "./Showroom.module.css";

/* ---------------------------------------------------------------------------
   Dealers — the warehouse beside one desk for "become" and "find"
   --------------------------------------------------------------------------- */
export function DealerSection() {
  const wh = media("warehouse");
  return (
    <section id="dealers" className={styles.dealers} aria-labelledby="dealers-title">
      <figure className={styles.whFigure}>
        <div className={styles.whPhoto}>
          <Image src={wh.src} alt={wh.alt} fill sizes="(max-width: 960px) 100vw, 46vw" placeholder="blur" blurDataURL={wh.blurDataURL} />
        </div>
        <figcaption className={styles.whCaption}>
          <span className={styles.whKicker}>{kindLabel[wh.kind]}</span>
          <span className={styles.whLine}>Stocked, picked and loaded in Phoenix.</span>
        </figcaption>
      </figure>

      <div className={styles.dealerBody}>
        <h2 id="dealers-title" className={styles.dealerTitle}>
          Become a dealer.
          <em>Or find one near you.</em>
        </h2>
        <DealerDesk />
        <p className={styles.trade}>
          Contractor or builder ordering for your own projects?{" "}
          <Link href="/wholesale-cabinets-for-contractors/">Open a trade account</Link>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Location — the one physical place, and how far it reaches
   --------------------------------------------------------------------------- */
const labelled = new Set(["Los Angeles", "Seattle", "Denver", "Dallas", "Chicago", "Atlanta", "Miami", "New York City", "Salt Lake City"]);
/** Labels set to the left of their dot, clear of the Phoenix pin and the map edge. */
const labelLeft = new Set(["Los Angeles", "New York City", "Miami"]);

function arc([x1, y1]: number[], [x2, y2]: number[]) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  // Bow each route upward by a fifth of its length.
  const nx = -dy / len;
  const ny = dx / len;
  const k = (ny > 0 ? -1 : 1) * len * 0.2;
  return `M${x1},${y1} Q${(mx + nx * k).toFixed(1)},${(my + ny * k).toFixed(1)} ${x2},${y2}`;
}

export function LocationSection() {
  const [px, py] = map.phoenix;
  const address = `${phoenixLocation.street}, ${phoenixLocation.locality}, ${phoenixLocation.region} ${phoenixLocation.postalCode}`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Highland Cabinetry, ${address}`)}`;
  return (
    <section id="showroom" className={`section ${styles.location}`} aria-labelledby="showroom-title">
      <div className={`container ${styles.locGrid}`}>
        <div className={styles.locText}>
          <h2 id="showroom-title" className={styles.locTitle}>
            One showroom.
            <em>Projects across the country.</em>
          </h2>
          <p className={styles.locLead}>
            Phoenix is Highland&rsquo;s showroom and warehouse. Projects elsewhere go out by Highland truck or freight carrier &mdash; tell us where the job is.
          </p>

          <div className={styles.card}>
            <p className={styles.cardName}>{phoenixLocation.name}</p>
            <address className={styles.addr}>
              {phoenixLocation.street}
              <br />
              {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}
            </address>
            <p className={styles.hours}>Warehouse pickup {phoenixLocation.pickupHours.value}</p>
            <div className={styles.cardActions}>
              <a href={directions} className="btn" target="_blank" rel="noopener noreferrer">
                Get directions <ArrowRight />
                <span className="visually-hidden"> (opens Google Maps)</span>
              </a>
              <a href={telHref(contact.phone.value)} className={styles.call}>
                <Phone /> {contact.phone.value}
              </a>
            </div>
          </div>

          <Link href="/wholesale-cabinets/" className="link-arrow">
            Check your area <ArrowRight />
          </Link>
        </div>

        <figure className={styles.mapFigure}>
          <div className={styles.map}>
            {/* Base map: public-domain US Census boundaries (scripts/build-map.mjs). */}
            <Image src="/map/us-states.svg" alt="" fill sizes="(max-width: 960px) 100vw, 58vw" unoptimized />
            <svg viewBox={`0 0 ${map.width} ${map.height}`} className={styles.overlay} role="img" aria-labelledby="map-title map-desc">
              <title id="map-title">Map of the United States with Highland&rsquo;s Phoenix showroom and warehouse</title>
              <desc id="map-desc">
                Routes run from Phoenix to {map.cities.length} cities named on Highland&rsquo;s service-area pages, including {map.cities.slice(0, 6).map((c) => c.name).join(", ")}.
              </desc>
              <g className={styles.routes}>
                {map.cities.map((c, i) => (
                  <path key={c.name} d={arc([px, py], c.point)} pathLength={1} style={{ ["--i" as string]: i }} />
                ))}
              </g>
              <g className={styles.cities}>
                {map.cities.map((c, i) => (
                  <g key={c.name} style={{ ["--i" as string]: i }}>
                    <circle cx={c.point[0]} cy={c.point[1]} r={3.2} />
                    {labelled.has(c.name) ? (
                      <text
                        x={labelLeft.has(c.name) ? c.point[0] - 7 : c.point[0] + 7}
                        y={c.point[1] + 3.5}
                        textAnchor={labelLeft.has(c.name) ? "end" : "start"}
                      >
                        {c.name}
                      </text>
                    ) : null}
                  </g>
                ))}
              </g>
              <g className={styles.pin} transform={`translate(${px} ${py})`}>
                <circle className={styles.pulse} r={10} />
                <circle className={styles.pulse2} r={10} />
                <circle r={7.5} className={styles.pinDot} />
                <circle r={2.6} className={styles.pinCore} />
                <text x={14} y={24} className={styles.pinLabel}>
                  Phoenix
                </text>
              </g>
            </svg>
          </div>
          <figcaption className={styles.mapCaption}>
            Routes connect Phoenix with cities named on Highland&rsquo;s service-area pages. Delivery method and timing are confirmed for each order.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Standards & associations — only confirmed marks appear on the public site
   --------------------------------------------------------------------------- */
export function Affiliations() {
  const list = visibleAffiliations();
  if (list.length === 0) return null;
  return (
    <section className={`section--tight ${styles.affil}`} aria-labelledby="affil-title">
      <div className="container">
        <h2 id="affil-title" className={styles.affilTitle}>
          Standards &amp; associations
        </h2>
        <ul className={styles.marks}>
          {list.map((a) => {
            const m = media(a.mark);
            return (
              <li key={a.id} className={styles.markItem}>
                <a href={a.href} className={styles.markDisc} target="_blank" rel="noopener noreferrer">
                  <Image src={m.src} alt={m.alt} width={m.width} height={m.height} className={styles.markImg} sizes="140px" />
                  <span className="visually-hidden"> (opens {a.name} website)</span>
                </a>
                <p className={styles.markName}>{a.name}</p>
                <p className={styles.markDetail}>{a.detail}</p>
                {a.status !== "confirmed" ? (
                  <p className={styles.pending} title={a.note}>
                    Preview only · awaiting confirmation
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
