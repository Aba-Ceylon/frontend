"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        return t("map.categories.heritage");
      case "Nature":
        return t("map.categories.nature");
      case "Coastal":
        return t("map.categories.coastal");
      case "Adventure":
        return t("map.categories.adventure");
      case "City":
        return t("map.categories.city");
      default:
        return category;
    }
  };

  const getCategoryDescription = (category: MapLegendCategory) => {
    switch (category) {
      case "Heritage":
        return t("map.legendDescriptions.heritage");
      case "Nature":
        return t("map.legendDescriptions.nature");
      case "Coastal":
        return t("map.legendDescriptions.coastal");
      case "Adventure":
        return t("map.legendDescriptions.adventure");
      case "City":
        return t("map.legendDescriptions.city");
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
              {t("map.loading")}
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
            {t("map.title")}
          </h2>
          <p className="max-w-2xl pr-4 text-sm font-light leading-6 tracking-wide text-amber-50/90 sm:pr-0 sm:text-base md:text-xl md:leading-relaxed">
            {t("map.description")}
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
        className="absolute bottom-4 left-1/2 z-10 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-amber-400/20 bg-linear-to-br from-slate-900/95 to-slate-800/95 p-4 shadow-2xl backdrop-blur-md sm:bottom-8 sm:left-8 sm:w-auto sm:max-w-none sm:translate-x-0 sm:p-6"
      >
        <h3 className="mb-4 font-cinzel text-base font-medium tracking-wider text-amber-400">
          {t("map.legendTitle")}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
          {mapLegendItems.map(({ category }) => {
            const categoryStyle = mapCategoryStyles[category];

            return (
              <div
                key={category}
                className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-3"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm text-white shadow-lg"
                  style={{ background: categoryStyle.markerColor }}
                >
                  <span aria-hidden="true">{categoryStyle.markerIcon}</span>
                </div>
                <div className="min-w-0">
                  <span className="block font-cinzel text-sm tracking-wide text-amber-50">
                    {getCategoryLabel(category)}
                  </span>
                  <span className="block text-xs leading-5 text-amber-50/65">
                    {getCategoryDescription(category)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {mapLoaded && !isLoadingDestinations && destinations.length === 0 ? (
        <div className="absolute inset-x-4 top-1/2 z-10 -translate-y-1/2 sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/88 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
            <p className="font-cinzel text-xs uppercase tracking-[0.32em] text-amber-400">
              {t("map.emptyEyebrow")}
            </p>
            <h3 className="mt-3 font-cinzel text-2xl text-amber-50 sm:text-3xl">
              {t("map.emptyTitle")}
            </h3>
            <p className="mt-3 text-sm leading-7 text-amber-50/75 sm:text-base">
              {t("map.emptyDescription")}
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
