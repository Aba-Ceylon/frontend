import PageHero from "@/components/ui/PageHero";
import PackageCard from "@/features/packages/PackageCard";
import { fetchPackages } from "@/services/packageService";

// Package data is maintained in the dashboard, so it must be read fresh for
// each request instead of waiting for the previous one-hour cache to expire.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PackagesPage() {
  const packages = await fetchPackages();

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      <PageHero
        imageSrc="/allPckgs.png"
        imageAlt="Private journeys through Sri Lanka"
        title="Tour Packages"
        subtitle="Routes designed by our local team"
      />

      <section className="mx-auto max-w-[1360px] px-6 py-14 lg:px-10 lg:py-20">
        {packages.length ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="font-cinzel text-2xl text-[#101A28]">New journeys are being prepared</h3>
            <p className="mt-3 text-sm text-[#667080]">Check back soon, or ask us for a custom route.</p>
          </div>
        )}
      </section>
    </main>
  );
}
