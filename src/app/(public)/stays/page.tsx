"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stays } from "@/data/stays";
import StayCard from "@/features/stays/StayCard";

gsap.registerPlugin(ScrollTrigger);

export default function StaysPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade-in + slide up
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Card stagger
      const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 60 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#F5F2ED] min-h-screen pt-24 pb-24">
      <section ref={sectionRef} className="animate-section max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-4xl sm:text-5xl font-medium text-neutral-900 mb-4">
            Curated Heritage Stays
          </h1>
          <p className="font-cinzel text-lg text-neutral-500">
            Architectural elegance meets natural serenity
          </p>
        </div>

        {/* Card Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stays.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>
      </section>
    </main>
  );
}
