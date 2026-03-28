"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import vehicles from "@/data/vehicles";
import Image from "next/image";
import { Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";

const LEN = vehicles.length;
const cloned = [...vehicles, ...vehicles, ...vehicles];
const GAP = 24;

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 820) return 1;
  if (window.innerWidth < 1180) return 2;
  return 3;
}

export default function FleetSection() {
  const offset = useRef(LEN);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible] = useState(3);

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
      duration: 0.8,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Slower autoplay than Curated Journeys for a calmer horizontal motion.
    const timer = setInterval(() => slideTo(1), 5200);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardWidth = `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  return (
    <section id="fleet" className="py-24 bg-[#1A2238] overflow-hidden">
      <div className="mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-medium font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(217,119,6,0.5)] mb-4">
            Premium Fleet
          </h2>
          <p className="text-lg font-cinzel text-amber-50/70 max-w-2xl mx-auto">
            Chauffeured luxury vehicles for seamless journeys across Sri Lanka.
          </p>
        </div>

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
              {cloned.map((v, i) => (
                <div key={`${v.id}-${i}`} className="shrink-0" style={{ width: cardWidth }}>
                  <Link href={`/fleet/${v.id}`} className="block h-full">
                    <article className="h-full min-h-105 bg-white rounded-xl shadow-sm overflow-hidden border border-white/30 flex flex-col">
                      <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                        <Image
                          src={v.imageUrl}
                          alt={v.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          placeholder="empty"
                        />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-cinzel text-xl text-[#0b2545] mb-2">{v.name}</h3>
                        <p className="text-neutral-700 text-sm mb-4 line-clamp-2">{v.shortDescription}</p>

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

                        <div className="mt-auto pt-4 flex justify-center">
                          <span className="inline-flex w-full max-w-xs justify-center px-6 py-3 rounded-full font-cinzel text-sm bg-amber-400 text-[#0b2545] hover:opacity-95 transition">
                            View More Details
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
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

        <div className="flex justify-center gap-2 mt-6">
          {vehicles.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === dotIndex ? "bg-amber-400 scale-125" : "bg-amber-400/25"
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/fleet"
            className="inline-flex items-center px-6 py-3 font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:text-white transition"
          >
            Explore Full Fleet
            <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
