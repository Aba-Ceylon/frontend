import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { activities } from "@/data/activities";
import ActivityCard from "@/features/activities/ActivityCard";

export const metadata: Metadata = {
  title: "Curated Activities",
  description:
    "Route-first Sri Lanka experiences from Aba Ceylon Tours & Travels, chosen to strengthen your itinerary rather than pad it.",
  alternates: {
    canonical: "https://www.abaceylontours.com/activities",
  },
};

export default function ActivitiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        imageSrc="/Who.png"
        imageAlt="Curated Sri Lanka travel experiences and activities"
        title="Activities"
        subtitle="Experiences that fit the route"
      />

      <section className="mx-auto max-w-[1360px] px-6 py-14 lg:px-10 lg:py-18">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </main>
  );
}
