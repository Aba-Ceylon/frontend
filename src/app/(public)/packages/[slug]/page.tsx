import PackageDetails from "@/features/packages/PackageDetails";
import { fetchPackageBySlug } from "@/services/packageService";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pkg = await fetchPackageBySlug(slug);

  if (!pkg) notFound();
  return <PackageDetails pkg={pkg} />;
}
