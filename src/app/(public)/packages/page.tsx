import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ListingIntro, { ResultCount } from "@/components/ui/ListingIntro";
import PackageCard from "@/features/packages/PackageCard";
import { fetchPackages } from "@/services/packageService";
import { routes } from "@/constants/routes";

// Package data is maintained in the dashboard, so it must be read fresh for
// each request instead of waiting for the previous one-hour cache to expire.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PackagesPage() {
  const packages = await fetchPackages();

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <PageHero
        imageSrc="/allPckgs.png"
        imageAlt="Private journeys through Sri Lanka"
        eyebrow="Signature journeys"
        title="Tour Packages"
        subtitle="Routes designed by our local team, ready as they are or reshaped around you."
      />

      <section className="mx-auto max-w-[1360px] px-6 py-16 lg:px-10 lg:py-24">
        <ListingIntro
          kicker="Choose a route"
          title="Every journey is private."
          description="Each package comes with your own chauffeur and hand-picked stays. Tell us what to change and we will re-plan it."
          aside={<ResultCount count={packages.length} noun="journey" />}
        />

        {packages.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10" data-reveal-stagger>
            {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="border border-dashed border-[#182231]/20 px-6 py-20 text-center">
            <h3 className="font-cinzel text-2xl text-[#182231]">New journeys are being prepared</h3>
            <p className="mt-3 text-sm text-[#182231]/60">Check back soon, or ask us for a custom route.</p>
            <Link href={routes.customizeJourneys} className="editorial-link mt-6 text-[#9b7422]">
              Build a custom route
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
