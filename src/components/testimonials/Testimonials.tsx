"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import Container from "@/components/layout/Container";
import type { FeedbackRecord } from "@/types/feedback";
import TestimonialsCarousel, { TestimonialItem } from "./TestimonialsCarousel";

export default function Testimonials() {
  const { t } = useI18n();
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/feedback/published", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: FeedbackRecord[]) => {
        if (!Array.isArray(data)) return;
        setItems(
          data.map((row) => ({
            quote: `"${row.message}"`,
            name: row.user_name ?? "Guest",
            rating: row.rating ?? 5,
          })),
        );
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-[#1A2238] overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-cinzel text-3xl font-semibold text-[#C99A2B] drop-shadow-[0_0_30px_rgba(201,154,43,0.38)]">
            {t("home.testimonials.title")}
          </h2>
          <p className="font-cinzel text-white mt-2">
            {t("home.testimonials.description")}
          </p>
        </div>
      </Container>
      <TestimonialsCarousel items={items} />
    </section>
  );
}
