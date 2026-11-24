import { notFound } from "next/navigation";
import { ServiceAreaPage } from "@/components/service/ServiceAreaPage";
import { areaMeta, findArea, stateAreas } from "@/lib/serviceAreas";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => stateAreas.map((a) => ({ state: a.state }));

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const a = findArea(state);
  if (!a) return {};
  return pageMetadata({ ...areaMeta(a), path: a.path, image: undefined });
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const a = findArea(state);
  if (!a) notFound();
  return <ServiceAreaPage area={a} />;
}
