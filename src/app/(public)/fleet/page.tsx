"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import vehicles from "@/data/vehicles";
import VehicleCard from "@/features/fleet/VehicleCard";
import PaginationControls from "@/components/ui/PaginationControls";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

export default function FleetPage() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(vehicles.length / ITEMS_PER_PAGE));

  const paginatedVehicles = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return vehicles.slice(start, start + ITEMS_PER_PAGE);
  }, [page]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroTextRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.05 }
      );

      gsap.to(heroImgRef.current, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: heroImgRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current ? Array.from(gridRef.current.querySelectorAll("[data-fleet-card]")) : [];
      const cleanup: Array<() => void> = [];
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        cards.forEach((cardEl) => {
          const imageEl = cardEl.querySelector(".fleet-card-image") as HTMLElement | null;
          const hoverTl = gsap.timeline({ paused: true });
          hoverTl.to(cardEl, { y: -6, boxShadow: "0 20px 36px rgba(11,37,69,0.18)", duration: 0.24, ease: "power2.out" }, 0);
          if (imageEl) {
            hoverTl.to(imageEl, { scale: 1.08, duration: 0.42, ease: "power2.out" }, 0);
          }

          const onEnter = () => hoverTl.play();
          const onLeave = () => hoverTl.reverse();

          cardEl.addEventListener("mouseenter", onEnter);
          cardEl.addEventListener("mouseleave", onLeave);

          cleanup.push(() => {
            cardEl.removeEventListener("mouseenter", onEnter);
            cardEl.removeEventListener("mouseleave", onLeave);
            hoverTl.kill();
          });
        });
      }

      return () => cleanup.forEach((fn) => fn());
    }, gridRef);

    return () => ctx.revert();
  }, [paginatedVehicles]);

  return (
    <div className="bg-noise bg-[#F5F2ED] min-h-screen">
      <div className="relative h-[52vh] sm:h-[58vh] overflow-hidden">
        <div ref={heroImgRef} className="absolute inset-0 scale-110">
          <Image
            src="/images/fleet/fleets.png"
            alt="Premium fleet vehicles"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/60" />

        <div ref={heroTextRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-cinzel text-amber-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">
            Aba Ceylon Tours & Travels
          </p>
          <h1 className="font-cinzel text-4xl sm:text-6xl font-medium text-white mb-5 leading-tight drop-shadow-lg">
            Explore Our Premium Fleet
          </h1>
          <p className="font-cinzel text-sm sm:text-base text-white/80 max-w-lg">
            Chauffeured vehicles designed for comfort, elegance, and seamless travel across Sri Lanka.
          </p>
          <div className="mt-6 w-16 h-px bg-amber-400" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginatedVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
