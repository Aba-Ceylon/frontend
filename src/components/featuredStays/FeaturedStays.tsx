"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import StayCard from "@/features/stays/StayCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useCarousel } from "@/hooks/useCarousel";
import { stays as fallbackStays } from "@/data/stays";
import { fetchStays } from "@/services/stayService";
import type { Stay } from "@/types/stay";

export default function FeaturedStays() {
  const [stayItems, setStayItems] = useState<Stay[]>(fallbackStays);

  useEffect(() => {
    let active = true;
    void fetchStays().then((loaded) => {
      if (!active || !loaded.length) {
        return;
      }
      setStayItems(loaded);
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
  } = useCarousel({ items: stayItems, gap: 24, autoPlayMs: 3500 });

  return (
    <section className="ink-grid py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-end lg:gap-10">
          <div data-reveal>
            <SectionHeader
              eyebrow="Accommodation"
              align="left"
              title="Places that hold the mood of the island."
              description="Boutique stays, heritage houses, and retreat-style escapes selected for atmosphere, location, and how they fit the route."
              titleClassName="font-cinzel text-4xl font-medium leading-tight text-[#182231] sm:text-5xl lg:text-[3.45rem]"
              descriptionClassName="mx-auto max-w-2xl text-base leading-8 text-[#445062] sm:text-lg"
              className="mb-0"
            />

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => slideTo(-1)}
                className="flex h-11 w-11 items-center justify-center border border-[#182231]/12 text-[#182231] transition hover:bg-[#182231] hover:text-white"
                aria-label="Previous"
              >
                <LucideArrowLeft size={16} />
              </button>
              <button
                onClick={() => slideTo(1)}
                className="flex h-11 w-11 items-center justify-center border border-[#182231]/12 text-[#182231] transition hover:bg-[#182231] hover:text-white"
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
                {cloned.map((stay, i) => (
                  <div
                    key={`${stay.id}-${i}`}
                    className="max-w-full shrink-0"
                    style={{ width: cardWidth, minWidth: cardWidth }}
                  >
                    <StayCard stay={stay} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center justify-between gap-5 sm:flex-row">
              <div className="flex gap-2">
                {stayItems.map((stay, i) => (
                  <span
                    key={stay.id}
                    className={`h-2.5 transition-all ${
                      i === dotIndex ? "w-8 bg-[#C99A2B]" : "w-2.5 bg-[#182231]/18"
                    }`}
                  />
                ))}
              </div>

              <Link href="/stays" className="editorial-link text-[#182231]">
                Discover all stays
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
