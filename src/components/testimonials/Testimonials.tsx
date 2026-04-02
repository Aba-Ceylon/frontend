"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import TestimonialsCarousel, { TestimonialItem } from "./TestimonialsCarousel";

export default function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/feedback/published")
      .then((r) => r.json())
      .then((data: { message: string; user_name: string; rating: number }[]) => {
        if (!Array.isArray(data)) return;
        setItems(
          data.map((row) => ({
            quote: `"${row.message}"`,
            name: row.user_name ?? "Guest",
            rating: row.rating ?? 5,
          }))
        );
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-[#1A2238] overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-semibold font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(217,119,6,0.5)]">
            Traveler Stories
          </h2>
          <p className="font-cinzel text-white mt-2">
            What our guests say about their heritage journey
          </p>
        </div>
      </Container>
      <TestimonialsCarousel items={items} />
    </section>
  );
}
