"use client";

import { useEffect } from "react";
import GoogleLocationMap from "@/components/maps/GoogleLocationMap";
import type { Destination } from "@/types/destination";

function formatCoordinate(value: number) {
  return Number(value).toFixed(4);
}

interface DestinationMapModalProps {
  destination: Destination | null;
  onClose: () => void;
}

export default function DestinationMapModal({
  destination,
  onClose,
}: DestinationMapModalProps) {
  useEffect(() => {
    if (!destination) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [destination, onClose]);

  if (!destination) {
    return null;
  }

  const [longitude, latitude] = destination.coordinates;

  return (
    <div
      className="fixed inset-0 z-[120] flex min-h-full items-center justify-center overflow-y-auto overscroll-contain bg-[#0F172A]/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-map-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 my-auto flex max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/20 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div>
            <p className="font-cinzel text-xs uppercase tracking-[0.28em] text-amber-700">Destination Location</p>
            <h3 id="destination-map-title" className="mt-2 font-cinzel text-2xl text-[#0F172A]">{destination.name}</h3>
            <p className="mt-2 text-sm text-neutral-600">{destination.region} • {destination.category}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-cinzel uppercase tracking-[0.22em] text-neutral-700 transition hover:bg-neutral-50">Close</button>
        </div>

        <div className="shrink-0 border-b border-neutral-200 bg-neutral-50 px-5 py-3 sm:px-6">
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-cinzel text-neutral-700">
            {formatCoordinate(latitude)}, {formatCoordinate(longitude)} · Google Maps
          </span>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <GoogleLocationMap coordinates={destination.coordinates} title={destination.name} zoom={10.5} className="h-[280px] w-full sm:h-[420px]" />
        </div>
      </div>
    </div>
  );
}
