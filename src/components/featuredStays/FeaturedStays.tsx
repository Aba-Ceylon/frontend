"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import StayCard from "@/features/stays/StayCard";
import { useI18n } from "@/components/i18n/I18nProvider";
import SectionHeader from "@/components/ui/SectionHeader";
import { useCarousel } from "@/hooks/useCarousel";
import { stays as fallbackStays } from "@/data/stays";
import { fetchStays } from "@/services/stayService";
import type { Stay } from "@/types/stay";

export default function FeaturedStays() {
  const { t } = useI18n();
  const [stayItems, setStayItems] = useState<Stay[]>(fallbackStays);

  useEffect(() => {
    let active = true;
    void fetchStays().then((loaded) => {
      if (!active || !loaded.length) return;
      setStayItems(loaded);
    });
    return () => { active = false; };
  }, []);

  const { stripRef, containerRef, cloned, dotIndex, cardWidth, gap, slideTo, onPointerDown, onPointerUp } =
    useCarousel({ items: stayItems, gap: 24, autoPlayMs: 3500 });

  return (
    <section className="py-24 bg-[#1A2238]">
      <div className="mx-auto px-6">
        <SectionHeader
          title={t("home.stays.title")}
          description={t("home.stays.description")}
          titleClassName="text-5xl font-medium font-cinzel text-[#C99A2B] drop-shadow-[0_0_30px_rgba(201,154,43,0.38)]"
          descriptionClassName="text-lg font-cinzel text-amber-50/70"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-amber-400/30 text-amber-400 hover:bg-amber-400/10 transition cursor-pointer"
            aria-label={t("home.stays.previous")}
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
              {cloned.map((stay, i) => (
                <div key={`${stay.id}-${i}`} className="shrink-0" style={{ width: cardWidth }}>
                  <StayCard stay={stay} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => slideTo(1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-amber-400/30 text-amber-400 hover:bg-amber-400/10 transition cursor-pointer"
            aria-label={t("home.stays.next")}
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {stayItems.map((stay, i) => (
            <span
              key={stay.id}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === dotIndex ? "bg-amber-400 scale-125" : "bg-amber-400/25"}`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/stays" className="inline-flex items-center px-6 py-3 font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(201,154,43,0.5)] hover:text-white transition">
            {t("home.stays.viewAll")}
            <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
