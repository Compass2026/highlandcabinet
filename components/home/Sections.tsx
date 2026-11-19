import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { ArrowRight, Download } from "@/components/ui/icons";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { catalogs, orderPolicy, phoenixLocation } from "@/content/site";
import styles from "./Sections.module.css";

/* ---------------------------------------------------------------------------
   Who Highland works with — four cabinet fronts separated by reveals.
   --------------------------------------------------------------------------- */
const audiences = [
  {
    tag: "Contractors & builders",
    title: "Supply for every phase of the build.",
    body: "Open a trade account, get a dedicated account manager, and order by Excel form, customer portal or 2020 SKU list.",
    href: "/wholesale-cabinets-for-contractors/",
    cta: "How trade accounts work",
  },
  {
    tag: "Remodelers & investors",
    title: "Finishes that turn a house over.",
    body: "Thirteen finishes across Shaker, Nano and Euro, with 2020 Design-compatible catalog files available on request.",
    href: "/products/",
    cta: "Browse collections",
  },
  {
    tag: "Dealers & suppliers",
    title: "Carry Highland in your showroom.",
    body: "Add Highland's lines to your offer. Tell us about your business and the markets you serve.",
    href: "/become-a-dealer/",
    cta: "Become a dealer",
  },
  {
    tag: "Homeowners",
    title: "Planning your own kitchen?",
    body: "Highland sells through the trade. Tell us where your project is and we'll help you find a dealer nearby.",
    href: "/find-a-dealer/",
    cta: "Find a dealer",
  },
];

