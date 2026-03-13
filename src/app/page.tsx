import HeroSection from '@/components/hero/HeroSection';
import InteractiveMap from '@/components/interactiveSriLanka/InteractiveMap';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <InteractiveMap />
    </div>
  );
}
