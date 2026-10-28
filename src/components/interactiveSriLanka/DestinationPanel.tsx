"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Check, MapPin, Sparkles, X } from "lucide-react";
import { Destination } from "@/types/destination";
import { routes } from "@/constants/routes";
import { getMapLegendCategory, mapCategoryStyles } from "./mapCategoryUtils";

interface DestinationPanelProps {
  destination: Destination;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const BODY = { fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif' };

/**
 * Destination details over the map: a right-hand drawer on desktop and a
 * bottom sheet on mobile. Fixed to the viewport so the navbar never covers it.
 */
export default function DestinationPanel({
  destination,
  onClose,
  actionLabel,
  onAction,
}: DestinationPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const displayCategory = getMapLegendCategory(destination);
  const categoryStyle = mapCategoryStyles[displayCategory];
  const image = destination.images?.[0];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-[65] bg-[#0a0f18]/40 backdrop-blur-[2px] animate-[panel-fade_0.3s_ease-out] lg:bg-[#0a0f18]/20"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="destination-panel-title"
        className="fixed inset-x-0 bottom-0 z-[66] flex max-h-[88dvh] flex-col bg-[#FBF8F2] shadow-[0_-20px_60px_rgba(10,15,24,0.35)] animate-[panel-up_0.4s_cubic-bezier(0.16,1,0.3,1)] lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[460px] lg:shadow-[-20px_0_60px_rgba(10,15,24,0.3)] lg:animate-[panel-left_0.45s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Drag-handle cue for the mobile sheet */}
        <div className="flex justify-center pb-1 pt-3 lg:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-[#182231]/20" />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-[#182231]/70 text-white backdrop-blur-sm transition-colors hover:bg-[#182231] lg:right-4 lg:top-4"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {image ? (
            <div className="relative mx-4 aspect-[16/9] overflow-hidden lg:mx-0">
              <Image
                src={image}
                alt={destination.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 460px"
              />
            </div>
          ) : (
            <div className={`mx-4 h-1.5 lg:mx-0 ${categoryStyle.bgClass}`} />
          )}

          <div className="px-5 pb-6 pt-5 lg:px-7 lg:pt-7">
            <span
              className={`inline-flex px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${categoryStyle.softClass}`}
              style={BODY}
            >
              {displayCategory}
            </span>

            <h2
              id="destination-panel-title"
              className="mt-4 pr-12 font-cinzel text-3xl leading-tight text-[#182231] lg:text-[2rem]"
            >
              {destination.name}
            </h2>

            <p
              className="mt-2 flex items-center gap-1.5 text-sm text-[#182231]/60"
              style={BODY}
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#9b7422]" />
              {[destination.district, destination.region].filter(Boolean).join(", ")}
            </p>

            <p className="mt-5 text-[15px] leading-7 text-[#182231]/80" style={BODY}>
              {destination.description}
            </p>

            {destination.highlights.length ? (
              <section className="mt-7">
                <h3 className="font-cinzel text-lg text-[#182231]">Highlights</h3>
                <ul className="mt-3 space-y-3" style={BODY}>
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex gap-3 text-sm leading-6 text-[#182231]/78">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#9b7422]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-7 grid gap-px bg-[#182231]/10 sm:grid-cols-2 lg:grid-cols-1">
              {destination.bestTimeToVisit ? (
                <div className="bg-white p-4">
                  <p className="flex items-center gap-2 font-cinzel text-sm text-[#182231]">
                    <CalendarDays className="h-4 w-4 text-[#9b7422]" />
                    Best time to visit
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#182231]/72" style={BODY}>
                    {destination.bestTimeToVisit}
                  </p>
                </div>
              ) : null}
              {destination.whyVisit ? (
                <div className="bg-white p-4">
                  <p className="flex items-center gap-2 font-cinzel text-sm text-[#182231]">
                    <Sparkles className="h-4 w-4 text-[#9b7422]" />
                    Why visit
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#182231]/72" style={BODY}>
                    {destination.whyVisit}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[#182231]/10 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:p-5">
          {onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="col-span-2 inline-flex min-h-12 items-center justify-center bg-[#182231] px-4 font-cinzel text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#243142]"
            >
              {actionLabel || "Add to planner"}
            </button>
          ) : (
            <>
              <Link
                href={`${routes.destinations}/${destination.slug}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#182231]/20 px-3 font-cinzel text-[11px] uppercase tracking-[0.16em] text-[#182231] transition hover:bg-[#182231]/5"
              >
                Details <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={routes.planner}
                className="inline-flex min-h-12 items-center justify-center bg-[#182231] px-3 font-cinzel text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-[#243142]"
              >
                Plan a trip
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
