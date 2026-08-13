import HeroSection from "@/components/hero/HeroSection";
import DeferredHomeSections from "@/components/home/DeferredHomeSections";
import HomeEntryLoader from "@/components/home/HomeEntryLoader";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HomeEntryLoader />
      <HeroSection />
      <DeferredHomeSections />
    </div>
  );
}
