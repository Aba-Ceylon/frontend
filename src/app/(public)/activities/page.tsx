import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { activities } from "@/data/activities";
import ActivityCard from "@/features/activities/ActivityCard";
import ListingIntro, { ResultCount } from "@/components/ui/ListingIntro";

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
    <div className="min-h-screen bg-[var(--ivory)]">
      <PageHero
        imageSrc="/Who.png"
        imageAlt="Curated Sri Lanka travel experiences and activities"
        eyebrow="Bespoke experiences"
        title="Activities"
        subtitle="Experiences chosen to strengthen your route, not pad it."
      />

      <section className="mx-auto max-w-[1360px] px-6 py-16 lg:px-10 lg:py-24">
        <ListingIntro
          kicker="Add to your journey"
          title="Moments worth the detour."
          description="Heritage trails, safaris, hill country rides, lagoon escapes and village kitchens. Ask us to fit any of them into your plan."
          aside={<ResultCount count={activities.length} noun="experience" />}
        />
        <div className="grid gap-8 md:grid-cols-2 lg:gap-10" data-reveal-stagger>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  );
}
