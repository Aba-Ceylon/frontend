"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/maps/loadGoogleMaps";

type GoogleLocationMapProps = {
  coordinates: [number, number];
  title: string;
  zoom?: number;
  className?: string;
};

/** A focused Google Map with one accessible location marker. */
export default function GoogleLocationMap({
  coordinates,
  title,
  zoom = 12,
  className = "h-[320px] w-full sm:h-[400px]",
}: GoogleLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isActive = true;
    const [longitude, latitude] = coordinates;

    void loadGoogleMaps()
      .then(() => {
        if (!isActive || !containerRef.current) {
          return;
        }

        const position = { lat: latitude, lng: longitude };
        const map = new google.maps.Map(containerRef.current, {
          center: position,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "cooperative",
        });

        mapRef.current = map;
        new google.maps.Marker({ map, position, title });
        setStatus("ready");
      })
      .catch((error: unknown) => {
        console.error("Unable to load Google Maps:", error);
        if (isActive) {
          setStatus("error");
        }
      });

    return () => {
      isActive = false;
      mapRef.current = null;
    };
  }, [coordinates, title, zoom]);

  return (
    <div className="relative bg-[#182231]" aria-label={`Map showing ${title}`}>
      <div ref={containerRef} className={className} />
      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#182231]/90 px-6 text-center">
          <p className="font-cinzel text-xs uppercase tracking-[0.18em] text-[#f0c967]">
            {status === "loading" ? "Loading Google Map" : "Google Map is unavailable"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
