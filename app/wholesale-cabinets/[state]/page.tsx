import { notFound } from "next/navigation";
import { ServiceAreaPage } from "@/components/service/ServiceAreaPage";
import { findArea, stateAreas } from "@/lib/serviceAreas";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => stateAreas.map((a) => ({ state: a.state }));

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const a = findArea(state);
  if (!a) return {};
  return pageMetadata({
    title: `Wholesale Kitchen & Bath Cabinets in ${a.stateName}`,
    description: `Highland Cabinetry supplies ${a.stateName} builders, contractors, remodelers and dealers with Shaker, Nano and Euro cabinets from its Phoenix showroom and warehouse.`,
    path: a.path,
  });
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const a = findArea(state);
  if (!a) notFound();
  return <ServiceAreaPage area={a} />;
}
