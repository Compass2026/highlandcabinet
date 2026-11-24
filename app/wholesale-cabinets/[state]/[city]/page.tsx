import { notFound } from "next/navigation";
import { ServiceAreaPage } from "@/components/service/ServiceAreaPage";
import { areaMeta, cityAreas, findArea } from "@/lib/serviceAreas";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => cityAreas.map((a) => ({ state: a.state, city: a.city! }));

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  const a = findArea(state, city);
  if (!a) return {};
  return pageMetadata({ ...areaMeta(a), path: a.path, image: undefined });
}

export default async function CityPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  const a = findArea(state, city);
  if (!a) notFound();
  return <ServiceAreaPage area={a} />;
}
