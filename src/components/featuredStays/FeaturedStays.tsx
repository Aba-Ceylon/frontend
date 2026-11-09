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
    onClickCapture,
  } = useCarousel({ items: stayItems, gap: 24, autoPlayMs: 3500, maxVisible: 2 });

  return (
    <section className="overflow-hidden bg-[var(--navy-deep)] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-end lg:gap-10">
          <div data-reveal>
            <SectionHeader
              align="left"
              tone="dark"
              eyebrow="Where you'll rest"
              title="Stays with character."
              description="Eco lodges, boutique villas and heritage hotels we have stayed in ourselves."
              className="mb-0"
            />

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => slideTo(-1)}
                className="round-btn round-btn-dark"
                type="button"
                aria-label="Previous stay"
              >
                <LucideArrowLeft size={16} />
              </button>
              <button
                onClick={() => slideTo(1)}
                className="round-btn round-btn-dark"
                type="button"
                aria-label="Next stay"
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
              onClickCapture={onClickCapture}
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
                    className={`h-1.5 rounded-full transition-all ${
                      i === dotIndex ? "w-8 bg-[#e2c27a]" : "w-1.5 bg-white/25"
                    }`}
                  />
                ))}
              </div>

              <Link href="/stays" className="editorial-link text-[#e2c27a] hover:text-white">
                Discover all stays
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
