import { FormPage } from "@/components/quote/FormPage";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { finishById } from "@/content/collections";
import { orderPolicy } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "../forms.module.css";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description: "Request trade pricing on Highland Shaker, Nano and Euro cabinetry. Tell us the collection, the project and where it is.",
  path: "/request-a-quote/",
});

type Props = { searchParams: Promise<{ finish?: string; status?: string; from?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const { finish, status, from } = await searchParams;
  const f = finish ? finishById(finish) : undefined;
  return (
    <>
      <PageIntro
        aside={<Media id="scene-euro-frost-white" sizes="(max-width: 900px) 100vw, 40vw" caption="Euro Frost White" />} eyebrow="Trade pricing" title={<>Request a quote{f ? <> for <em>{f.name}</em></> : null}</>}>
        <p className="lead">
          Share what you&rsquo;re building and a member of Highland&rsquo;s sales team will follow up with pricing and availability. Trade
          accounts are set up for businesses with an EIN or ROC license.
        </p>
      </PageIntro>
      <FormPage
        variant="quote"
        source={from ? `page:${from}` : "quote-page"}
        path="/request-a-quote/"
        status={status}
        finishId={f?.id}
        side={
          <div className={styles.notes}>
            <h2 className={styles.h2}>What happens next</h2>
            <ol className={styles.steps}>
              <li>Sales reviews your request and the collection you picked.</li>
              <li>We confirm sizes, quantities and delivery for your location.</li>
              <li>You get pricing — and, for new customers, an account manager.</li>
            </ol>
            <p className={styles.small}>Orders placed by {orderPolicy.cutoff.value.split(",")[0]} are processed the same business day.</p>
          </div>
        }
      />
    </>
  );
}
