"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchDestinations } from "@/services/destinationService";
import type { Destination } from "@/types/destination";
import DestinationPanel from "./DestinationPanel";
import {
  getMapLegendCategory,
  type MapLegendCategory,
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

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [legendExpanded, setLegendExpanded] = useState(false);

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
      markerElement.style.width = "40px";
      markerElement.style.height = "40px";
      markerElement.style.cursor = "pointer";

      markerElement.innerHTML = `
        <div class="marker-pin" style="
          width: 40px;
          height: 40px;
          background: ${categoryStyle.markerColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          transform-origin: center center;
        ">
          <span style="color: white; font-size: 18px; line-height: 1;">
            ${categoryStyle.markerIcon}
          </span>
        </div>
      `;

      markerElement.addEventListener("mouseenter", () => {
        const pin = markerElement.querySelector(".marker-pin") as HTMLElement;
        if (pin) {
          pin.style.transform = "scale(1.2)";
        }
      });

      markerElement.addEventListener("mouseleave", () => {
        const pin = markerElement.querySelector(".marker-pin") as HTMLElement;
        if (pin) {
          pin.style.transform = "scale(1)";
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

  const getCategoryLabel = (category: MapLegendCategory) => {
    switch (category) {
      case "Heritage":
        return "Heritage";
      case "Nature":
        return "Nature";
      case "Coastal":
        return "Coastal";
      case "Adventure":
        return "Adventure";
      case "City":
        return "City";
      default:
        return category;
    }
  };

  const getCategoryDescription = (category: MapLegendCategory) => {
    switch (category) {
      case "Heritage":
        return "Explore Sri Lanka's rich cultural heritage sites";
      case "Nature":
        return "Discover stunning natural landscapes and wildlife";
      case "Coastal":
        return "Relax on pristine beaches and coastal areas";
      case "Adventure":
        return "Experience thrilling adventures and outdoor activities";
      case "City":
        return "Explore vibrant cities and urban destinations";
      default:
        return "";
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-slate-50">
      <div
        ref={mapContainer}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {(!mapLoaded || isLoadingDestinations) && (
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
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none bg-linear-to-b from-black/70 via-black/50 to-transparent p-4 sm:p-6 md:p-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-12 bg-amber-400" />
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <div className="h-2 w-2 rounded-full bg-amber-400" />
          </div>

          <h2 className="mb-3 font-cinzel text-3xl font-medium tracking-wide text-amber-100 drop-shadow-2xl sm:text-4xl md:mb-4 md:text-6xl">
            Interactive Map
          </h2>
          <p className="max-w-2xl pr-4 text-sm font-light leading-6 tracking-wide text-amber-50/90 sm:pr-0 sm:text-base md:text-xl md:leading-relaxed">
            Explore destinations across Sri Lanka and plan your perfect journey
          </p>

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
        {/* Collapsed: circle button */}
        {!legendExpanded && (
          <button
            type="button"
            onClick={() => setLegendExpanded(true)}
            aria-label="Show map categories"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-slate-900/95 shadow-2xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 sm:h-14 sm:w-14"
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

        {/* Expanded: full panel */}
        {legendExpanded && (
          <div className="w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-amber-400/20 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md sm:w-72 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-cinzel text-sm font-medium tracking-wider text-amber-400 sm:text-base">
                Categories
              </h3>
              <button
                type="button"
                onClick={() => setLegendExpanded(false)}
                aria-label="Hide map categories"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {mapLegendItems.map(({ category }) => {
                const categoryStyle = mapCategoryStyles[category];
                return (
                  <div
                    key={category}
                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-2.5"
                  >
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-white text-sm text-white shadow-lg"
                      style={{ background: categoryStyle.markerColor }}
                    >
                      <span aria-hidden="true">{categoryStyle.markerIcon}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block font-cinzel text-xs tracking-wide text-amber-50 sm:text-sm">
                        {getCategoryLabel(category)}
                      </span>
                      <span className="block text-[11px] leading-4 text-amber-50/65 sm:text-xs sm:leading-5">
                        {getCategoryDescription(category)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {mapLoaded && !isLoadingDestinations && destinations.length === 0 ? (
        <div className="absolute inset-x-4 top-1/2 z-10 -translate-y-1/2 sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/88 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
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
