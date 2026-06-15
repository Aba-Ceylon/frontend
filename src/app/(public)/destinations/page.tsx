import { DestinationGrid } from "@/features/destinations/DestinationGrid";
import { DestinationHeader } from "@/features/destinations/DestinationHeader";
import PageHero from "@/components/ui/PageHero";
import { fetchDestinations } from "@/services/destinationService";

export default async function DestinationsPage() {
  const destinations = await fetchDestinations();
  const categories = new Set(destinations.map((destination) => destination.category));
  const regions = new Set(destinations.map((destination) => destination.region));

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        imageSrc="/images/heritage/sl-image.webp"
        imageAlt="Sri Lanka destinations across heritage sites, hills, and coastline"
        eyebrow="Aba Ceylon Tours & Travels"
        title="Destinations Across Sri Lanka"
        subtitle="Build smarter routes with local context on the island's heritage cities, hill country, coasts, wildlife zones, and overlooked connectors."
      />

      <section className="mx-auto max-w-[1360px] px-6 py-14 lg:px-10 lg:py-18">
        <DestinationHeader
          destinationCount={destinations.length}
          categoryCount={categories.size}
          regionCount={regions.size}
        />
        <DestinationGrid destinations={destinations} />
      </section>
    </main>
  );
}
