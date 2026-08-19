"use client";

import { useEffect, useRef, useState } from "react";
import type { Stay } from "@/types/stay";
import { loadGoogleMaps } from "@/lib/googleMaps";

function formatCoordinate(value: number) {
  return value.toFixed(4);
}

export default function StayLocationMap({ stay }: { stay: Stay }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stay.coordinates || !mapContainerRef.current || initializedRef.current) return;
    let cancelled = false;
    const { latitude, longitude } = stay.coordinates;

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !mapContainerRef.current) return;
        const location = { lat: latitude, lng: longitude };
        const map = new maps.Map(mapContainerRef.current, {
          center: location, zoom: 12.5, mapTypeControl: false, streetViewControl: false, gestureHandling: "cooperative",
        });
        new maps.Marker({ map, position: location, title: stay.name });
        initializedRef.current = true;
      })
      .catch(() => !cancelled && setError("Google Maps is unavailable. Check the API key and its website restrictions."));

    return () => { cancelled = true; };
  }, [stay.coordinates, stay.name]);

  if (!stay.coordinates) return null;
  const { latitude, longitude } = stay.coordinates;

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mb-1 font-cinzel text-2xl text-neutral-900">Location</h2>
          <p className="text-sm text-neutral-600">{stay.name} is located in {stay.location}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-cinzel text-neutral-700">{stay.category}</span>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-cinzel text-neutral-700">{formatCoordinate(latitude)}, {formatCoordinate(longitude)}</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div ref={mapContainerRef} className="h-[320px] w-full sm:h-[400px]" />
        {error ? <p className="border-t border-neutral-200 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      </div>
    </section>
  );
}
