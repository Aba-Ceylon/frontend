"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { packages as fallbackPackages } from "@/data/packages";
import PackageCard from "@/features/packages/PackageCard";
import { fetchPackages } from "@/services/packageService";
import type { PackageItem } from "@/types/package";

const GAP = 32;

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 820) return 1;
  if (window.innerWidth < 1180) return 2;
  return 3;
}

export default function FeaturedPckgs() {
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef(fallbackPackages.length);
  const animating = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const [packageItems, setPackageItems] =
    useState<PackageItem[]>(fallbackPackages);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible] = useState(3);

  const totalPackages = packageItems.length;
  const clonedPackages = useMemo(
    () => [...packageItems, ...packageItems, ...packageItems],
    [packageItems],
  );

  const getStep = () => {
    const containerWidth = containerRef.current?.offsetWidth ?? 0;
    const visibleCards = getVisible();

    return (containerWidth - GAP * (visibleCards - 1)) / visibleCards + GAP;
  };

  const snapToOffset = useCallback((nextOffset: number) => {
    gsap.set(stripRef.current, { x: -(nextOffset * getStep()) });
  }, []);

  const slideTo = useCallback(
    (direction: 1 | -1) => {
      if (!totalPackages || animating.current) {
        return;
      }

      animating.current = true;

      const step = getStep();
      offset.current += direction;
      setDotIndex(
        ((offset.current % totalPackages) + totalPackages) % totalPackages,
      );

      gsap.to(stripRef.current, {
        x: -(offset.current * step),
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          animating.current = false;

          if (offset.current <= 0 || offset.current >= totalPackages * 2) {
            offset.current =
              totalPackages +
              (((offset.current % totalPackages) + totalPackages) %
                totalPackages);
            snapToOffset(offset.current);
          }
        },
      });
    },
    [snapToOffset, totalPackages],
  );

  const onPointerDown = (event: React.PointerEvent) => {
    dragStartX.current = event.clientX;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (dragStartX.current === null) {
      return;
    }

    const difference = dragStartX.current - event.clientX;
    dragStartX.current = null;

    if (Math.abs(difference) > 50) {
      slideTo(difference > 0 ? 1 : -1);
    }
  };

  useEffect(() => {
    let active = true;

    void fetchPackages().then((loadedPackages) => {
      if (!active || !loadedPackages.length) {
        return;
      }

      setDotIndex(0);
      setPackageItems(loadedPackages);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    offset.current = totalPackages;

    const animationFrame = requestAnimationFrame(() => {
      snapToOffset(totalPackages);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [snapToOffset, totalPackages]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setVisible(getVisible());
      snapToOffset(offset.current);
    });

    const onResize = () => {
      setVisible(getVisible());
      snapToOffset(offset.current);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
    };
  }, [snapToOffset]);

  useEffect(() => {
    if (!totalPackages) {
      return;
    }

    const timer = setInterval(() => slideTo(1), 3000);

    return () => {
      clearInterval(timer);
    };
  }, [slideTo, totalPackages]);

  const cardWidth = `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  return (
    <section className="py-24 bg-[#F5F2ED]">
      <div className="mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-medium font-cinzel text-neutral-900 mb-4">
            Curated Journeys
          </h2>
          <p className="text-lg font-cinzel text-neutral-600 max-w-2xl mx-auto">
            Explore handcrafted travel experiences across Sri Lanka&apos;s
            heritage, hills, and coastlines.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
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
              {clonedPackages.map((pkg, index) => (
                <div
                  key={`${pkg.id}-${index}`}
                  className="shrink-0"
                  style={{ width: cardWidth }}
                >
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => slideTo(1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {packageItems.map((pkg, index) => (
            <span
              key={pkg.id}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === dotIndex
                  ? "bg-neutral-800 scale-125"
                  : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/packages"
            className="inline-flex items-center px-6 py-3 font-cinzel text-neutral-800 hover:text-[#C99A2B] drop-shadow-[0_0_30px_rgba(201,154,43,0.38)]"
          >
            View Available Packages
            <LucideArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
