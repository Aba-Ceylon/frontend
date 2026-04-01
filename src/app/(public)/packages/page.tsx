"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import PackageCard from "@/features/packages/PackageCard";
import { packages as fallbackPackages } from "@/data/packages";
import PaginationControls from "@/components/ui/PaginationControls";
import { fetchPackages } from "@/services/packageService";
import type { PackageItem } from "@/types/package";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

export default function PackagesPage() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [packageItems, setPackageItems] =
    useState<PackageItem[]>(fallbackPackages);

  const totalPages = Math.max(
    1,
    Math.ceil(packageItems.length / ITEMS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return packageItems.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, packageItems]);

  useEffect(() => {
    let active = true;

    void fetchPackages().then((loadedPackages) => {
      if (!active || !loadedPackages.length) {
        return;
      }

      setPackageItems(loadedPackages);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text — fromTo ensures opacity starts at 0 regardless of navigation state
      gsap.fromTo(
        heroTextRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.05 },
      );

      // Hero image subtle parallax on scroll
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
    const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
    if (!cards.length) {
      return;
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      },
    );
  }, [paginatedPackages]);

  return (
    <div className="bg-noise bg-[#F5F2ED] min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <div ref={heroImgRef} className="absolute inset-0 scale-110">
          <Image
            src="/allPckgs.png"
            alt="Sri Lanka Travel"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/60" />

        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="font-cinzel text-amber-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">
            Aba Ceylon Tours & Travels
          </p>
          <h1 className="font-cinzel text-4xl sm:text-6xl font-medium text-white mb-5 leading-tight drop-shadow-lg">
            Explore Our Curated Travel Packages
          </h1>
          <p className="font-cinzel text-sm sm:text-base text-white/80 max-w-lg">
            Handcrafted journeys across Sri Lanka&apos;s heritage, hills,
            wildlife, and coastlines.
          </p>
          <div className="mt-6 w-16 h-px bg-amber-400" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {paginatedPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
