import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PackageDetails from "@/features/packages/PackageDetails";
import { fetchPackageBySlug } from "@/services/packageService";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await fetchPackageBySlug(slug);
  if (!pkg) return { title: "Package Not Found" };
  return {
    title: pkg.title,
    description: pkg.summary,
    alternates: { canonical: `https://www.abaceylontours.com/packages/${pkg.id}` },
    openGraph: { title: pkg.title, description: pkg.summary, images: pkg.image ? [{ url: pkg.image }] : [] },
  };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = await fetchPackageBySlug(slug);
  if (!pkg) notFound();
  return <PackageDetails pkg={pkg} />;
}
