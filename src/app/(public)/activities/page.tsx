import PageHero from "@/components/ui/PageHero";
import { activities } from "@/data/activities";
import ActivityCard from "@/features/activities/ActivityCard";

export default function ActivitiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        imageSrc="/Who.png"
        imageAlt="Curated Sri Lanka travel experiences and activities"
        eyebrow="Aba Ceylon Tours & Travels"
        title="Curated Activities"
        subtitle="Private-route experiences designed around mood, pace, and the parts of Sri Lanka that make sense together."
      />

      <section className="mx-auto max-w-[1360px] px-6 py-14 lg:px-10 lg:py-18">
        <div className="mb-12 border border-[#182231]/10 bg-white px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:px-8">
          <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#C99A2B]">
            Route-first experiences
          </p>
          <h2 className="mt-3 font-cinzel text-3xl text-[#182231] sm:text-4xl">
            Experiences that support the journey instead of cluttering it
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#182231]/68">
            We do not stack activities for the sake of volume. Each one below is
            something we use when it strengthens the route, the rhythm of the
            day, and the kind of Sri Lanka trip you actually want.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </main>
  );
}
