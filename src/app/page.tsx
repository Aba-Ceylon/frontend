"use client";

import HeroSection from "@/components/hero/HeroSection";
import DeferredHomeSections from "@/components/home/DeferredHomeSections";
import HomeEntryLoader from "@/components/home/HomeEntryLoader";
import { useLoaderGate } from "@/components/home/LoaderGate";

export default function Home() {
  const ready = useLoaderGate();

  return (
    <div className="min-h-screen bg-white">
      <HomeEntryLoader />
      {ready && <HeroSection />}
      {ready && <DeferredHomeSections />}
    </div>
  );
}
