"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import type { Destination } from "@/types/destination";

type GoogleMapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
  Marker: new (options: Record<string, unknown>) => unknown;
};

let googleMapsPromise: Promise<GoogleMapsApi> | null = null;

function loadGoogleMaps(apiKey: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in a browser."));
  }

  const googleWindow = window as Window & { google?: { maps?: GoogleMapsApi } };
  if (googleWindow.google?.maps) {
    return Promise.resolve(googleWindow.google.maps);
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
      script.async = true;
      script.onload = () => {
        const maps = googleWindow.google?.maps;
        if (maps) {
          resolve(maps);
        } else {
          reject(new Error("Google Maps did not initialise."));
        }
      };
      script.onerror = () => reject(new Error("Google Maps could not be loaded."));
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}

function formatCoordinate(value: number) {
  return value.toFixed(4);
}

export default function DestinationLocationMap({
  destination,
}: {
  destination: Destination;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInitialisedRef = useRef(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [longitude, latitude] = destination.coordinates;
  const mapsHref = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapContainerRef.current || mapInitialisedRef.current) {
      return;
    }

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapContainerRef.current) {
          return;
        }

        const location = { lat: latitude, lng: longitude };
        const map = new maps.Map(mapContainerRef.current, {
          center: location,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "cooperative",
        });

        new maps.Marker({
          map,
          position: location,
          title: destination.name,
        });
        mapInitialisedRef.current = true;
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Google Maps is unavailable. Check the API key and its website restrictions.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, destination.name, latitude, longitude]);

  return (
    <section className="bg-[#f8f5ef] py-14 sm:py-20">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10" data-reveal>
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-cinzel text-[10px] uppercase tracking-[0.24em] text-[#9b7422]">Location</p>
            <h2 className="mt-3 font-cinzel text-3xl text-[#182231] sm:text-4xl">
              Find {destination.name}
            </h2>
          </div>
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#182231] transition hover:text-[#9b7422] sm:self-auto"
          >
            Open in Google Maps
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="overflow-hidden border border-[#182231]/12 bg-[#e9e3d9] shadow-[0_18px_45px_rgba(24,34,49,0.09)]">
          {apiKey ? <div ref={mapContainerRef} className="h-[300px] w-full sm:h-[420px]" /> : (
            <div className="flex h-[300px] items-center justify-center px-6 text-center text-sm leading-6 text-[#182231]/65 sm:h-[420px]">
              Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to show this destination on Google Maps.
            </div>
          )}
          {loadError ? (
            <p className="border-t border-[#182231]/12 bg-white px-5 py-3 text-sm text-[#8a331c]">{loadError}</p>
          ) : null}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-[#182231]/62">
          <MapPin className="h-4 w-4 text-[#9b7422]" />
          {destination.district}, {destination.province} · {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
        </p>
      </div>
    </section>
  );
}
