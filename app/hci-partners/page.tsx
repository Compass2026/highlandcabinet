import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContentBody } from "@/components/content/ContentPage";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Highland Cabinetry Partners",
  description: "Companies Highland Cabinetry works with, including Interior Logic Group (ILG).",
  path: "/hci-partners/",
});

export default function PartnersPage() {
  const logo = media("mark-ilg");
  return (
    <>
      <PageIntro eyebrow="Partners" title="Highland Cabinetry partners" />
      <ContentBody review="Restored from the previous site. Highland should confirm the ILG relationship and how it may be described.">
        <Link href="/hci-partners/interior-logic-group-ilg/" style={{ display: "flex", alignItems: "center", gap: "1.5rem", textDecoration: "none" }}>
          <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} style={{ width: 180, height: "auto" }} />
          <span>
            <strong>Interior Logic Group (ILG)</strong>
            <br />
            Interior design and finish solutions for builders across the United States.
          </span>
        </Link>
      </ContentBody>
    </>
  );
}
