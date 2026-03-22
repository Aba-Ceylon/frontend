import { packages } from "@/data/packages";
import PackageDetails from "@/features/packages/PackageDetails";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.id }));
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = packages.find((p) => p.id === slug);
  if (!pkg) notFound();
  return <PackageDetails pkg={pkg} />;
}
