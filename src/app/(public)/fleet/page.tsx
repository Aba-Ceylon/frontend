"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageHero from "@/components/ui/PageHero";
import ListingIntro, { ResultCount } from "@/components/ui/ListingIntro";
import VehicleCard from "@/features/fleet/VehicleCard";
import PaginationControls from "@/components/ui/PaginationControls";
import type { FleetVehicle } from "@/types/vehicle";
import { fetchVehiclesPage } from "@/services/fleetService";

const ITEMS_PER_PAGE = 6;

function VehicleSkeleton() {
  return (
    <div className="animate-pulse border border-[#182231]/10 bg-white" aria-hidden="true">
      <div className="aspect-[16/10] bg-[#182231]/8" />
      <div className="space-y-4 p-8">
        <div className="h-3 w-32 bg-[#182231]/10" />
        <div className="h-7 w-56 bg-[#182231]/10" />
        <div className="h-8 w-48 rounded-full bg-[#182231]/8" />
      </div>
    </div>
  );
}

export default function FleetPage() {
  const gridRef = useRef<HTMLElement>(null);
  const [page, setPage] = useState(1);
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const { vehicles, totalCount: count } = await fetchVehiclesPage(page, ITEMS_PER_PAGE);
        if (!active) return;
        setFleetVehicles(vehicles);
        setTotalCount(count);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load fleet.");
        setFleetVehicles([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [page]);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <PageHero
        imageSrc="/images/fleet/fleets.png"
        imageAlt="Aba Ceylon chauffeur-driven fleet vehicles"
        eyebrow="Private chauffeur"
        title="Our Fleet"
        subtitle="Air-conditioned cars, SUVs and vans, each with an English-speaking driver."
      />
      <section ref={gridRef} className="mx-auto max-w-[1360px] scroll-mt-24 px-6 py-16 lg:px-10 lg:py-24">
        <ListingIntro
          kicker="Travel in comfort"
          title="A vehicle for every group."
          description="From couples to large families, we match the vehicle to your group size and luggage. Open one to request it."
          aside={totalCount ? <ResultCount count={totalCount} noun="vehicle" /> : null}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {Array.from({ length: 4 }, (_, i) => <VehicleSkeleton key={i} />)}
          </div>
        ) : (
          <div key={page} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10" data-reveal-stagger>
            {fleetVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        )}

        {!isLoading && error && <p className="mt-8 text-center text-sm text-red-700">{error}</p>}
        {!isLoading && !error && fleetVehicles.length === 0 && (
          <p className="mt-8 text-center text-sm text-[#182231]/70">No fleet vehicles available right now.</p>
        )}
        <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
    </div>
  );
}
