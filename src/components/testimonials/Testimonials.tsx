"use client";

import { useEffect, useState } from "react";
import type { FeedbackRecord } from "@/types/feedback";
import TestimonialsCarousel, { TestimonialItem } from "./TestimonialsCarousel";
import { facebookReviews } from "@/data/facebookReviews";
import { socialLinks } from "@/config/site";
import { SectionKicker, TeardropWatermark } from "@/components/ui/Teardrop";

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
            source: "site" as const,
          })),
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-[var(--navy-deep)] py-20 text-white sm:py-28">
      <TeardropWatermark className="absolute -right-16 -top-10 w-[300px] text-[#e2c27a]/[0.07] sm:w-[380px]" />
      <div className="relative mx-auto mb-12 max-w-[1360px] px-6 text-center lg:px-10" data-reveal>
        <SectionKicker tone="dark" align="center" className="mb-5">In their words</SectionKicker>
        <h2 className="font-cinzel text-4xl leading-[1.1] text-white sm:text-5xl">
          What travellers say.
        </h2>
      </div>

      <TestimonialsCarousel items={[...items, ...facebookReviews]} />

      <div className="mt-10 text-center" data-reveal>
        <a
          href={socialLinks.facebookReviews}
          target="_blank"
          rel="noreferrer"
          className="editorial-link text-[#e2c27a] hover:text-white"
        >
          See all reviews on Facebook
        </a>
      </div>
    </section>
  );
}
