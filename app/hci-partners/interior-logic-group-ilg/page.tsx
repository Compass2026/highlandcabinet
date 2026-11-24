import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContentBody } from "@/components/content/ContentPage";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Interior Logic Group (ILG) — Highland Cabinetry Partner",
  description: "About Interior Logic Group (ILG), interior design and finish solutions for builders, and a Highland Cabinetry partner.",
  path: "/hci-partners/interior-logic-group-ilg/",
});

export default function IlgPage() {
  const logo = media("mark-ilg");
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Partners", href: "/hci-partners/" }, { label: "Interior Logic Group (ILG)", href: "/hci-partners/interior-logic-group-ilg/" }]} eyebrow="Partners" title="Interior Logic Group (ILG)" />
      <ContentBody review="Restored from the previous site. Not carried over: the “Highland Cabinetry’s Partners” logo wall (CFM, DnR, Lowe’s, Primera, Sibi) and a customer quote about ILG — neither is documented. Confirm the ILG relationship and wording with Highland.">
        <p>
          <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} style={{ width: 220, height: "auto" }} />
        </p>
        <p>
          Interior Logic Group (ILG) has established itself as a leader in interior home design and finish solutions for the building industry.
          Since its founding in 2013, ILG has changed the way builders and homeowners approach interior design, offering a technology-driven
          experience across the selection process.
        </p>
        <p>
          ILG focuses on high-value interior finishes — flooring, countertops, cabinets and window coverings — and on bringing technology into
          home design and selection, from supply chain management to installation services.
        </p>
        <p>
          Operating across the United States, ILG serves single-family homes, multifamily developments, senior housing and student housing
          communities.
        </p>
        <p>
          <Link href="/hci-partners/">All partners</Link> · <Link href="/wholesale-cabinets-for-contractors/">Wholesale cabinets for builders</Link>
        </p>
      </ContentBody>
    </>
  );
}
