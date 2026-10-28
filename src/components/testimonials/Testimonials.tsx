"use client";

import { useEffect, useState } from "react";
import type { FeedbackRecord } from "@/types/feedback";
import TestimonialsCarousel, { TestimonialItem } from "./TestimonialsCarousel";

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
      <div className="mx-auto mb-12 max-w-[1360px] px-6 text-center lg:px-10" data-reveal>
        <h2 className="font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">
          What travellers say.
        </h2>
      </div>

      <TestimonialsCarousel items={items} />
    </section>
  );
}
