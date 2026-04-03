"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import FleetDetailModal from "./FleetDetailModal";
import Image from "next/image";
import { Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import type { FleetVehicle } from "@/types/vehicle";
import { fetchVehiclesPage } from "@/services/fleetService";

const GAP = 24;
const HOME_FLEET_ITEMS = 8;

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 820) return 1;
  if (window.innerWidth < 1180) return 2;
  return 3;
}

export default function FleetSection() {
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const animating = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const len = fleetVehicles.length;
  const cloned = useMemo(
    () => [...fleetVehicles, ...fleetVehicles, ...fleetVehicles],
    [fleetVehicles],
  );

  const getStep = () => {
    const w = containerRef.current?.offsetWidth ?? 0;
    const vis = getVisible();
    return (w - GAP * (vis - 1)) / vis + GAP;
  };

  const snapToOffset = (off: number) => {
    gsap.set(stripRef.current, { x: -(off * getStep()) });
  };

  const slideTo = (direction: 1 | -1) => {
    if (len <= 1) return;
    if (animating.current) return;
    animating.current = true;
    offset.current += direction;
    setDotIndex(((offset.current % len) + len) % len);

    gsap.to(stripRef.current, {
      x: -(offset.current * getStep()),
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        animating.current = false;
        if (offset.current <= 0 || offset.current >= len * 2) {
          offset.current = len + (((offset.current % len) + len) % len);
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
    let active = true;

    async function loadHomeFleet() {
      setIsLoading(true);
      setError(null);

      try {
        const { vehicles } = await fetchVehiclesPage(1, HOME_FLEET_ITEMS);
        if (!active) {
          return;
        }

        setFleetVehicles(vehicles);
        setDotIndex(0);
      } catch (err) {
        if (!active) {
          return;
        }
        const message =
          err instanceof Error ? err.message : "Failed to load fleet section.";
        setError(message);
        setFleetVehicles([]);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadHomeFleet();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!len) {
      offset.current = 0;
      return;
    }

    offset.current = len;
    const raf = requestAnimationFrame(() => {
      setVisible(getVisible());
      snapToOffset(offset.current);
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
  }, [len]);

  useEffect(() => {
    if (len <= 1) return;
    // Slower autoplay than Curated Journeys for a calmer horizontal motion.
    const timer = setInterval(() => slideTo(1), 5200);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  const cardWidth = `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  useEffect(() => undefined, []);

  // Inline modal logic removed â€” FleetDetailModal handles its own animations and keyboard

  return (
    <section id="fleet" className="overflow-hidden bg-[#F5F2ED] py-24">
      <div className="mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-5xl font-medium font-cinzel text-neutral-900">
            Premium Fleet
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-cinzel text-neutral-600">
            Chauffeured luxury vehicles for seamless journeys across Sri Lanka.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            disabled={len <= 1}
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-40 md:flex"
          >
            <LucideArrowLeft size={16} />
          </button>

          <div
            ref={containerRef}
            className="relative overflow-hidden flex-1 cursor-grab active:cursor-grabbing select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div
              ref={stripRef}
              className="flex"
              style={{ gap: GAP, willChange: "transform" }}
            >
              {cloned.map((v, i) => (
                <div
                  key={`${v.id}-${i}`}
                  className="shrink-0"
                  style={{ width: cardWidth }}
                >
                  <Link href={`/fleet/${v.id}`} className="block h-full">
                    <article className="min-h-75 flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm md:min-h-105">
                      <div className="relative h-44 md:h-52 w-full bg-gray-100 overflow-hidden">
                        <Image
                          src={v.imageUrl}
                          alt={v.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          placeholder="empty"
                        />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-cinzel text-lg md:text-xl text-[#0b2545] mb-2">
                          {v.name}
                        </h3>
                        <p className="text-neutral-700 text-sm mb-4 line-clamp-2">
                          {v.shortDescription}
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-neutral-700">
                            <Users size={18} className="text-[#0b2545]" />
                            <span className="text-sm">
                              {v.passengerCapacity} pax
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-neutral-700">
                            <Briefcase size={18} className="text-[#0b2545]" />
                            <span className="text-sm">
                              {v.luggageCapacity} bags
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {v.features.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-xs text-neutral-600 bg-gray-50 px-2 py-1 rounded"
                            >
                              {f}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-4 flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setSelectedId(v.id);
                            }}
                            className="fleet-cta inline-flex w-full max-w-full justify-center rounded-lg bg-gradient-to-br from-slate-900/95 to-slate-800/95 px-6 py-3 font-cinzel text-sm text-white transition md:max-w-xs"
                            aria-expanded={!!selectedId}
                          >
                            View More Details
                          </button>
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
            disabled={len <= 1}
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-40 md:flex"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        {isLoading && (
          <p className="mt-6 text-center text-sm text-neutral-600">
            Loading fleet...
          </p>
        )}
        {!isLoading && error && (
          <p className="mt-6 text-center text-sm text-red-300">{error}</p>
        )}
        {!isLoading && !error && len === 0 && (
          <p className="mt-6 text-center text-sm text-neutral-600">
            No fleet vehicles available right now.
          </p>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {fleetVehicles.map((_, i) => (
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
            href="/fleet"
            className="inline-flex items-center px-6 py-3 font-cinzel text-neutral-800 transition hover:text-[#C99A2B] drop-shadow-[0_0_30px_rgba(201,154,43,0.38)]"
          >
            Explore Full Fleet
            <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>

      {selectedId && (
        <FleetDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}
