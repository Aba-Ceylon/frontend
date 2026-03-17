"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PackageCard from "@/features/packages/PackageCard";
import { packages } from "@/data/packages";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";

const LEN = packages.length;
const cloned = [...packages, ...packages, ...packages];
const GAP = 32;

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 820) return 1;
  if (window.innerWidth < 1180) return 2;
  return 3;
}

export default function FeaturedPckgs() {
  const offset = useRef(LEN);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible] = useState(3);

  const getStep = () => {
    const containerWidth = containerRef.current?.offsetWidth ?? 0;
    const vis = getVisible();
    return (containerWidth - GAP * (vis - 1)) / vis + GAP;
  };

  const snapToOffset = (off: number) => {
    gsap.set(stripRef.current, { x: -(off * getStep()) });
  };

  const slideTo = (direction: 1 | -1) => {
    if (animating.current) return;
    animating.current = true;

    const step = getStep();
    offset.current += direction;
    setDotIndex(((offset.current % LEN) + LEN) % LEN);

    gsap.to(stripRef.current, {
      x: -(offset.current * step),
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

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    dragStartX.current = null;
    if (Math.abs(diff) > 50) slideTo(diff > 0 ? 1 : -1);
  };

  // Init + handle resize
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setVisible(getVisible());
      snapToOffset(LEN);
    });

    const onResize = () => {
      setVisible(getVisible());
      snapToOffset(offset.current);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => slideTo(1), 3000);
    return () => clearInterval(timer);
  }, []);

  const cardWidth = `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  return (
    <section className="py-24 bg-[#F8F4ED]">
      <div className="mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-medium font-cinzel text-neutral-900 mb-4">
            Curated Journeys
          </h2>
          <p className="text-lg font-cinzel text-neutral-600 max-w-2xl mx-auto">
            Explore handcrafted travel experiences across Sri Lanka's heritage,
            hills, and coastlines.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
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
              {cloned.map((pkg, i) => (
                <div key={i} className="flex-shrink-0" style={{ width: cardWidth }}>
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => slideTo(1)}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {packages.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === dotIndex ? "bg-neutral-800 scale-125" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/packages"
            className="inline-flex items-center px-6 py-3 font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:text-black transition"
          >
            View Available Packages <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
