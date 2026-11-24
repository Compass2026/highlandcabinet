import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { ContentBody } from "@/components/content/ContentPage";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { ClosingCta } from "@/components/home/Sections";
import { orderPolicy, phoenixLocation } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cabinetry for Wholesalers & Large-Scale Projects",
  description:
    "Shaker, Nano and Euro cabinets for wholesalers, distributors, developers and contractors running multi-unit and multi-site projects — with a dedicated account manager and same-day processing.",
  path: "/wholesalers-large-scale-projects/",
  image: "/media/scene-euro-glacial-white.jpg",
});

export default function LargeScalePage() {
  return (
    <>
      <PageIntro
        eyebrow="Wholesale & large-scale projects"
        title={<>Cabinetry for wholesalers <em>and large-scale projects.</em></>}
        aside={<Media id="scene-euro-glacial-white" sizes="(max-width: 900px) 100vw, 40vw" priority />}
      >
        <p className="lead">
          Highland supplies Shaker, Nano and Euro cabinets to distributors, developers and contractors running repeat, multi-unit and
          multi-site work — from its showroom and warehouse in {phoenixLocation.locality}, Arizona.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <QuoteButton source="large-scale-projects" arrow={false}>
            Talk to the sales team
          </QuoteButton>
        </div>
      </PageIntro>
      <ContentBody review="Rebuilt from the previous page. Not carried over until Highland documents them: “25,000 kitchens” monthly capacity, “15+ years experience” (conflicts with the 2018 founding), distribution hubs in Texas, Utah, New Mexico and California (only Phoenix is documented), “rigorous industry certifications” and “preferred manufacturing partner”.">
        <h2>Who this is for</h2>
        <ul>
          <li>Cabinet wholesalers and distributors</li>
          <li>Commercial supply partners</li>
          <li>Large-scale contractors and developers</li>
          <li>Multi-unit and multi-location projects</li>
        </ul>
        <p>
          Homeowners planning a single kitchen are better served by a <Link href="/find-a-dealer/">Highland dealer</Link>.
        </p>
        <h2>The problems large projects run into</h2>
        <ul>
          <li><strong>Inconsistent quality</strong> across vendors leads to call-backs and frustrated clients.</li>
          <li><strong>Long lead times</strong> delay schedules and eat margin on large jobs.</li>
          <li><strong>Limited capacity</strong> for multi-site orders restricts how far you can scale.</li>
          <li><strong>Poor communication</strong> between suppliers and field teams causes installation delays.</li>
          <li><strong>Retail-first vendors</strong> lack the systems to support repeat B2B ordering.</li>
        </ul>
        <h2>What Highland brings to a program</h2>
        <ul>
          <li><strong>One account manager</strong> who knows your projects and handles orders, questions and planning ahead.</li>
          <li><strong>Repeatable ordering</strong> by {orderPolicy.orderMethods.value.join(", ")} — plus a 2020 Design-compatible catalog on request.</li>
          <li><strong>Same-day processing</strong> for orders in by {orderPolicy.cutoff.value.replace(" for same-day processing", "")}.</li>
          <li><strong>Delivery to suit the job:</strong> {orderPolicy.deliveryOptions.value.join("; ").toLowerCase()}.</li>
          <li><strong>One consistent specification</strong> across three lines and thirteen finishes — Shaker and Nano on a cabinet-grade plywood box, Euro on a ¾″ furniture-board case. <Link href="/products/">See the collections</Link>.</li>
        </ul>
        <h2>What to expect when you reach out</h2>
        <ol>
          <li><strong>Share requirements</strong> — the program, project or wholesale volume you’re planning.</li>
          <li><strong>Speak with the sales team</strong> about lines, finishes and logistics.</li>
          <li><strong>Evaluate fit</strong> — scope, delivery and timing.</li>
          <li><strong>Align on next steps</strong> for pricing or partnership.</li>
        </ol>
      </ContentBody>
      <ClosingCta source="large-scale-projects-closing" />
    </>
  );
}
