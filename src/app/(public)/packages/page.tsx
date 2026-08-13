import PageHero from "@/components/ui/PageHero";
import PackageCard from "@/features/packages/PackageCard";
import { fetchPackages } from "@/services/packageService";

export const revalidate = 3600;

export default async function PackagesPage() {
  const packages = await fetchPackages();

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      <PageHero
        imageSrc="/allPckgs.png"
        imageAlt="Private journeys through Sri Lanka"
        eyebrow="Aba Ceylon Tours & Travels"
        title="Journeys, Ready to Make Your Own"
        subtitle="Browse routes created by our local travel team, then request the package that fits your pace."
      />

      <section className="mx-auto max-w-[1360px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-3 border-b border-[#101A28]/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.3em] text-[#A97B17]">Available packages</p>
            <h2 className="mt-2 font-cinzel text-3xl text-[#101A28]">Choose your route</h2>
          </div>
          <p className="text-sm text-[#667080]">{packages.length} {packages.length === 1 ? "journey" : "journeys"} available</p>
        </div>

        {packages.length ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="font-cinzel text-2xl text-[#101A28]">New journeys are being prepared</h3>
            <p className="mt-3 text-sm text-[#667080]">Please check back soon or contact us for a custom itinerary.</p>
          </div>
        )}
      </section>
    </main>
  );
}
