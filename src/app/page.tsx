"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/hero/HeroSection";
import InteractiveMap from "@/components/interactiveSriLanka/InteractiveMap";
import FeaturedPckgs from "@/components/featuredPackages/FeaturedPckgs";
import FeaturedStays from "@/components/featuredStays/FeaturedStays";
import Testimonials from "@/components/testimonials/Testimonials";
import BuddhaLotus from "@/components/buddhaLotus/BuddhaLotus";
import FleetSection from "@/components/fleet/FleetSection";
import CustomPlannerSection from "@/components/customPlanner/CustomPlannerSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  useEffect(() => {
    // Smooth scroll behavior
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <HeroSection />
      <InteractiveMap />
      <FeaturedPckgs />
      <FeaturedStays />
      <Testimonials />
      <FleetSection />
      <CustomPlannerSection />
      <BuddhaLotus />
    </div>
  );
}
