"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/layout/Container";
import vehicles from "@/data/vehicles";
import Image from "next/image";
import { Users, Briefcase } from "lucide-react";
import Link from "next/link";

export default function FleetSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];

      // Staggered reveal when section scrolls into view
      gsap.from(cards, {
        y: 30,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      // Hover effects: scale card and zoom image
      const listeners: Array<() => void> = [];

      cards.forEach((card) => {
        const img = card.querySelector("img") as HTMLElement | null;

        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(card, { scale: 1.02, boxShadow: "0 20px 40px rgba(11,37,69,0.12)", duration: 0.28, ease: "power2.out" }, 0);
        if (img) hoverTl.to(img, { scale: 1.08, duration: 0.5, ease: "power2.out" }, 0);

        const onEnter = () => hoverTl.play();
        const onLeave = () => hoverTl.reverse();

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);

        listeners.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
          hoverTl.kill();
        });
      });

      return () => {
        listeners.forEach((fn) => fn());
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.killTweensOf(cardsRef.current as any);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-amber-400 font-cinzel text-sm">Premium Fleet</p>
          <h2 className="font-cinzel text-3xl text-[#0b2545] font-semibold mt-2">Chauffeured Vehicles</h2>
          <p className="text-slate-500 mt-3">High-end vehicles for seamless travel across Sri Lanka.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v, i) => (
            <Link key={v.id} href={`/fleet/${v.id}`} className="block">
              <article
                ref={(el) => (cardsRef.current[i] = el)}
                className="bg-white rounded-xl shadow-sm overflow-hidden border transform-gpu"
                style={{ willChange: "transform" }}
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={v.imageUrl}
                    alt={v.name}
                    fill
                    className="object-cover transition-transform duration-500"
                    placeholder="empty"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-cinzel text-xl text-[#0b2545] mb-2">{v.name}</h3>
                  <p className="text-neutral-700 text-sm mb-4">{v.shortDescription}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Users size={18} className="text-[#0b2545]" />
                      <span className="text-sm">{v.passengerCapacity} pax</span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-700">
                      <Briefcase size={18} className="text-[#0b2545]" />
                      <span className="text-sm">{v.luggageCapacity} bags</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {v.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-xs text-neutral-600 bg-gray-50 px-2 py-1 rounded">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button className="px-5 py-2 rounded-full font-cinzel text-sm bg-amber-400 text-[#0b2545] hover:opacity-95 transition">
                      Plan Your Journey
                    </button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
