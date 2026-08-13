import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PackageDetails from "@/features/packages/PackageDetails";
import { fetchPackageBySlug } from "@/services/packageService";
import { packages } from "@/data/packages";

export const revalidate = 3600;

// Prerender the same slugs the sitemap advertises so every submitted URL is a
// static page rather than a per-request Supabase fetch.
export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.id }));
}

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
