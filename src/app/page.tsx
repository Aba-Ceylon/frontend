import HeroSection from "@/components/hero/HeroSection";
import DeferredHomeSections from "@/components/home/DeferredHomeSections";
import HomeEntryLoader from "@/components/home/HomeEntryLoader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <HomeEntryLoader />
      <HeroSection />
      <DeferredHomeSections />
    </div>
  );
}
