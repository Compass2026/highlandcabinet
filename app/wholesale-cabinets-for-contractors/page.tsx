import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { SampleCard } from "@/components/ui/SampleCard";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ClosingCta, TradeProcess } from "@/components/home/Sections";
import { finishById } from "@/content/collections";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Wholesale Cabinets for Contractors, Builders & Remodelers",
  description:
    "Trade accounts for contractors, builders, remodelers, flippers and dealers: wholesale Shaker, Nano and Euro cabinets with a dedicated account manager.",
  path: "/wholesale-cabinets-for-contractors/",
  image: "/media/project-white-shaker-04.jpg",
});

const includes = [
  { t: "A dedicated account manager", d: "One point of contact who manages current orders, answers questions and helps plan upcoming projects." },
  { t: "Ordering that fits your workflow", d: "Submit orders by Excel order form, through the customer portal, or as 2020 SKU lists." },
  { t: "Design-software files", d: "A version of the catalog compatible with 2020 Design is available on request." },
  { t: "Layout and design help", d: "Send a floor plan and Highland's team can help with layouts and renderings for your clients." },
];

const audiences = ["General contractors", "Builders & developers", "Remodelers", "Flippers & real-estate investors", "Handymen & installers", "Restoration companies", "Cabinet dealers & suppliers", "Multifamily"];

export default function ContractorsPage() {
  const top = ["shaker-white", "shaker-grey", "shaker-modern-slate", "shaker-onyx-black", "shaker-signature-blue", "shaker-luxe"].map((id) => finishById(id)!);
  return (
    <>
      <PageIntro
        eyebrow="For the trade"
        title={<>Wholesale cabinetry for <em>the people who build.</em></>}
        aside={<Media id="project-white-shaker-05" sizes="(max-width: 900px) 100vw, 40vw" caption="White Shaker uppers and hood surround" />}
      >
        <p className="lead">
          Highland supplies contractors, builders, remodelers, investors and dealers with Shaker, Nano and Euro cabinets — and assigns every
          trade account a dedicated account manager.
        </p>
        <div className={styles.ctas}>
          <QuoteButton source="contractors-intro" />
        </div>
      </PageIntro>

      <section className="section" aria-labelledby="includes-title">
        <div className={`container ${styles.grid}`}>
          <div>
            <p className="label eyebrow">Trade accounts</p>
            <h2 id="includes-title" className={styles.h2}>
              What an account includes.
            </h2>
            <p className={styles.small}>Trade accounts are for businesses with an EIN or ROC license.</p>
          </div>
          <dl className={styles.includes}>
            {includes.map((i, n) => (
              <div key={i.t}>
                <dt>
                  <span className="label">{String(n + 1).padStart(2, "0")}</span> {i.t}
                </dt>
                <dd>{i.d}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={`container ${styles.who}`}>
          <p className="label muted">Who we supply</p>
          <ul>
            {audiences.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <TradeProcess />

      <section className="section" aria-labelledby="styles-title">
        <div className="container">
          <p className="label eyebrow">Six finishes</p>
          <h2 id="styles-title" className={styles.h2}>
            The Shaker line.
          </h2>
          <ul className={styles.cards}>
            {top.map((f) => (
              <SampleCard key={f.id} finish={f} href={f.path} as="li" headingLevel="h3" />
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta source="contractors-closing" />
    </>
  );
}
