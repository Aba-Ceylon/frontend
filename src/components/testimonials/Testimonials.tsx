"use client";

import { useEffect, useState } from "react";
import type { FeedbackRecord } from "@/types/feedback";
import TestimonialsCarousel, { TestimonialItem } from "./TestimonialsCarousel";

const STATS = [
  { value: "5.0", label: "Average rating" },
  { value: "100%", label: "Direct service" },
  { value: "24h", label: "Typical reply" },
];

export default function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/feedback/published", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: FeedbackRecord[]) => {
        if (!Array.isArray(data)) {
          return;
        }
        setItems(
          data.map((row) => ({
            quote: row.message,
            name: row.user_name ?? "Guest",
            rating: row.rating ?? 5,
          })),
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto mb-14 max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-8 border-b border-[#182231]/10 pb-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#C99A2B]">
              Traveller stories
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl lg:text-[3.4rem]">
              Trusted in the details, not just the photographs.
            </h2>
          </div>

          <div data-reveal>
            <p
              className="text-base leading-8 text-[#182231]/66"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              Real feedback from travellers who used the route planning,
              chauffeur support, and on-the-ground coordination behind these
              journeys.
            </p>
            <div className="mt-8 grid grid-cols-3 border border-[#182231]/10">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-r border-[#182231]/10 px-4 py-5 last:border-r-0">
                  <p className="font-cinzel text-2xl text-[#182231]">{stat.value}</p>
                  <p
                    className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#182231]/52"
                    style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TestimonialsCarousel items={items} />

      <div className="mx-auto mt-10 max-w-[1360px] px-6 lg:px-10" data-reveal>
        <p
          className="text-center text-sm text-[#182231]/54"
          style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
        >
          Reviews shown here come from published traveller feedback collected
          after completed journeys.
        </p>
      </div>
    </section>
  );
}
