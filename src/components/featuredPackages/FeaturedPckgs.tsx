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
      if (!active || !loaded.length) {
        return;
      }
      setPackageItems(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  const {
    stripRef,
    containerRef,
    cloned,
    dotIndex,
    cardWidth,
    gap,
    slideTo,
    onPointerDown,
    onPointerUp,
  } = useCarousel({ items: packageItems, gap: 32, autoPlayMs: 3400 });

  return (
    <section className="cream-grid py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-end lg:gap-10">
          <div data-reveal>
            <SectionHeader
              eyebrow="Curated journeys"
              align="left"
              title="Sri Lanka itineraries with a stronger sense of place."
              description="Explore tailored routes shaped around atmosphere, travel rhythm, and the parts of the island that fit together naturally."
              className="mb-0"
            />

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => slideTo(-1)}
                className="flex h-11 w-11 items-center justify-center border border-[#101A28]/14 text-[#101A28] transition hover:bg-[#101A28] hover:text-white"
                aria-label="Previous"
              >
                <LucideArrowLeft size={16} />
              </button>
              <button
                onClick={() => slideTo(1)}
                className="flex h-11 w-11 items-center justify-center border border-[#101A28]/14 text-[#101A28] transition hover:bg-[#101A28] hover:text-white"
                aria-label="Next"
              >
                <LucideArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="min-w-0" data-reveal>
            <div
              ref={containerRef}
              className="relative overflow-hidden cursor-grab select-none active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <div ref={stripRef} className="flex" style={{ gap, willChange: "transform" }}>
                {cloned.map((pkg, i) => (
                  <div
                    key={`${pkg.id}-${i}`}
                    className="max-w-full shrink-0"
                    style={{ width: cardWidth, minWidth: cardWidth }}
                  >
                    <PackageCard pkg={pkg} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center justify-between gap-5 sm:flex-row">
              <div className="flex gap-2">
                {packageItems.map((pkg, i) => (
                  <span
                    key={pkg.id}
                    className={`h-2.5 transition-all ${
                      i === dotIndex ? "w-8 bg-[#101A28]" : "w-2.5 bg-[#101A28]/18"
                    }`}
                  />
                ))}
              </div>

              <Link href="/packages" className="editorial-link text-[#101A28]">
                View all packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
