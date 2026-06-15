"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/ui/PageHero";
import VehicleCard from "@/features/fleet/VehicleCard";
import PaginationControls from "@/components/ui/PaginationControls";
import type { FleetVehicle } from "@/types/vehicle";
import { fetchVehiclesPage } from "@/services/fleetService";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

export default function FleetPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current
        ? Array.from(gridRef.current.querySelectorAll("[data-fleet-card]"))
        : [];
      const cleanup: Array<() => void> = [];
      if (cards.length) {
        gsap.fromTo(cards, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", toggleActions: "play none none none" },
        });
        cards.forEach((el) => {
          const img = el.querySelector(".fleet-card-image") as HTMLElement | null;
          const tl = gsap.timeline({ paused: true });
          tl.to(el, { y: -6, boxShadow: "0 20px 36px rgba(11,37,69,0.18)", duration: 0.24, ease: "power2.out" }, 0);
          if (img) tl.to(img, { scale: 1.08, duration: 0.42, ease: "power2.out" }, 0);
          const onEnter = () => tl.play();
          const onLeave = () => tl.reverse();
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          cleanup.push(() => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); tl.kill(); });
        });
      }
      return () => cleanup.forEach((fn) => fn());
    }, gridRef);
    return () => ctx.revert();
  }, [fleetVehicles]);

  const handlePageChange = useCallback((p: number) => setPage(p), []);

  return (
    <div className="bg-noise min-h-screen bg-white">
      <PageHero
        imageSrc="/images/fleet/fleets.png"
        imageAlt="Premium Fleet Vehicles"
        eyebrow="Aba Ceylon Tours & Travels"
        title="Explore Our Premium Fleet"
        subtitle="Chauffeured vehicles designed for comfort, elegance, and seamless travel across Sri Lanka."
        height="h-[52vh] sm:h-[58vh]"
      />
      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {fleetVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
        {!isLoading && error && <p className="mt-8 text-center text-sm text-red-700">{error}</p>}
        {!isLoading && !error && fleetVehicles.length === 0 && (
          <p className="mt-8 text-center text-sm text-neutral-700">No fleet vehicles available right now.</p>
        )}
        {isLoading && <p className="mt-8 text-center text-sm text-neutral-700">Loading fleet vehicles...</p>}
        <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
