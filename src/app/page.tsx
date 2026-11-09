import HeroSection from "@/components/hero/HeroSection";
import IslandMoments from "@/components/islandMoments/IslandMoments";
import DeferredHomeSections from "@/components/home/DeferredHomeSections";
import { fetchPackages } from "@/services/packageService";

// Home-page package picks are managed in the dashboard and must stay current.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const packages = await fetchPackages();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <IslandMoments />
      <DeferredHomeSections packages={packages} />
    </div>
  );
}
