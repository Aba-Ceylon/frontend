"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { routes } from "@/constants/routes";
import { getTopPackages } from "@/lib/packages/getTopPackages";
import { buildGoogleMapsRouteUrl } from "@/lib/maps/buildRouteUrl";
import type { PackageItem } from "@/types/package";

export default function TopPackagesCarousel({
  packages,
}: {
  packages: PackageItem[];
}) {
  const topPackages = getTopPackages(packages, 6);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Clamp activeIndex at render time instead of inside an effect so we never
  // trigger a cascading setState → re-render cycle.
  const clampedIndex = topPackages.length
    ? Math.min(activeIndex, topPackages.length - 1)
    : 0;

  const goTo = useCallback((index: number) => {
    if (!topPackages.length) return;

    const track = trackRef.current;
    if (!track) return;

    const nextIndex = Math.max(0, Math.min(index, topPackages.length - 1));
    const slide = track.children[nextIndex] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [topPackages.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const slides = Array.from(track.children) as HTMLElement[];
      const nearest = slides.reduce(
        (best, slide, index) => {
          const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
          return distance < best.distance ? { index, distance } : best;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      );
      setActiveIndex(nearest.index);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  if (!topPackages.length) {
    return null;
  }

  return (
    <section
      className="section-wash overflow-hidden bg-[#f6f0e6] py-20 text-[#182231] lg:py-28"
      aria-labelledby="top-packages-title"
    >
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 border-b border-[#182231]/12 pb-9 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#A97B17]">
              Explore top picks
            </p>
            <h2
              id="top-packages-title"
              className="mt-4 font-cinzel text-4xl leading-[1.08] sm:text-5xl lg:text-6xl"
            >
              Journeys worth crossing the island for.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#182231]/66">
              Heritage cities, tea-country rails, wild parks, and slow coastal
              days—each route is ready to enjoy as designed or tailor your way.
            </p>
          </div>

          <Link
            href={routes.packages}
            className="inline-flex min-h-11 w-fit items-center gap-3 border-b border-[#A97B17]/70 pb-2 font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#8B6719] transition-colors hover:text-[#182231]"
          >
            View all packages
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-7"
          aria-label="Top tour packages"
        >
          {topPackages.map((pkg, index) => (
            <article
              key={pkg.id}
              className="group relative min-w-[88%] snap-start overflow-hidden border border-white/12 bg-[#101925] sm:min-w-[68%] lg:min-w-[calc(50%-0.875rem)]"
            >
              <div className="relative aspect-[4/5] min-h-[470px] sm:aspect-[16/11] lg:min-h-[560px]">
                <Image
                  src={pkg.image}
                  alt={`${pkg.title} tour through ${pkg.route.join(", ")}`}
                  fill
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 68vw, 48vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#07101D] via-[#07101D]/18 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="font-cinzel text-[10px] uppercase tracking-[0.22em] text-[#F0D99F]">
                      Top pick {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="border border-white/25 bg-[#07101D]/45 px-3 py-2 text-xs backdrop-blur-md">
                      {pkg.duration} · {pkg.km} km
                    </span>
                  </div>

                  <h3 className="font-cinzel text-2xl leading-tight sm:text-3xl">
                    {pkg.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/72 sm:text-base">
                    {pkg.summary}
                  </p>
                  <div className="mt-5 flex flex-col gap-5 border-t border-white/16 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    {(() => {
                      const routeMapsHref = buildGoogleMapsRouteUrl(pkg.route);
                      const routeText = (
                        <>
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D8B45B]" aria-hidden="true" />
                          <span>{pkg.route.slice(0, 3).join(" — ")}</span>
                        </>
                      );

                      return routeMapsHref ? (
                        <a
                          href={routeMapsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 text-xs uppercase tracking-[0.14em] text-white/68 transition hover:text-white"
                        >
                          {routeText}
                        </a>
                      ) : (
                        <p className="flex items-start gap-2 text-xs uppercase tracking-[0.14em] text-white/68">
                          {routeText}
                        </p>
                      );
                    })()}
                    <Link
                      href={`${routes.packages}/${pkg.id}`}
                      className="inline-flex min-h-11 shrink-0 items-center gap-2 font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#F0D99F] transition-colors hover:text-white"
                    >
                      Explore journey
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#182231]/48" aria-live="polite">
            {String(clampedIndex + 1).padStart(2, "0")} / {String(topPackages.length).padStart(2, "0")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(clampedIndex - 1)}
              disabled={clampedIndex === 0}
              aria-label="Previous package"
              className="inline-flex h-12 w-12 items-center justify-center border border-[#182231]/18 text-[#182231] transition hover:border-[#A97B17] hover:bg-white/55 hover:text-[#8B6719] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(clampedIndex + 1)}
              disabled={clampedIndex === topPackages.length - 1}
              aria-label="Next package"
              className="inline-flex h-12 w-12 items-center justify-center border border-[#182231]/18 text-[#182231] transition hover:border-[#A97B17] hover:bg-white/55 hover:text-[#8B6719] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
