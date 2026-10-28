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
    <main className="min-h-screen bg-white">
      <PageHero
        imageSrc="/images/heritage/sl-image.webp"
        imageAlt="Sri Lanka destinations across heritage sites, hills, and coastline"
        title="Destinations"
        subtitle="Heritage, hills, coast and wildlife"
      />

      <section className="mx-auto max-w-[1360px] px-6 py-14 lg:px-10 lg:py-18">
        <DestinationGrid destinations={destinations} />
      </section>
    </main>
  );
}
