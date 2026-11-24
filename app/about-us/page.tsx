import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { ContentBody } from "@/components/content/ContentPage";
import { Quality } from "@/components/home/Quality";
import { Affiliations, LocationSection } from "@/components/home/Showroom";
import { ClosingCta } from "@/components/home/Sections";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Highland Cabinetry",
  description:
    "Highland Cabinetry supplies Shaker, Nano and Euro kitchen and bath cabinets to builders, contractors, remodelers, investors and dealers from its showroom and warehouse in Phoenix, Arizona.",
  path: "/about-us/",
  image: "/media/scene-euro-stone-grey.jpg",
});

export default function AboutPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ label: "About", href: "/about-us/" }]}
        eyebrow="About Highland"
        title={<>Cabinetry for <em>the people who build.</em></>}
        aside={<Media id="scene-euro-stone-grey" sizes="(max-width: 900px) 100vw, 40vw" priority />}
      >
        <p className="lead">
          Highland Cabinetry supplies kitchen and bath cabinets — Shaker, Nano and Euro, in thirteen finishes — to builders, contractors,
          remodelers, investors and dealers, from its showroom and warehouse in Phoenix, Arizona.
        </p>
      </PageIntro>
      <ContentBody review="Rewritten from the previous About page. Not carried over until Highland confirms them: founding year (“2018”) vs “over ten years of experience”, “manufactured in Vietnam”, delivery in “3–5 days” and “4 days”, “largest in-stock Shaker inventory in Arizona”, “all-wood”, reviews widget and partner logos.">
        <p>
          Highland started after seeing demand from contractors, dealers, flippers and handymen across the country for good-quality
          ready-to-assemble cabinets they could get quickly and install easily. That is still who we build for: people who put kitchens and
          baths in for a living and need the cabinets to arrive complete, accurate and on time.
        </p>
        <p>
          Every trade account works with a dedicated account manager. Orders come in by Excel order form, customer portal or 2020 SKU list,
          orders placed by 3 PM Arizona time are processed the same business day, and cabinets go out by pickup, Highland’s own truck or
          freight carrier — with white-glove delivery in select markets.
        </p>
        <p>
          See the <Link href="/products/">collections</Link>, the <Link href="/gallery-of-highland-cabinets/">gallery</Link>, or how{" "}
          <Link href="/wholesale-cabinets-for-contractors/">trade accounts</Link> and <Link href="/become-a-dealer/">dealerships</Link> work.
        </p>
      </ContentBody>
      <Affiliations />
      <Quality />
      <LocationSection />
      <ClosingCta source="about" />
    </>
  );
}
