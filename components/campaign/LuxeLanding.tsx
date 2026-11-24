import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { SampleCard } from "@/components/ui/SampleCard";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { TradeProcess } from "@/components/home/Sections";
import { finishById, finishes, lines } from "@/content/collections";
import { catalogs, telHref } from "@/content/site";
import type { Campaign } from "@/content/campaigns";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";
import { ArrowRight, Phone } from "@/components/ui/icons";
import styles from "./LuxeLanding.module.css";

const luxe = finishById("shaker-luxe")!;

export const luxeMetadata = (c: Campaign) =>
  pageMetadata({
    title: `Luxe Shaker ${c.region}`,
    description: `Luxe Shaker — the stained finish in Highland Cabinetry's Shaker line. Call ${c.phone} or request a trade quote.`,
    path: c.path,
    image: media(luxe.media.scene).src,
    noindex: true,
  });

/**
 * Campaign landing page for Luxe Shaker. Kept at the previous URL with that page's own call-tracking
 * number, so calls from each regional campaign stay attributed. Not indexed (as before) and not in the sitemap.
 */
export function LuxeLanding({ campaign }: { campaign: Campaign }) {
  const source = `campaign-${campaign.path.replace(/\//g, "")}`;
  const others = finishes.filter((f) => f.line === "shaker" && f.id !== luxe.id);
  const call = (
    <a className={styles.call} href={telHref(campaign.phone)}>
      <Phone aria-hidden="true" /> {campaign.phone}
    </a>
  );
  return (
    <>
      <PageIntro
        eyebrow="Introducing Luxe Shaker"
        title={<>Luxe Shaker. <em>Timeless warmth, modern strength.</em></>}
        aside={<Media id={luxe.media.scene} sizes="(max-width: 900px) 100vw, 45vw" priority caption="Luxe Shaker" />}
      >
        <p className="lead">
          Luxe is the stained finish in Highland&rsquo;s Shaker line: a warm wood tone that keeps the natural grain visible, on the same
          construction as every Shaker cabinet.
        </p>
        <div className={styles.ctas}>
          <QuoteButton finishId={luxe.id} source={source} />
          <Link className="btn btn--ghost" href={luxe.path}>
            View Luxe Shaker <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <p className={styles.callLine}>Call the Highland team: {call}</p>
      </PageIntro>

      <section className="section" aria-labelledby="why-luxe">
        <div className={`container ${styles.why}`}>
          <div>
            <p className="label eyebrow">Why Luxe</p>
            <h2 id="why-luxe" className={styles.h2}>
              Warm wood tone, built on the Shaker box.
            </h2>
          </div>
          <ul className={styles.points}>
            <li>
              <strong>The grain stays visible.</strong> {luxe.description}
            </li>
            <li>
              <strong>Works with light, dark or bold interiors.</strong> A warm wood tone that pairs with the painted Shaker finishes and with stone,
              quartz or wood counters.
            </li>
            <li>
              <strong>{lines.shaker.name} construction.</strong> {lines.shaker.summary}
            </li>
            <li>
              <strong>For homes, rentals and larger builds.</strong> Ordered through a trade account, with an account manager for each
              contractor, builder or dealer.
            </li>
          </ul>
        </div>
      </section>

      <TradeProcess />

      <section className="section" aria-labelledby="more-shaker">
        <div className="container">
          <p className="label eyebrow">Also in the Shaker line</p>
          <h2 id="more-shaker" className={styles.h2}>
            Five more Shaker finishes.
          </h2>
          <ul className={styles.cards}>
            {others.map((f) => (
              <SampleCard key={f.id} finish={f} href={f.path} as="li" headingLevel="h3" />
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="luxe-next">
        <div className={`container ${styles.next}`}>
          <h2 id="luxe-next" className={styles.h2}>
            Request a sample, find a dealer, or build with Luxe.
          </h2>
          <div className={styles.ctas}>
            <QuoteButton finishId={luxe.id} source={`${source}-closing`} />
            <Link className="btn btn--ghost" href="/find-a-dealer/">
              Find a dealer
            </Link>
            <a className="btn btn--ghost" href={catalogs.find((c) => c.id === lines.shaker.catalog)?.href ?? "/products/"}>
              Shaker &amp; Nano catalog (PDF)
            </a>
          </div>
          <p className={styles.callLine}>Or call {call}</p>
        </div>
      </section>
    </>
  );
}
