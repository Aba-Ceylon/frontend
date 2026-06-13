"use client";

import { useEffect, useState } from "react";
import type { FeedbackRecord } from "@/types/feedback";
import TestimonialsCarousel, { TestimonialItem } from "./TestimonialsCarousel";

const STATS = [
  { value: "5.0", label: "Average Rating", sub: "Across all reviews" },
  { value: "100%", label: "Personal Service", sub: "No call centres" },
  { value: "24h", label: "Response Time", sub: "WhatsApp or email" },
];

export default function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/feedback/published", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: FeedbackRecord[]) => {
        if (!Array.isArray(data)) return;
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
    <section className="bg-[#F5F2ED] py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-14">

        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-amber-500/50" />
              <p className="font-cinzel text-[11px] uppercase tracking-[0.45em] text-amber-700/80">
                Traveller Stories
              </p>
            </div>
            <h2 className="font-cinzel text-4xl sm:text-5xl text-[#0F172A] leading-[1.15]">
              What our people<br className="hidden sm:block" /> say about us
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p
              className="text-base leading-7 text-neutral-500 lg:text-right lg:max-w-sm"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              Real words from real travellers. Every review is from a guest who
              travelled with us — unedited, unfiltered.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 sm:gap-10">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  <div className="text-center lg:text-right">
                    <p className="font-cinzel text-2xl text-[#0F172A]">{s.value}</p>
                    <p
                      className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-neutral-400"
                      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                    >
                      {s.label}
                    </p>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="h-8 w-px bg-neutral-300/60" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-200" />
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
            <div className="h-1 w-1 rounded-full bg-amber-400/30" />
          </div>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>
      </div>

      {/* Two-row marquee */}
      <TestimonialsCarousel items={items} />

      {/* Bottom note */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-10">
        <p
          className="text-center text-sm text-neutral-400"
          style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
        >
          All reviews are submitted by verified travellers after completing their journey with Aba Ceylon.
        </p>
      </div>
    </section>
  );
}
