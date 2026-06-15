"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import VehicleCard from "@/features/fleet/VehicleCard";
import { useCarousel } from "@/hooks/useCarousel";
import type { FleetVehicle } from "@/types/vehicle";
import { fetchVehiclesPage } from "@/services/fleetService";

const HOME_FLEET_ITEMS = 8;

export default function FleetSection() {
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchVehiclesPage(1, HOME_FLEET_ITEMS)
      .then(({ vehicles }) => {
        if (!active) return;
        setFleetVehicles(vehicles);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load fleet.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const { stripRef, containerRef, cloned, dotIndex, cardWidth, gap, slideTo, onPointerDown, onPointerUp } =
    useCarousel({ items: fleetVehicles, gap: 24, autoPlayMs: 5200 });

  return (
    <section id="fleet" className="overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <SectionHeader
          align="left"
          eyebrow="On-road comfort"
          title="Vehicles chosen to suit the route, not fill a brochure."
          description="Private transport options for couples, families, and longer island routes, matched around comfort, luggage, and travel rhythm."
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            disabled={fleetVehicles.length <= 1}
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-[#182231]/14 text-[#182231] transition hover:bg-[#182231] hover:text-white disabled:opacity-40 md:flex"
            aria-label="Previous"
          >
            <LucideArrowLeft size={16} />
          </button>

          <div
            ref={containerRef}
            className="relative overflow-hidden flex-1 cursor-grab active:cursor-grabbing select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div ref={stripRef} className="flex" style={{ gap, willChange: "transform" }}>
              {cloned.map((v, i) => (
                <div key={`${v.id}-${i}`} className="shrink-0" style={{ width: cardWidth }}>
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => slideTo(1)}
            disabled={fleetVehicles.length <= 1}
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-[#182231]/14 text-[#182231] transition hover:bg-[#182231] hover:text-white disabled:opacity-40 md:flex"
            aria-label="Next"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        {isLoading && <p className="mt-6 text-center text-sm text-[#182231]/62">Loading fleet...</p>}
        {!isLoading && error && <p className="mt-6 text-center text-sm text-red-500">{error}</p>}
        {!isLoading && !error && fleetVehicles.length === 0 && (
          <p className="mt-6 text-center text-sm text-[#182231]/62">No fleet vehicles available right now.</p>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {fleetVehicles.map((_, i) => (
            <span key={i} className={`h-2.5 transition-all ${i === dotIndex ? "w-8 bg-[#182231]" : "w-2.5 bg-[#182231]/16"}`} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/fleet" className="editorial-link text-[#182231]">
            Explore Full Fleet
          </Link>
        </div>
      </div>
    </section>
  );
}
