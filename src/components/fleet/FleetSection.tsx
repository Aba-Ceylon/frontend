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
    <section id="fleet" className="overflow-hidden bg-[#F5F2ED] py-24">
      <div className="mx-auto px-6">
        <SectionHeader
          title="Premium Fleet"
          description="Chauffeured luxury vehicles for seamless journeys across Sri Lanka."
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            disabled={fleetVehicles.length <= 1}
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-40 md:flex"
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
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-40 md:flex"
            aria-label="Next"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        {isLoading && <p className="mt-6 text-center text-sm text-neutral-600">Loading fleet...</p>}
        {!isLoading && error && <p className="mt-6 text-center text-sm text-red-500">{error}</p>}
        {!isLoading && !error && fleetVehicles.length === 0 && (
          <p className="mt-6 text-center text-sm text-neutral-600">No fleet vehicles available right now.</p>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {fleetVehicles.map((_, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === dotIndex ? "bg-neutral-800 scale-125" : "bg-neutral-300"}`} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/fleet" className="inline-flex items-center px-6 py-3 font-cinzel text-neutral-800 transition hover:text-[#C99A2B] drop-shadow-[0_0_30px_rgba(201,154,43,0.38)]">
            Explore Full Fleet
            <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
