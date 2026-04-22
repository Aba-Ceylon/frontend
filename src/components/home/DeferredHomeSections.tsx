"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

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

function LocalizedSectionSkeleton({
  className,
  titleKey,
}: {
  className?: string;
  titleKey: string;
}) {
  const { t } = useTranslation();

  return <SectionSkeleton className={className} title={t(titleKey)} />;
}

const InteractiveMap = dynamic(
  () => import("@/components/interactiveSriLanka/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <LocalizedSectionSkeleton
        className="bg-[#0F172A] text-white"
        titleKey="loading.interactiveMap"
      />
    ),
  },
);

const FeaturedPckgs = dynamic(
  () => import("@/components/featuredPackages/FeaturedPckgs"),
  {
    loading: () => <LocalizedSectionSkeleton titleKey="loading.packages" />,
  },
);

const FeaturedStays = dynamic(
  () => import("@/components/featuredStays/FeaturedStays"),
  {
    loading: () => (
      <LocalizedSectionSkeleton
        className="bg-[#1A2238] text-white"
        titleKey="loading.stays"
      />
    ),
  },
);

const FleetSection = dynamic(() => import("@/components/fleet/FleetSection"), {
  loading: () => <LocalizedSectionSkeleton titleKey="loading.fleet" />,
});

const CustomPlannerSection = dynamic(
  () => import("@/components/customPlanner/CustomPlannerSection"),
  {
    loading: () => (
      <LocalizedSectionSkeleton
        className="bg-[#0F172A] text-white"
        titleKey="loading.plannerSection"
      />
    ),
  },
);

const BuddhaLotus = dynamic(
  () => import("@/components/buddhaLotus/BuddhaLotus"),
  {
    ssr: false,
    loading: () => (
      <LocalizedSectionSkeleton
        className="bg-[#05070A] text-white"
        titleKey="loading.buddhaLotus"
      />
    ),
  },
);

const Testimonials = dynamic(
  () => import("@/components/testimonials/Testimonials"),
  {
    loading: () => (
      <LocalizedSectionSkeleton
        className="bg-[#1A2238] text-white"
        titleKey="loading.testimonials"
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
