import HeroSection from "@/components/hero/HeroSection";
import DeferredHomeSections from "@/components/home/DeferredHomeSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <DeferredHomeSections />
    </div>
  );
}
