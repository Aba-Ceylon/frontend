"use client";

import HeroSection from "@/components/hero/HeroSection";
import DeferredHomeSections from "@/components/home/DeferredHomeSections";
import HomeEntryLoader from "@/components/home/HomeEntryLoader";
import { useLoaderGate } from "@/components/home/LoaderGate";

export default function Home() {
  const ready = useLoaderGate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <HomeEntryLoader />
      {ready && <HeroSection />}
      {ready && <DeferredHomeSections />}
    </div>
  );
}
