import { stays } from "@/data/stays";
import StayDetails from "@/features/stays/StayDetails";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return stays.map((stay) => ({ slug: stay.id }));
}

export default async function StayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stay = stays.find((s) => s.id === slug);
  if (!stay) notFound();
  return <StayDetails stay={stay} />;
}
