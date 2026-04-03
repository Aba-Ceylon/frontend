"use client";

import dynamic from "next/dynamic";

function SectionSkeleton({
  className = "bg-[#F5F2ED]",
  title = "Loading section",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={`flex min-h-[420px] items-center justify-center px-6 py-24 ${className}`}
      aria-label={title}
    >
      <div className="w-full max-w-6xl animate-pulse">
        <div className="mx-auto h-10 w-64 rounded-full bg-white/20" />
        <div className="mx-auto mt-5 h-4 w-96 max-w-full rounded-full bg-white/10" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="h-72 rounded-[1.5rem] bg-white/10" />
          <div className="h-72 rounded-[1.5rem] bg-white/10" />
          <div className="h-72 rounded-[1.5rem] bg-white/10" />
        </div>
      </div>
    </section>
  );
}

const InteractiveMap = dynamic(
  () => import("@/components/interactiveSriLanka/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton
        className="bg-[#0F172A] text-white"
        title="Loading interactive map"
      />
    ),
  },
);

const FeaturedPckgs = dynamic(
  () => import("@/components/featuredPackages/FeaturedPckgs"),
  {
    loading: () => <SectionSkeleton title="Loading packages" />,
  },
);

const FeaturedStays = dynamic(
  () => import("@/components/featuredStays/FeaturedStays"),
  {
    loading: () => (
      <SectionSkeleton
        className="bg-[#1A2238] text-white"
        title="Loading stays"
      />
    ),
  },
);

const FleetSection = dynamic(() => import("@/components/fleet/FleetSection"), {
  loading: () => <SectionSkeleton title="Loading fleet" />,
});

const CustomPlannerSection = dynamic(
  () => import("@/components/customPlanner/CustomPlannerSection"),
  {
    loading: () => (
      <SectionSkeleton
        className="bg-[#0F172A] text-white"
        title="Loading planner section"
      />
    ),
  },
);

const BuddhaLotus = dynamic(
  () => import("@/components/buddhaLotus/BuddhaLotus"),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton
        className="bg-[#05070A] text-white"
        title="Loading Buddha Lotus section"
      />
    ),
  },
);

const Testimonials = dynamic(
  () => import("@/components/testimonials/Testimonials"),
  {
    loading: () => (
      <SectionSkeleton
        className="bg-[#1A2238] text-white"
        title="Loading testimonials"
      />
    ),
  },
);

export default function DeferredHomeSections() {
  return (
    <>
      <InteractiveMap />
      <FeaturedPckgs />
      <FeaturedStays />
      <FleetSection />
      <CustomPlannerSection />
      <BuddhaLotus />
      <Testimonials />
    </>
  );
}
