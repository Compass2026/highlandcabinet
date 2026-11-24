import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ClosingCta } from "@/components/home/Sections";
import { ArrowRight } from "@/components/ui/icons";
import { finishes, lines, lineOrder } from "@/content/collections";
import { catalogs, contact, indexingEnabled, orderPolicy, phoenixLocation, telHref } from "@/content/site";
import { areaFaq, citiesIn, sceneFor, type ServiceArea } from "@/lib/serviceAreas";
import { jsonLd } from "@/lib/seo";
import styles from "./ServiceAreaPage.module.css";

export function ServiceAreaPage({ area }: { area: ServiceArea }) {
  const place = area.cityName ?? area.stateName;
  const isCity = Boolean(area.city);
  const isArizona = area.state === "arizona";
  const cities = isCity ? [] : citiesIn(area.state);
  const nearby = isCity ? citiesIn(area.state).filter((c) => c.path !== area.path) : [];
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Service areas", href: "/wholesale-cabinets/" },
    { label: area.stateName, href: `/wholesale-cabinets/${area.state}/` },
    ...(isCity ? [{ label: area.cityName!, href: area.path }] : []),
  ];
  const faq = areaFaq(area);
  const audiences = ["Builders & developers", "General contractors", "Flippers & real-estate investors", "Remodelers & renovators", "Handymen & installers", "Restoration companies", "Cabinet dealers & suppliers"];
  const steps = [
    { t: "Get in touch", d: "Call, send a quote request, or visit the Phoenix showroom." },
    { t: "Open your trade account", d: "Share your business details — an EIN or contractor license — and the sales team sets up your profile." },
    { t: "Plan the order", d: "Send your layout and cabinet list; your account manager helps check selections and quantities." },
    { t: "Order & deliver", d: "Order by Excel form, portal or 2020 SKU list; pick up in Phoenix or have it delivered to the job." },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Wholesale kitchen and bath cabinets — ${place}${isCity ? `, ${area.stateName}` : ""}`,
    serviceType: "Wholesale kitchen and bathroom cabinetry",
    provider: { "@type": "Organization", name: "Highland Cabinetry" },
    areaServed: isCity ? { "@type": "City", name: `${area.cityName}, ${area.stateName}` } : { "@type": "State", name: area.stateName },
  };

  return (
    <>
      <div className="container">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageIntro
        eyebrow={isCity ? `Service area · ${area.stateName}` : "Service area"}
        title={
          <>
            Wholesale kitchen &amp; bathroom cabinets <em>for {place} contractors.</em>
          </>
        }
        aside={<Media id={sceneFor(area.path)} sizes="(max-width: 900px) 100vw, 40vw" priority />}
      >
        <p className="lead">
          {isArizona
            ? `Highland’s showroom and warehouse are in Phoenix. Trade customers in ${place} can pick up at the warehouse or have orders delivered.`
            : `Highland supplies builders, contractors, remodelers and dealers in ${place} from its showroom and warehouse in Phoenix, Arizona — by delivery and freight, confirmed for each order.`}
        </p>
        <div className={styles.ctas}>
          <QuoteButton source={`service-area${area.path.replace("/wholesale-cabinets", "").replace(/\/$/, "").replace(/\//g, "-")}`} arrow={false}>
            Request a quote
          </QuoteButton>
          <a href={telHref(contact.phone.value)} className="btn btn--ghost">
            Call {contact.phone.value}
          </a>
        </div>
      </PageIntro>

      {!indexingEnabled && (area.issues.length > 0 || area.removedClaims.length > 0) ? (
        <aside className={`container ${styles.review}`} aria-label="Migration review note (preview only)">
          <p className={styles.reviewTitle}>Preview only · migration review</p>
          {area.issues.length ? <p>Flagged: {area.issues.join("; ")}.</p> : null}
          {area.removedClaims.length ? <p>Not carried over from the previous page: {area.removedClaims.join(", ")}.</p> : null}
        </aside>
      ) : null}

      <section className="section" aria-labelledby="area-serve">
        <div className={`container ${styles.grid}`}>
          <div>
            <h2 id="area-serve" className={styles.h2}>
              {isCity ? `${place} and nearby` : `Serving ${place}`}
            </h2>
            <p className={styles.text}>
              {isCity
                ? `Highland’s previous site listed these communities around ${place} as areas served. Tell us where the job is and the sales team will confirm delivery.`
                : `Cities and areas Highland’s previous site listed in ${place}. Delivery method and timing are confirmed for each order.`}
            </p>
            {cities.length ? (
              <ul className={styles.cityLinks}>
                {cities.map((c) => (
                  <li key={c.path}>
                    <Link href={c.path}>
                      {c.cityName} <ArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {area.areas.length ? (
              <ul className={styles.chips} aria-label={`Areas listed around ${place}`}>
                {area.areas.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className={styles.facts}>
            <h2 className={styles.h3}>How ordering works</h2>
            <dl>
              <div>
                <dt>Your contact</dt>
                <dd>A dedicated account manager for every trade account.</dd>
              </div>
              <div>
                <dt>Same-day processing</dt>
                <dd>{orderPolicy.cutoff.value}.</dd>
              </div>
              <div>
                <dt>Ordering</dt>
                <dd>{orderPolicy.orderMethods.value.join(", ")}. Orders aren’t taken by phone.</dd>
              </div>
              <div>
                <dt>Delivery options</dt>
                <dd>{orderPolicy.deliveryOptions.value.join("; ")}.</dd>
              </div>
              <div>
                <dt>Showroom &amp; warehouse</dt>
                <dd>
                  {phoenixLocation.street}, {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}. Pickup{" "}
                  {phoenixLocation.pickupHours.value}.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className={`section ${styles.lines}`} aria-labelledby="area-trade">
        <div className={`container ${styles.grid}`}>
          <div>
            <h2 id="area-trade" className={styles.h2}>
              We serve {place} trade professionals
            </h2>
            <p className={styles.text}>
              Highland Cabinetry is a wholesale supplier: trade pricing is for businesses with an EIN or contractor license.{" "}
              <Link href="/wholesale-cabinets-for-contractors/">How trade accounts work</Link>.
            </p>
            <ul className={styles.chips}>
              {audiences.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={styles.h3}>How it works</h2>
            <ol className={styles.steps}>
              {steps.map((s) => (
                <li key={s.t}>
                  <strong>{s.t}.</strong> {s.d}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`section ${styles.lines}`} aria-labelledby="area-lines">
        <div className="container">
          <h2 id="area-lines" className={styles.h2}>
            RTA cabinet styles for every project
          </h2>
          <p className={styles.text}>
            Three lines and thirteen finishes, ready to assemble or assembled. Browse the <Link href="/products/">collections</Link> or download the{" "}
            {catalogs.map((c, i) => (
              <span key={c.id}>
                <a href={c.href}>{c.title}</a>
                {i < catalogs.length - 1 ? " and " : ""}
              </span>
            ))}
            .
          </p>
          <div className={styles.lineGrid}>
            {lineOrder.map((l) => (
              <div key={l} className={styles.line}>
                <h3 className={styles.lineName}>
                  {lines[l].name} <span>{lines[l].construction}</span>
                </h3>
                <ul>
                  {finishes
                    .filter((f) => f.line === l)
                    .map((f) => (
                      <li key={f.id}>
                        <Link href={f.path}>{f.name}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section--tight ${styles.lines}`} aria-labelledby="area-large">
        <div className={`container ${styles.grid}`}>
          <div>
            <h2 id="area-large" className={styles.h3}>
              Large projects &amp; multi-unit developments
            </h2>
            <p className={styles.text}>
              Building many kitchens in {place}? Highland supplies builders and developers with one consistent specification, one account manager and
              delivery scheduled to the job. <Link href="/wholesalers-large-scale-projects/">Wholesale &amp; large-scale projects</Link> ·{" "}
              <Link href="/contact-us/">Contact the sales team</Link>
            </p>
          </div>
          <div />
        </div>
      </section>

      <section className="section--tight" aria-labelledby="area-faq">
        <div className="container">
          <h2 id="area-faq" className={styles.h3}>
            Questions from {place} contractors
          </h2>
          <dl className={styles.faq}>
            {faq.map((x) => (
              <div key={x.q}>
                <dt>{x.q}</dt>
                <dd>{x.a}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.small}>
            {nearby.length ? (
              <>
                Also in {area.stateName}:{" "}
                {nearby.map((c, i) => (
                  <span key={c.path}>
                    <Link href={c.path}>{c.cityName}</Link>
                    {i < nearby.length - 1 ? ", " : ". "}
                  </span>
                ))}
              </>
            ) : null}
            <Link href={`/wholesale-cabinets/${area.state}/`}>{area.stateName} service area</Link> ·{" "}
            <Link href="/wholesale-cabinets/">View all service locations</Link>
          </p>
        </div>
      </section>

      {area.facilities.length ? (
        <section className="section--tight" aria-labelledby="area-offices">
          <div className="container">
            <h2 id="area-offices" className={styles.h3}>
              {place} city facilities and services
            </h2>
            <ul className={styles.offices}>
              {area.facilities.map((f) => (
                <li key={f.name}>
                  <p className={styles.officeName}>{f.name}</p>
                  <p className={styles.officeDetail}>{f.detail}</p>
                </li>
              ))}
            </ul>
            <p className={styles.small}>Listed for convenience from Highland’s previous page; confirm hours and details with each office.</p>
          </div>
        </section>
      ) : null}

      <ClosingCta source={`service-area-closing`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema)} />
    </>
  );
}
