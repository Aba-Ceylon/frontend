"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destinations as fallbackDestinations } from "@/data/destinations";
import { fetchDestinations } from "@/services/destinationService";
import type { Destination } from "@/types/destination";
import DestinationPanel from "./DestinationPanel";
import {
  getMapLegendCategory,
  mapCategoryStyles,
  mapLegendItems,
} from "./mapCategoryUtils";

const SRI_LANKA_CENTER: [number, number] = [80.7718, 7.8731];

const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#000000",
      },
    },
    {
      id: "osm-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function renderMarkerMarkup(markerColor: string) {
  return `
    <div class="marker-pin" style="
      width: 18px;
      height: 18px;
      background: ${markerColor};
      border: 2px solid rgba(255,255,255,0.94);
      box-shadow: 0 0 0 5px rgba(5,7,10,0.14), 0 12px 24px rgba(5,7,10,0.22);
      transition: transform 0.24s ease, box-shadow 0.24s ease;
      transform-origin: center center;
    "></div>
  `;
}

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [destinations, setDestinations] =
    useState<Destination[]>(fallbackDestinations);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [legendExpanded, setLegendExpanded] = useState(false);
  const hasDestinations = destinations.length > 0;

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
      });

      gsap.from(legendRef.current, {
        x: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDestinations() {
      setIsLoadingDestinations(true);
      const destinationRows = await fetchDestinations();

      if (!active) {
        return;
      }

      setDestinations(destinationRows);
      setIsLoadingDestinations(false);
    }

    void loadDestinations();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) {
      return;
    }

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: OSM_STYLE,
        center: SRI_LANKA_CENTER,
        zoom: 7,
        minZoom: 6.5,
        maxZoom: 12,
        cooperativeGestures: true,
      });

      map.current.addControl(new maplibregl.NavigationControl(), "top-right");

      map.current.on("error", (event) => {
        console.error("Map error:", event);
      });

      map.current.on("load", () => {
        setMapLoaded(true);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    destinations.forEach((destination) => {
      const categoryStyle =
        mapCategoryStyles[getMapLegendCategory(destination)];
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.style.width = "18px";
      markerElement.style.height = "18px";
      markerElement.style.cursor = "pointer";
      markerElement.innerHTML = renderMarkerMarkup(categoryStyle.markerColor);

      markerElement.addEventListener("mouseenter", () => {
        const pin = markerElement.querySelector(".marker-pin") as HTMLElement;
        if (pin) {
          pin.style.transform = "scale(1.22)";
          pin.style.boxShadow =
            "0 0 0 7px rgba(5,7,10,0.14), 0 18px 30px rgba(5,7,10,0.28)";
        }
      });

      markerElement.addEventListener("mouseleave", () => {
        const pin = markerElement.querySelector(".marker-pin") as HTMLElement;
        if (pin) {
          pin.style.transform = "scale(1)";
          pin.style.boxShadow =
            "0 0 0 5px rgba(5,7,10,0.14), 0 12px 24px rgba(5,7,10,0.22)";
        }
      });

      const marker = new maplibregl.Marker({ element: markerElement })
        .setLngLat(destination.coordinates)
        .addTo(map.current!);

      markerElement.addEventListener("click", () => {
        setSelectedDestination(destination);
        map.current?.flyTo({
          center: destination.coordinates,
          zoom: 9,
          duration: 1500,
        });
      });

      markersRef.current.push(marker);
    });
  }, [destinations, mapLoaded]);

  const activeDestination =
    selectedDestination &&
    destinations.some(
      (destination) => destination.id === selectedDestination.id,
    )
      ? selectedDestination
      : null;

  const handleClosePanel = () => {
    setSelectedDestination(null);
    if (map.current) {
      map.current.flyTo({
        center: SRI_LANKA_CENTER,
        zoom: 7,
        duration: 1500,
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="map"
      className="relative h-[100svh] min-h-[680px] w-full bg-slate-50"
    >
      <div
        ref={mapContainer}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {!mapLoaded && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
          <div className="text-center">
            <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p className="font-cinzel text-lg tracking-wider text-amber-100">
              Loading map...
            </p>
          </div>
        </div>
      )}

      <div
        ref={headerRef}
        className="pointer-events-none absolute left-0 right-0 top-0 z-10 bg-linear-to-b from-black/70 via-black/50 to-transparent p-4 sm:p-6 md:p-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-12 bg-amber-400" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          </div>

          <h2 className="mb-3 font-cinzel text-3xl font-medium tracking-wide text-amber-100 drop-shadow-2xl sm:text-4xl md:mb-4 md:text-6xl">
            Interactive Map
          </h2>
          <p className="max-w-2xl pr-4 text-sm font-light leading-6 tracking-wide text-amber-50/90 sm:pr-0 sm:text-base md:text-xl md:leading-relaxed">
            Explore destinations across Sri Lanka and plan your perfect journey
          </p>

          {isLoadingDestinations ? (
            <div className="mt-4 inline-flex items-center gap-2 border border-amber-400/20 bg-black/35 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-amber-100/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse bg-amber-400" />
              Refreshing live locations
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-amber-400" />
            <div className="h-1 w-1 rounded-full bg-amber-400" />
            <div className="h-px w-8 bg-amber-400" />
          </div>
        </div>
      </div>

      <div
        ref={legendRef}
        className="absolute bottom-4 left-4 z-10 sm:bottom-8 sm:left-8"
      >
        {!legendExpanded && (
          <button
            type="button"
            onClick={() => setLegendExpanded(true)}
            aria-label="Show map categories"
            className="flex h-12 w-12 items-center justify-center border border-amber-400/30 bg-slate-900/95 shadow-2xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
          >
            <svg
              className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="19" cy="5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="19" cy="19" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
        )}

        {legendExpanded && (
          <div className="w-[calc(100vw-2rem)] max-w-xs border border-amber-400/20 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md sm:w-72 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-cinzel text-sm font-medium tracking-wider text-amber-400 sm:text-base">
                Categories
              </h3>
              <button
                type="button"
                onClick={() => setLegendExpanded(false)}
                aria-label="Hide map categories"
                className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {mapLegendItems.map(({ category, description }) => {
                const categoryStyle = mapCategoryStyles[category];

                return (
                  <div
                    key={category}
                    className="flex items-start gap-3 border border-white/8 bg-white/4 p-3"
                  >
                    <div className="pt-1.5">
                      <span
                        className="block h-2.5 w-2.5 border border-white/70"
                        style={{ background: categoryStyle.markerColor }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-cinzel text-xs tracking-wide text-amber-50 sm:text-sm">
                        {category}
                      </span>
                      <span className="block text-[11px] leading-4 text-amber-50/65 sm:text-xs sm:leading-5">
                        {description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {mapLoaded && !isLoadingDestinations && !hasDestinations ? (
        <div className="absolute inset-x-4 top-1/2 z-10 -translate-y-1/2 sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2">
          <div className="border border-white/10 bg-slate-900/88 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
            <p className="font-cinzel text-xs uppercase tracking-[0.32em] text-amber-400">
              Discover
            </p>
            <h3 className="mt-3 font-cinzel text-2xl text-amber-50 sm:text-3xl">
              Explore Sri Lanka
            </h3>
            <p className="mt-3 text-sm leading-7 text-amber-50/75 sm:text-base">
              Click on destinations to learn more about each location
            </p>
          </div>
        </div>
      ) : null}

      {activeDestination ? (
        <DestinationPanel
          destination={activeDestination}
          onClose={handleClosePanel}
        />
      ) : null}
    </section>
  );
}
