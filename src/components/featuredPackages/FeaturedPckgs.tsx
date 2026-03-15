"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PackageCard from "@/features/packages/PackageCard";
import { packages } from "@/data/packages";

const LEN = packages.length;
const cloned = [...packages, ...packages, ...packages];
const GAP = 32;

function getVisible() {
  if (typeof window === "undefined") return 3;
  return window.innerWidth < 768 ? 1 : 3;
}

export default function FeaturedPckgs() {
  const offset = useRef(LEN);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
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

  // Init + handle resize
  useEffect(() => {
    const init = () => {
      const vis = getVisible();
      setVisible(vis);
      snapToOffset(LEN);
    };

    const raf = requestAnimationFrame(init);

    const onResize = () => {
      const vis = getVisible();
      setVisible(vis);
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-medium font-cinzel text-neutral-900 mb-4">
            Curated Journeys
          </h2>
          <p className="text-lg font-cinzel text-neutral-600 max-w-2xl mx-auto">
            Explore handcrafted travel experiences across Sri Lanka's heritage,
            hills, and coastlines.
          </p>
        </div>

        <div ref={containerRef} className="relative overflow-hidden">
          <div ref={stripRef} className="flex" style={{ gap: GAP, willChange: "transform" }}>
            {cloned.map((pkg, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: cardWidth }}>
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => slideTo(-1)}
            className="px-5 py-2 font-cinzel rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
          >
            ← Prev
          </button>
          <div className="flex gap-2 self-center">
            {packages.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === dotIndex ? "bg-neutral-800 scale-125" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => slideTo(1)}
            className="px-5 py-2 font-cinzel rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
