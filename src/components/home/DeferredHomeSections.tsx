"use client";

import dynamic from "next/dynamic";
import type { PackageItem } from "@/types/package";

function SectionSkeleton({
  className = "bg-white",
  title = "Loading section",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={`flex min-h-[420px] items-center justify-center px-6 py-24 ${className}`}
      aria-label={title}
      aria-busy="true"
    >
      <div className="w-full max-w-6xl animate-pulse">
        <div className="mx-auto h-10 w-64 border border-current/10 bg-current/10" />
        <div className="mx-auto mt-5 h-4 w-96 max-w-full border border-current/10 bg-current/5" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="h-72 border border-current/10 bg-current/5" />
          <div className="h-72 border border-current/10 bg-current/5" />
          <div className="h-72 border border-current/10 bg-current/5" />
        </div>
      </div>
    </section>
  );
}

const WhoWeAre = dynamic(
  () => import("@/components/whoWeAre/WhoWeAre"),
  { loading: () => <SectionSkeleton className="bg-[#182231] text-white" title="Loading" /> },
);

const TopPackagesCarousel = dynamic(
  () => import("@/components/packages/TopPackagesCarousel"),
  { loading: () => <SectionSkeleton className="bg-[#f6f0e6] text-[#182231]" title="Loading tour packages" /> },
);

const HowItWorks = dynamic(
  () => import("@/components/howItWorks/HowItWorks"),
  { loading: () => <SectionSkeleton title="Loading" /> },
);

const TrustBar = dynamic(
  () => import("@/components/trustBar/TrustBar"),
  { loading: () => <SectionSkeleton title="Loading" /> },
);

const InteractiveMap = dynamic(
  () => import("@/components/interactiveSriLanka/InteractiveMap"),
  { ssr: false, loading: () => <SectionSkeleton className="bg-[#182231] text-white" title="Loading interactive map" /> },
);

const WhyChooseUs = dynamic(
  () => import("@/components/whyChooseUs/WhyChooseUs"),
  { loading: () => <SectionSkeleton title="Loading" /> },
);

const PlanYourJourney = dynamic(
  () => import("@/components/customPlanner/PlanYourJourney"),
  { loading: () => <SectionSkeleton title="Loading journey planner" /> },
);

const FeaturedStays = dynamic(
  () => import("@/components/featuredStays/FeaturedStays"),
  { loading: () => <SectionSkeleton title="Loading stays" /> },
);

const FleetSection = dynamic(
  () => import("@/components/fleet/FleetSection"),
  { loading: () => <SectionSkeleton title="Loading fleet" /> },
);

const BuddhaLotus = dynamic(
  () => import("@/components/buddhaLotus/BuddhaLotus"),
  { ssr: false, loading: () => <SectionSkeleton className="bg-[#05070A] text-white" title="Loading" /> },
);

const FAQ = dynamic(
  () => import("@/components/faq/FAQ"),
  { loading: () => <SectionSkeleton title="Loading FAQ" /> },
);

const Testimonials = dynamic(
  () => import("@/components/testimonials/Testimonials"),
  { loading: () => <SectionSkeleton title="Loading testimonials" /> },
);

export default function DeferredHomeSections({
  packages,
}: {
  packages: PackageItem[];
}) {
  return (
    <>
      <WhoWeAre />
      <TopPackagesCarousel packages={packages} />
      <HowItWorks />
      <BuddhaLotus />
      <TrustBar />
      <InteractiveMap />
      <WhyChooseUs />
      <PlanYourJourney />
      <FeaturedStays />
      <FleetSection />
      <FAQ />
      <Testimonials />
    </>
  );
}
