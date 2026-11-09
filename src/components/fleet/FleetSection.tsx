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

  const { stripRef, containerRef, cloned, dotIndex, cardWidth, gap, slideTo, onPointerDown, onPointerUp, onClickCapture } =
    useCarousel({ items: fleetVehicles, gap: 24, autoPlayMs: 5200, maxVisible: 2 });

  return (
    <section id="fleet" className="overflow-hidden bg-[var(--ivory)] py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <SectionHeader
          align="left"
          eyebrow="Private chauffeur"
          title="Travel in comfort."
          description="Air-conditioned cars, SUVs and vans, each with an English-speaking driver who stays with you for the whole trip."
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            disabled={fleetVehicles.length <= 1}
            className="round-btn round-btn-light hidden md:inline-flex"
            type="button"
            aria-label="Previous vehicle"
          >
            <LucideArrowLeft size={16} />
          </button>

          <div
            ref={containerRef}
            className="relative overflow-hidden flex-1 cursor-grab active:cursor-grabbing select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
              onClickCapture={onClickCapture}
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
            className="round-btn round-btn-light hidden md:inline-flex"
            type="button"
            aria-label="Next vehicle"
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
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === dotIndex ? "w-8 bg-[#c99a2b]" : "w-1.5 bg-[#182231]/20"}`} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/fleet" className="editorial-link text-[#9b7422] hover:text-[#182231]">
            Explore Full Fleet
          </Link>
        </div>
      </div>
    </section>
  );
}
