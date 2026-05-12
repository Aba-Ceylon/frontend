"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import PackageCard from "@/features/packages/PackageCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useCarousel } from "@/hooks/useCarousel";
import { packages as fallbackPackages } from "@/data/packages";
import { fetchPackages } from "@/services/packageService";
import type { PackageItem } from "@/types/package";

export default function FeaturedPckgs() {
  const [packageItems, setPackageItems] = useState<PackageItem[]>(fallbackPackages);

  useEffect(() => {
    let active = true;
    void fetchPackages().then((loaded) => {
      if (!active || !loaded.length) return;
      setPackageItems(loaded);
    });
    return () => { active = false; };
  }, []);

  const { stripRef, containerRef, cloned, dotIndex, cardWidth, gap, slideTo, onPointerDown, onPointerUp } =
    useCarousel({ items: packageItems, gap: 32, autoPlayMs: 3000 });

  return (
    <section className="py-24 bg-[#F5F2ED]">
      <div className="mx-auto px-6">
        <SectionHeader
          title="Curated Journeys"
          description="Explore handcrafted travel experiences across Sri Lanka's heritage, hills, and coastlines."
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
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
              {cloned.map((pkg, i) => (
                <div key={`${pkg.id}-${i}`} className="shrink-0" style={{ width: cardWidth }}>
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => slideTo(1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Next"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {packageItems.map((pkg, i) => (
            <span
              key={pkg.id}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === dotIndex ? "bg-neutral-800 scale-125" : "bg-neutral-300"}`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/packages" className="inline-flex items-center px-6 py-3 font-cinzel text-neutral-800 hover:text-[#C99A2B] drop-shadow-[0_0_30px_rgba(201,154,43,0.38)]">
            View Available Packages
            <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
