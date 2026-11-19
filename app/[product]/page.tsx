import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { finishByPath, finishes, finishesByLine, lineOrder, lines, slugOf } from "@/content/collections";
import { catalogs, orderPolicy, siteUrl } from "@/content/site";
import { media } from "@/lib/media";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Gallery } from "@/components/product/Gallery";
import { SpecSheet } from "@/components/product/SpecSheet";
import { SampleCard } from "@/components/ui/SampleCard";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Construction } from "@/components/home/Construction";
import { ClosingCta } from "@/components/home/Sections";
import { ArrowRight, Download } from "@/components/ui/icons";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return finishes.map((f) => ({ product: slugOf(f) }));
}

type Params = { params: Promise<{ product: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const f = finishByPath((await params).product);
  if (!f) return {};
  const line = lines[f.line];
  return pageMetadata({
    title: `Wholesale ${f.name} ${line.name === "Shaker" && !f.name.includes("Shaker") ? "Shaker " : ""}Cabinets`,
    description: `${f.name} ${line.name.toLowerCase()} cabinets from Highland Cabinetry: ${f.finishType.toLowerCase()} finish, ${line.construction.toLowerCase()} construction. Specifications, catalog and trade quotes.`,
    path: f.path,
    image: media(f.media.scene).src,
  });
}

export default async function ProductPage({ params }: Params) {
  const f = finishByPath((await params).product);
  if (!f) notFound();
  const line = lines[f.line];
  const catalog = catalogs.find((c) => c.id === line.catalog)!;
  const galleryIds = f.gallery ?? [f.media.scene, f.media.render];
  const siblings = finishesByLine(f.line).filter((x) => x.id !== f.id);
  const otherLines = lineOrder.filter((l) => l !== f.line);
  const chip = media(f.media.chip);
  const render = media(f.media.render);
  const catalogHref = f.catalogPage ? `${catalog.href}#page=${f.catalogPage}` : catalog.href;
  const fullName = `${f.name}${f.line === "shaker" && !f.name.includes("Shaker") ? " Shaker" : ""}`;

  const keyFacts =
    f.line === "euro"
      ? [
          { k: "Finish", v: f.finishType },
          { k: "Construction", v: "Frameless, ¾″ engineered furniture-board case" },
          { k: "Hardware", v: "Soft-close hinges and drawers" },
          { k: "Drawers", v: "Metal drawer box" },
        ]
      : [
          { k: "Finish", v: f.finishType },
          { k: "Doors", v: f.line === "nano" ? "Flat panel, ¾″ full overlay" : "Recessed Shaker panel, ¾″ full overlay" },
          { k: "Box", v: "Cabinet-grade plywood, L-bracket reinforced bases" },
          { k: "Drawers", v: "Dovetail, ½″ solid wood sides, soft-close glides" },
        ];

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${fullName} Cabinets`,
    brand: { "@type": "Brand", name: "Highland Cabinetry" },
    category: `${line.name} kitchen cabinets`,
    description: f.description,
    image: galleryIds.slice(0, 4).map((id) => `${siteUrl}${media(id).src}`),
    url: `${siteUrl}${f.path}`,
    additionalProperty: keyFacts.map((x) => ({ "@type": "PropertyValue", name: x.k, value: x.v })),
  };

  return (
    <>
      <div className={`container ${styles.crumbs}`}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/products/" },
            { label: line.name, href: `/products/#line-${line.id}` },
            { label: f.name, href: f.path },
          ]}
        />
      </div>

      <section className={`container ${styles.top}`} aria-labelledby="product-title">
        <div className={styles.galleryCol}>
          <Gallery ids={galleryIds} label={`${fullName} images`} />
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <span className={styles.hole} aria-hidden="true" />
            <p className={styles.code}>
              <span className="code">{f.code}</span> {line.name} line · {line.construction}
            </p>
            <h1 id="product-title" className={styles.h1}>
              {fullName} <span>Cabinets</span>
            </h1>
            <p className={styles.desc}>{f.description}</p>
            <dl className={styles.facts}>
              {keyFacts.map((x) => (
                <div key={x.k}>
                  <dt className="label">{x.k}</dt>
                  <dd>{x.v}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.actions}>
              <QuoteButton finishId={f.id} source={`product:${f.id}`} className="btn">
                Request a quote for {f.name}
              </QuoteButton>
              <a href={catalogHref} className="btn btn--ghost">
                <Download /> {catalog.title}
              </a>
            </div>
            <p className={styles.trade}>
              Pricing is available to trade accounts and through dealers.{" "}
              <Link href="/find-a-dealer/">Homeowners: find a dealer</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.closeup}`} aria-labelledby="closeup-title">
        <div className={`container ${styles.closeupGrid}`}>
          <div className={styles.closeupText}>
            <p className="label eyebrow">Up close</p>
            <h2 id="closeup-title" className={styles.h2}>
              The finish, at the reveal.
            </h2>
            <p className="lead">
              {f.line === "shaker"
                ? "Where the drawer front meets the door: the shadow gap, the square edge of the frame, and the step down into the recessed panel."
                : f.line === "nano"
                  ? "Where the drawer front meets the door: the shadow gap and the flat, painted face of the Nano panel."
                  : "Where the drawer front meets the door on a frameless cabinet: a tight reveal and an uninterrupted slab face."}
            </p>
            <p className={styles.small}>
              Both images are Highland product renderings of the B21 base cabinet (base, 21″ wide). The close-up is cropped from the same
              rendering; colour has not been altered. Real wood and painted finishes vary with lighting.
            </p>
          </div>
          <figure className={styles.chipFig}>
            <div className={styles.chipFrame}>
              <Image src={chip.src} alt={`Close-up of the ${f.name} finish at the reveal between drawer and door`} width={chip.width} height={chip.height} sizes="(max-width: 900px) 70vw, 30vw" />
            </div>
            <figcaption className="label muted">Detail · {f.name}</figcaption>
          </figure>
          <figure className={styles.renderFig}>
            <Image src={render.src} alt={render.alt} width={render.width} height={render.height} sizes="(max-width: 900px) 60vw, 22vw" />
            <figcaption>
              <span className="label">B21</span> One drawer over one door
            </figcaption>
          </figure>
        </div>
      </section>

      {f.line !== "euro" ? (
        <section className="section on-linen" aria-labelledby="construction">
          <div className="container">
            <Construction
              title="Specifications & construction."
              intro={`${fullName} shares the construction of every Shaker and Nano cabinet, as specified in Highland's catalog. Select a feature to find it on the drawing.`}
              source={line.specSource}
            />
          </div>
        </section>
      ) : (
        <section className="section on-linen" aria-labelledby="specs-title">
          <div className={`container ${styles.euroSpec}`}>
            <SpecSheet line={line} headingId="specs-title" extraRows={[{ label: "Finish type", value: f.finishType }]} />
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="downloads-title">
        <div className={`container ${styles.specGrid}`}>
          <div className={styles.downloads}>
            <p className="label eyebrow">Downloads</p>
            <h2 id="downloads-title" className={styles.h3}>
              Catalog &amp; sizes
            </h2>
            <a href={catalogHref} className={styles.download}>
              <span className={styles.spine} aria-hidden="true" />
              <span className={styles.dlBody}>
                <span className="label muted">{catalog.edition}</span>
                <span className={styles.dlTitle}>{catalog.title}</span>
                <span className={styles.dlMeta}>
                  {f.catalogPage ? `Opens at the ${f.name} page (p. ${f.catalogPage}) · ` : ""}
                  {catalog.pages} pages · {catalog.sizeLabel}
                </span>
              </span>
              <Download />
            </a>
            <p className={styles.small}>
              Every cabinet size and accessory available in {line.name} finishes, with nomenclature — for example, W361824 is a wall cabinet
              36″ wide, 18″ high and 24″ deep.
            </p>
          </div>
          <div className={`${styles.ordering} marks`}>
            <span className="marks__b" aria-hidden="true" />
            <p className="label muted">Ordering · from the June 2025 catalogs</p>
            <dl>
              <div>
                <dt className="label">Same-day cut-off</dt>
                <dd>{orderPolicy.cutoff.value}</dd>
              </div>
              <div>
                <dt className="label">How to order</dt>
                <dd>{orderPolicy.orderMethods.value.join(", ")}</dd>
              </div>
              <div>
                <dt className="label">Delivery</dt>
                <dd>{orderPolicy.deliveryOptions.value.join(" · ")}</dd>
              </div>
            </dl>
            <QuoteButton finishId={f.id} source={`product-ordering:${f.id}`} className="link-arrow">
              Quote a {f.name} project
            </QuoteButton>
          </div>
        </div>
      </section>

      <section className="section on-linen" aria-labelledby="related-title">
        <div className="container">
          <div className={styles.relatedHead}>
            <h2 id="related-title" className={styles.h2}>
              More from the {line.name} line
            </h2>
            <Link href="/products/" className="link-arrow">
              All collections <ArrowRight />
            </Link>
          </div>
          <ul className={styles.related}>
            {siblings.map((s) => (
              <SampleCard key={s.id} finish={s} href={s.path} as="li" headingLevel="h3" />
            ))}
          </ul>
          <p className={styles.otherLines}>
            Also from Highland:{" "}
            {otherLines.map((l, i) => (
              <span key={l}>
                <Link href={`/products/#line-${l}`}>{lines[l].name}</Link> ({lines[l].short.replace(/\.$/, "")})
                {i < otherLines.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <ClosingCta finishId={f.id} source={`product-closing:${f.id}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(product)} />
    </>
  );
}
