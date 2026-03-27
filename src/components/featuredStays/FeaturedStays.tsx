"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { stays } from "@/data/stays";
import StayCard from "@/features/stays/StayCard";

const LEN = stays.length;
const cloned = [...stays, ...stays, ...stays];
const GAP = 24;

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 820) return 1;
  if (window.innerWidth < 1180) return 2;
  return 3;
}

export default function FeaturedStays() {
  const offset       = useRef(LEN);
  const stripRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animating    = useRef(false);
  const dragStartX   = useRef<number | null>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible]   = useState(3);

  const getStep = () => {
    const w = containerRef.current?.offsetWidth ?? 0;
    const vis = getVisible();
    return (w - GAP * (vis - 1)) / vis + GAP;
  };

  const snapToOffset = (off: number) => {
    gsap.set(stripRef.current, { x: -(off * getStep()) });
  };

  const slideTo = (direction: 1 | -1) => {
    if (animating.current) return;
    animating.current = true;
    offset.current += direction;
    setDotIndex(((offset.current % LEN) + LEN) % LEN);
    gsap.to(stripRef.current, {
      x: -(offset.current * getStep()),
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        animating.current = false;
        if (offset.current <= 0 || offset.current >= LEN * 2) {
          offset.current = LEN + (((offset.current % LEN) + LEN) % LEN);
          snapToOffset(offset.current);
        }
      },
    });
  };

  const onPointerDown = (e: React.PointerEvent) => { dragStartX.current = e.clientX; };
  const onPointerUp   = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    dragStartX.current = null;
    if (Math.abs(diff) > 50) slideTo(diff > 0 ? 1 : -1);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setVisible(getVisible());
      snapToOffset(LEN);
    });
    const onResize = () => { setVisible(getVisible()); snapToOffset(offset.current); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => slideTo(1), 3500);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardWidth = `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  return (
    <section className="py-24 bg-[#1A2238]">
      <div className="mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-medium font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(217,119,6,0.5)] mb-4">
            Accommodation in Sri Lanka
          </h2>
          <p className="text-lg font-cinzel text-amber-50/70 max-w-2xl mx-auto">
            Stay within the story of Sri Lanka, not outside it
          </p>
        </div>

        {/* Carousel */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-amber-400/30 text-amber-400 hover:bg-amber-400/10 transition cursor-pointer"
          >
            <LucideArrowLeft size={16} />
          </button>

          <div
            ref={containerRef}
            className="relative overflow-hidden flex-1 cursor-grab active:cursor-grabbing select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div ref={stripRef} className="flex" style={{ gap: GAP, willChange: "transform" }}>
              {cloned.map((stay, i) => (
                <div key={i} className="shrink-0" style={{ width: cardWidth }}>
                  <StayCard stay={stay} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => slideTo(1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-amber-400/30 text-amber-400 hover:bg-amber-400/10 transition cursor-pointer"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {stays.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === dotIndex ? "bg-amber-400 scale-125" : "bg-amber-400/25"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/stays"
            className="inline-flex items-center px-6 py-3 font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:text-white transition"
          >
            Discover All Stays
            <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
