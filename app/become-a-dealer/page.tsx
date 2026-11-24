import { queryOf } from "@/lib/params";
import { FormPage } from "@/components/quote/FormPage";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { pageMetadata } from "@/lib/seo";
import styles from "../forms.module.css";

export const metadata = pageMetadata({
  title: "Become a Cabinet Dealer",
  description: "Carry Highland Cabinetry's Shaker, Nano and Euro lines. Apply to become a dealer — homebuilders, contractors and suppliers welcome.",
  path: "/become-a-dealer/",
});

export default async function DealerPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await queryOf(searchParams);
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Become a Dealer", href: "/become-a-dealer/" }]}
        aside={<Media id="scene-euro-glacial-white" sizes="(max-width: 900px) 100vw, 40vw" caption="Euro Glacial White" />} eyebrow="Dealers & suppliers" title={<>Become a <em>Highland dealer.</em></>}>
        <p className="lead">
          Whether you&rsquo;re a homebuilder, a contractor bidding a project, or a supplier expanding your inventory, tell us about your business
          and our team will be in touch to talk through the program.
        </p>
      </PageIntro>
      <FormPage
        variant="dealer-application"
        source="become-a-dealer"
        path="/become-a-dealer/"
        status={status}
        side={
          <div className={styles.notes}>
            <h2 className={styles.h2}>What dealers get</h2>
            <ul className={styles.list}>
              <li>Three lines — Shaker, Nano and Euro — in thirteen finishes</li>
              <li>A dedicated account manager</li>
              <li>Ordering by Excel form, customer portal or 2020 SKU list</li>
              <li>A 2020 Design-compatible catalog on request</li>
            </ul>
            <p className={styles.small}>Dealer terms and pricing are discussed directly with Highland&rsquo;s sales team.</p>
          </div>
        }
      />
    </>
  );
}