export function Audiences() {
  return (
    <section className="section" aria-labelledby="who-title">
      <div className="container">
        <div className={styles.head}>
          <p className="label eyebrow">Who we work with</p>
          <h2 id="who-title" className={styles.h2}>
            One supplier, four ways in.
          </h2>
        </div>
        <ul className={styles.bank}>
          {audiences.map((a) => (
            <li key={a.tag} className={styles.door}>
              <Link href={a.href} className={styles.doorLink}>
                <span className={styles.doorPanel}>
                  <span className={`label ${styles.doorTag}`}>{a.tag}</span>
                  <span className={styles.doorTitle}>{a.title}</span>
                  <span className={styles.doorBody}>{a.body}</span>
                  <span className={styles.doorCta}>
                    {a.cta} <ArrowRight />
                  </span>
                </span>
                <span className={styles.pull} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Featured collection — White Shaker, the collection with installed photography.
   --------------------------------------------------------------------------- */
export function Featured() {
  return (
    <section className={`section on-dark ${styles.featured}`} aria-labelledby="featured-title">
      <div className={`container ${styles.featuredGrid}`}>
        <div className={styles.featuredText}>
          <p className="label eyebrow">In the field</p>
          <h2 id="featured-title" className={styles.h2}>
            White Shaker, installed.
          </h2>
          <p className="lead">
            Much of Highland&rsquo;s imagery is rendered for the catalog. These are not — they are kitchens from Highland&rsquo;s White Shaker
            project gallery, photographed on site.
          </p>
          <div className={styles.featuredCtas}>
            <Link href="/wholesale-white-shaker-cabinets/" className="btn">
              Explore White Shaker <ArrowRight />
            </Link>
            <QuoteButton finishId="shaker-white" source="home-featured" className="btn btn--ghost" />
          </div>
        </div>
        <div className={styles.featuredImages}>
          <Media id="project-white-shaker-04" sizes="(max-width: 900px) 100vw, 40vw" caption="Glass-front uppers and a six-seat island" className={styles.fa} />
          <Media id="project-white-shaker-03" sizes="(max-width: 900px) 60vw, 22vw" caption="Drawer bank beside a professional range" className={styles.fb} />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   How trade accounts work + verified ordering policy (catalog, June 2025)
   --------------------------------------------------------------------------- */
const steps = [
  { t: "Get in touch", d: "Call, send a quote request, or visit the Phoenix showroom." },
  { t: "Talk it through", d: "A member of the sales team learns your projects, products and timelines." },
  { t: "Set up your account", d: "We collect your business details and preferences to build your customer profile." },
  { t: "Meet your account manager", d: "One point of contact for current orders, questions and planning ahead." },
];

export function TradeProcess() {
  return (
    <section className="section on-linen" aria-labelledby="trade-title">
      <div className={`container ${styles.tradeGrid}`}>
        <div>
          <p className="label eyebrow">Working with Highland</p>
          <h2 id="trade-title" className={styles.h2}>
            From first call to account manager.
          </h2>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s.t}>
                <span className={`label ${styles.stepNo}`}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={styles.stepT}>{s.t}</h3>
                  <p className={styles.stepD}>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${styles.policy} marks`}>
          <span className="marks__b" aria-hidden="true" />
          <p className="label muted">Ordering · from the June 2025 catalogs</p>
          <h3 id="policy-title" className={styles.policyTitle}>
            Order details
          </h3>
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
              <dd>
                <ul>
                  {orderPolicy.deliveryOptions.value.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Design files</dt>
              <dd>{orderPolicy.designSoftware.value}</dd>
            </div>
          </dl>
          <p className={styles.policyNote}>Lead times depend on inventory and destination — your account manager will confirm them for each order.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Catalogs — binders on the shelf
   --------------------------------------------------------------------------- */
export function Catalogs({ id = "catalogs" }: { id?: string }) {
  return (
    <section className="section" aria-labelledby={`${id}-title`} id={id}>
      <div className={`container ${styles.catGrid}`}>
        <div>
          <p className="label eyebrow">Catalogs</p>
          <h2 id={`${id}-title`} className={styles.h2}>
            Every cabinet, every size.
          </h2>
          <p className="lead">
            Full product catalogs with nomenclature, dimensions, accessories and ordering policies. Highland reserves the right to change
            specifications — confirm current details with your account manager.
          </p>
        </div>
        <ul className={styles.binders}>
          {catalogs.map((c) => (
            <li key={c.id}>
              <a href={c.href} className={styles.binder}>
                <span className={styles.spine} aria-hidden="true" />
                <span className={styles.binderBody}>
                  <span className="label muted">{c.edition}</span>
                  <span className={styles.binderTitle}>{c.title}</span>
                  <span className={styles.binderMeta}>
                    {c.pages} pages · {c.sizeLabel}
                  </span>
                </span>
                <span className={styles.binderIcon}>
                  <Download />
                  <span className="visually-hidden">Download PDF</span>
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
    <section className="section--tight" aria-labelledby="loc-title">
      <div className={`container ${styles.locGrid}`}>
        <div className={styles.locCard}>
          <p className="label muted">Physical location</p>
          <h2 id="loc-title" className={styles.locTitle}>
            {phoenixLocation.name}
          </h2>
          <address className={styles.addr}>
            {phoenixLocation.street}
            <br />
            {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}
          </address>
          <p className={styles.locNote}>Warehouse pickup: {phoenixLocation.pickupHours.value}</p>
        </div>
        <div className={styles.locText}>
          <p className="label eyebrow">Service areas</p>
          <p className={styles.locLead}>
            Our showroom and warehouse are in Phoenix. For projects elsewhere, we work with trade customers and dealers through delivery and
            freight — tell us where the job is and we&rsquo;ll confirm the options.
          </p>
          <Link href="/wholesale-cabinets/" className="link-arrow">
            Check delivery to your area <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Closing call to action
   --------------------------------------------------------------------------- */
export function ClosingCta({ finishId, source = "closing-cta" }: { finishId?: string; source?: string }) {
  return (
    <section className={`on-dark ${styles.closing}`} aria-labelledby="close-title">
      <div className={`container ${styles.closingGrid}`}>
        <h2 id="close-title" className={styles.closingTitle}>
          Have plans on the table? <em>Let&rsquo;s price them.</em>
        </h2>
        <div className={styles.closingCtas}>
          <QuoteButton finishId={finishId} source={source} />
          <Link href="/become-a-dealer/" className="btn btn--ghost">
            Become a Dealer
          </Link>
          <Link href="/find-a-dealer/" className={styles.closingLink}>
            Homeowner? Find a dealer
          </Link>
        </div>
      </div>
    </section>
  );
}
