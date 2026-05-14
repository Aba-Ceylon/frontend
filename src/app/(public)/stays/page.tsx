"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/components/i18n/I18nProvider";
import PageHero from "@/components/ui/PageHero";
import StayCard from "@/features/stays/StayCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { stays as fallbackStays } from "@/data/stays";
import { fetchStays } from "@/services/stayService";
import type { Stay } from "@/types/stay";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

export default function StaysPage() {
  const { t } = useI18n();
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [stayItems, setStayItems] = useState<Stay[]>(fallbackStays);

  const totalPages = Math.max(1, Math.ceil(stayItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginatedStays = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return stayItems.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, stayItems]);

  useEffect(() => {
    let active = true;
    void fetchStays().then((loaded) => {
      if (!active || !loaded.length) return;
      setStayItems(loaded);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
    if (!cards.length) return;
    gsap.fromTo(cards, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
  }, [paginatedStays]);

  const handlePageChange = useCallback((p: number) => setPage(p), []);

  return (
    <div className="bg-noise bg-[#F5F2ED] min-h-screen">
      <PageHero
        imageSrc="/staysbanner.png"
        imageAlt="Curated Heritage Stays"
        eyebrow="Aba Ceylon Tours & Travels"
        title={t("stays.pageTitle")}
        subtitle={t("stays.pageSubtitle")}
      />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedStays.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
