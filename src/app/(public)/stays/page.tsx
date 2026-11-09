"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageHero from "@/components/ui/PageHero";
import ListingIntro, { ResultCount } from "@/components/ui/ListingIntro";
import StayCard from "@/features/stays/StayCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { stays as fallbackStays } from "@/data/stays";
import { fetchStays } from "@/services/stayService";
import type { Stay } from "@/types/stay";

const ITEMS_PER_PAGE = 6;

export default function StaysPage() {
  const gridRef = useRef<HTMLElement>(null);
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

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <PageHero
        imageSrc="/staysbanner.png"
        imageAlt="Curated heritage stays in Sri Lanka"
        eyebrow="Where you'll rest"
        title="Stays"
        subtitle="Eco lodges, boutique villas and heritage hotels, chosen to suit the route."
      />
      <section ref={gridRef} className="mx-auto max-w-[1360px] scroll-mt-24 px-6 py-16 lg:px-10 lg:py-24">
        <ListingIntro
          kicker="Hand-picked"
          title="Places with character."
          description="We stay in these ourselves before we recommend them. Open one to see photos, amenities and where it sits on the map."
          aside={<ResultCount count={stayItems.length} noun="stay" />}
        />
        <div key={currentPage} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10" data-reveal-stagger>
          {paginatedStays.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
    </div>
  );
}
