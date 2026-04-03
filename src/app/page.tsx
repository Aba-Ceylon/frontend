import HeroSection from "@/components/hero/HeroSection";
import DeferredHomeSections from "@/components/home/DeferredHomeSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <HeroSection />
      <DeferredHomeSections />
    </div>
  );
}
