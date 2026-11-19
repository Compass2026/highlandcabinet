import Link from "next/link";
import { ArrowRight, Download } from "@/components/ui/icons";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { catalogs, contact, orderPolicy, phoenixLocation } from "@/content/site";
import styles from "./Sections.module.css";

/* ---------------------------------------------------------------------------
   How trade accounts work + verified ordering policy (catalog, June 2025)
   --------------------------------------------------------------------------- */
const steps = [
  { t: "Get in touch", d: "Call, send a quote request, or visit the Phoenix showroom." },
  { t: "Talk it through", d: "Sales learns your projects, products and timelines." },
  { t: "Set up your account", d: "We build your customer profile from your business details." },
  { t: "Meet your account manager", d: "One contact for orders, questions and planning ahead." },
];

export function TradeProcess() {
  return (
    <section className="section" aria-labelledby="trade-title">
      <div className={`container ${styles.tradeGrid}`}>
        <div>
          <p className="label eyebrow">Working with Highland</p>
          <h2 id="trade-title" className={styles.h2}>
            From first call to account manager.
          </h2>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s.t}>
                <span className={styles.stepNo}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={styles.stepT}>{s.t}</h3>
                  <p className={styles.stepD}>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.policy}>
          <p className="label eyebrow">Ordering, from the June 2025 catalogs</p>
          <dl className={styles.policyList}>
            <div>
              <dt>Same-day cut-off</dt>
              <dd>{orderPolicy.cutoff.value}</dd>
            </div>
            <div>
              <dt>How to order</dt>
              <dd>{orderPolicy.orderMethods.value.join(", ")}. Orders aren&rsquo;t taken by phone.</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{orderPolicy.deliveryOptions.value.join("; ")}.</dd>
            </div>
            <div>
              <dt>Design files</dt>
              <dd>{orderPolicy.designSoftware.value}</dd>
            </div>
          </dl>
          <p className={styles.small}>Lead times depend on inventory and destination; your account manager confirms them for each order.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Catalogs — a quiet list
   --------------------------------------------------------------------------- */
export function Catalogs({ id = "catalogs" }: { id?: string }) {
  return (
    <section className="section" aria-labelledby={`${id}-title`} id={id}>
      <div className={`container ${styles.catGrid}`}>
        <div className={styles.catText}>
          <p className="label eyebrow">Catalogs</p>
          <h2 id={`${id}-title`} className={styles.h2}>
            Every cabinet, every size.
          </h2>
          <p className="lead">Nomenclature, dimensions, accessories and ordering policies for each line.</p>
        </div>
        <ul className={styles.catList}>
          {catalogs.map((c) => (
            <li key={c.id}>
              <a href={c.href} className={styles.cat}>
                <span className={styles.catTitle}>{c.title}</span>
                <span className={styles.catMeta}>
                  {c.edition} · {c.pages} pages · {c.sizeLabel}
                </span>
                <span className={styles.catDl}>
                  <Download /> <span>Download</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Location — the one physical place, kept distinct from areas served
   --------------------------------------------------------------------------- */
export function Location() {
  return (
    <section className={`section--tight ${styles.loc}`} aria-labelledby="loc-title">
      <div className={`container ${styles.locGrid}`}>
        <div>
          <p className="label eyebrow">Showroom &amp; warehouse</p>
          <h2 id="loc-title" className={styles.locTitle}>
            Phoenix, Arizona
          </h2>
        </div>
        <address className={styles.addr}>
          {phoenixLocation.street}
          <br />
          {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}
          <span>Warehouse pickup {phoenixLocation.pickupHours.value}</span>
        </address>
        <div className={styles.locText}>
          <p>Projects elsewhere are supplied by delivery and freight. Tell us where the job is.</p>
          <Link href="/wholesale-cabinets/" className="link-arrow">
            Service areas <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Closing call to action — light, centred, brief
   --------------------------------------------------------------------------- */
export function ClosingCta({ finishId, source = "closing-cta" }: { finishId?: string; source?: string }) {
  return (
    <section className={styles.closing} aria-labelledby="close-title">
      <div className={`container ${styles.closingInner}`}>
        <h2 id="close-title" className={styles.closingTitle}>
          Have plans on the table?
        </h2>
        <p className={styles.closingLead}>Send them over and we&rsquo;ll price the cabinetry. Or call the sales team on {contact.phone.value}.</p>
        <div className={styles.closingCtas}>
          <QuoteButton finishId={finishId} source={source} arrow={false}>
            Request a quote
          </QuoteButton>
          <Link href="/become-a-dealer/" className="btn btn--ghost">
            Become a dealer
          </Link>
        </div>
        <Link href="/find-a-dealer/" className={styles.closingLink}>
          Homeowner? Find a dealer
        </Link>
      </div>
    </section>
  );
}
