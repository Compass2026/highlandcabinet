import { LuxeLanding, luxeMetadata } from "@/components/campaign/LuxeLanding";
import { campaignByPath } from "@/content/campaigns";

const campaign = campaignByPath("/new-luxe-shaker-new-mexico/");

export const metadata = luxeMetadata(campaign);

export default function Page() {
  return <LuxeLanding campaign={campaign} />;
}
