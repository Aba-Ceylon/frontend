"use client";

import { useEffect, useRef, useState } from "react";
import type { Destination } from "@/types/destination";
import { loadGoogleMaps } from "@/lib/googleMaps";

function formatCoordinate(value: number) { return value.toFixed(4); }

interface DestinationMapModalProps { destination: Destination | null; onClose: () => void; }

export default function DestinationMapModal({ destination, onClose }: DestinationMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const initialisedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destination) return;
    const handleEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleEscape); document.body.style.overflow = ""; };
  }, [destination, onClose]);

  useEffect(() => {
    if (!destination || !mapContainerRef.current || initialisedRef.current) return;
    let cancelled = false;
    const [longitude, latitude] = destination.coordinates;
    loadGoogleMaps().then((maps) => {
      if (cancelled || !mapContainerRef.current) return;
      const location = { lat: latitude, lng: longitude };
      const map = new maps.Map(mapContainerRef.current, { center: location, zoom: 10.5, mapTypeControl: false, streetViewControl: false, gestureHandling: "cooperative" });
      new maps.Marker({ map, position: location, title: destination.name });
      initialisedRef.current = true;
    }).catch(() => !cancelled && setError("Google Maps is unavailable. Check the API key and its website restrictions."));
    return () => { cancelled = true; };
  }, [destination]);

  if (!destination) return null;
  const [longitude, latitude] = destination.coordinates;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0F172A]/70 p-4 sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div><p className="font-cinzel text-xs uppercase tracking-[0.28em] text-amber-700">Destination Location</p><h3 className="mt-2 font-cinzel text-2xl text-[#0F172A]">{destination.name}</h3><p className="mt-2 text-sm text-neutral-600">{destination.region} • {destination.category}</p></div>
          <button type="button" onClick={onClose} className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-cinzel uppercase tracking-[0.22em] text-neutral-700 transition hover:bg-neutral-50">Close</button>
        </div>
        <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-3 sm:px-6"><span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-cinzel text-neutral-700">{formatCoordinate(latitude)}, {formatCoordinate(longitude)} · Google Maps</span></div>
        <div ref={mapContainerRef} className="h-[320px] w-full sm:h-[440px]" />
        {error ? <p className="border-t border-neutral-200 px-5 py-3 text-sm text-red-800">{error}</p> : null}
      </div>
    </div>
  );
}
