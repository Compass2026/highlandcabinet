import { FormPage } from "@/components/quote/FormPage";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { phoenixLocation } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "../forms.module.css";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: "Contact Highland Cabinetry's sales team in Phoenix, Arizona — trade quotes, dealer enquiries and product questions.",
  path: "/contact-us/",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return (
    <>
      <PageIntro
        aside={<Media id="scene-euro-stone-grey" sizes="(max-width: 900px) 100vw, 40vw" caption="Euro Stone Grey" />} eyebrow="Contact" title={<>Talk to the <em>Highland team.</em></>}>
        <p className="lead">Questions about products, orders or becoming a customer — send a note and the right person will reply.</p>
      </PageIntro>
      <FormPage
        variant="contact"
        source="contact-us"
        path="/contact-us/"
        status={status}
        side={
          <div className={styles.notes}>
            <h2 className={styles.h2}>{phoenixLocation.name}</h2>
            <address className={styles.small} style={{ fontStyle: "normal", color: "var(--graphite)" }}>
              {phoenixLocation.street}
              <br />
              {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}
            </address>
            <p className={styles.small}>Warehouse pickup: {phoenixLocation.pickupHours.value}</p>
          </div>
        }
      />
    </>
  );
}
