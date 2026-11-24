import { queryOf } from "@/lib/params";
import Link from "next/link";
import { FormPage } from "@/components/quote/FormPage";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { pageMetadata } from "@/lib/seo";
import styles from "../forms.module.css";

export const metadata = pageMetadata({
  title: "Find a Cabinet Dealer Near You",
  description: "Planning a kitchen or bath with Highland cabinets? Tell us where your project is and we'll help you find a dealer.",
  path: "/find-a-dealer/",
});

export default async function FindDealerPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await queryOf(searchParams);
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Find a Dealer", href: "/find-a-dealer/" }]}
        aside={<Media id="scene-nano-white" sizes="(max-width: 900px) 100vw, 40vw" caption="Nano White" />} eyebrow="Homeowners" title={<>Find a dealer <em>near you.</em></>}>
        <p className="lead">
          Highland supplies cabinetry through the trade. Tell us where your project is and what you&rsquo;re planning, and our team will help
          connect you with a dealer who can design, price and install it.
        </p>
      </PageIntro>
      <FormPage
        variant="dealer-referral"
        source="find-a-dealer"
        path="/find-a-dealer/"
        status={status}
        side={
          <div className={styles.notes}>
            <h2 className={styles.h2}>Before you start</h2>
            <p className={styles.small}>
              Browse the <Link href="/products/">collections</Link> and note the finishes you like — it helps us match you with the right dealer.
            </p>
            <p className={styles.small}>
              Are you a contractor? <Link href="/request-a-quote/">Request trade pricing</Link> instead.
            </p>
          </div>
        }
      />
    </>
  );
}
