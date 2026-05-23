"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/ui/PageHero";
import PackageCard from "@/features/packages/PackageCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { packages as fallbackPackages } from "@/data/packages";
import { fetchPackages } from "@/services/packageService";
import type { PackageItem } from "@/types/package";


gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

export default function PackagesPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [packageItems, setPackageItems] = useState<PackageItem[]>(fallbackPackages);

  const totalPages = Math.max(1, Math.ceil(packageItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return packageItems.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, packageItems]);

  useEffect(() => {
    let active = true;
    void fetchPackages().then((loaded) => {
      if (!active || !loaded.length) return;
      setPackageItems(loaded);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
    if (!cards.length) return;
    gsap.fromTo(cards, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
  }, [paginatedPackages]);

  const handlePageChange = useCallback((p: number) => setPage(p), []);

  return (
    <div className="bg-noise bg-[#F5F2ED] min-h-screen">
      <PageHero
        imageSrc="/allPckgs.png"
        imageAlt="Holiday Packages"
        eyebrow="Aba Ceylon Tours & Travels"
        title="Explore Our Curated Travel Packages"
        subtitle="Handcrafted journeys across Sri Lanka's heritage, hills, wildlife, and coastlines."
      />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
