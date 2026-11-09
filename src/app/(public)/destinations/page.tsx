import type { Metadata } from "next";
import { DestinationGrid } from "@/features/destinations/DestinationGrid";
import PageHero from "@/components/ui/PageHero";
import { fetchDestinations } from "@/services/destinationService";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore Sri Lanka's heritage cities, hill country, coasts, and wildlife zones with local route context from Aba Ceylon Tours & Travels.",
  alternates: {
    canonical: "https://www.abaceylontours.com/destinations",
  },
};

export default async function DestinationsPage() {
  const destinations = await fetchDestinations();

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <PageHero
        imageSrc="/images/heritage/sl-image.webp"
        imageAlt="Sri Lanka destinations across heritage sites, hills, and coastline"
        eyebrow="The teardrop isle"
        title="Destinations"
        subtitle="Ancient cities, misty hills, wild parks and golden coasts, all within a few hours of each other."
      />

      <section className="mx-auto max-w-[1360px] px-6 py-16 lg:px-10 lg:py-24">
        <DestinationGrid destinations={destinations} />
      </section>
    </div>
  );
}
