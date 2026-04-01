import StayDetails from "@/features/stays/StayDetails";
import { fetchStayBySlug } from "@/services/stayService";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = await fetchStayBySlug(slug);
  if (!stay) notFound();
  return <StayDetails stay={stay} />;
}
