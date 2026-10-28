"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Destination } from "@/types/destination";

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
        "background-color": "#0f172a",
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

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

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [destination, onClose]);

  useEffect(() => {
    if (!destination || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const [longitude, latitude] = destination.coordinates;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: OSM_STYLE,
      center: [longitude, latitude],
      zoom: 10.5,
      minZoom: 4,
      maxZoom: 17,
      cooperativeGestures: true,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const markerElement = document.createElement("div");
    markerElement.innerHTML = `
      <div style="
        width: 46px;
        height: 46px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #f59e0b, #b45309);
        border: 3px solid rgba(255,255,255,0.96);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.28);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        font-weight: 700;
      ">
        ABA
      </div>
    `;

    new maplibregl.Marker({ element: markerElement, anchor: "center" })
      .setLngLat([longitude, latitude])
      .setPopup(
        new maplibregl.Popup({ offset: 18 }).setHTML(`
          <div style="padding: 2px 4px; min-width: 190px;">
            <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">${destination.name}</p>
            <p style="margin: 0 0 2px; color: #475569; font-size: 12px;">${destination.region}</p>
            <p style="margin: 0; color: #64748b; font-size: 12px;">${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}</p>
          </div>
        `),
      )
      .addTo(map);

    map.on("load", () => {
      map.resize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [destination]);

  useEffect(() => {
    if (!destination || !mapRef.current) {
      return;
    }

    const [longitude, latitude] = destination.coordinates;
    const map = mapRef.current;

    map.flyTo({
      center: [longitude, latitude],
      zoom: 10.5,
      essential: true,
      duration: 900,
    });

    const resizeMap = () => {
      map.resize();
    };

    window.addEventListener("resize", resizeMap);
    resizeMap();

    return () => {
      window.removeEventListener("resize", resizeMap);
    };
  }, [destination]);

  if (!destination) {
    return null;
  }

  const [longitude, latitude] = destination.coordinates;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0F172A]/70 p-4 sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div>
            <p className="font-cinzel text-xs uppercase tracking-[0.28em] text-amber-700">
              Destination Location
            </p>
            <h3 className="mt-2 font-cinzel text-2xl text-[#0F172A]">
              {destination.name}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              {destination.region} • {destination.category}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-cinzel uppercase tracking-[0.22em] text-neutral-700 transition hover:bg-neutral-50"
          >
            Close
          </button>
        </div>

        <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 font-cinzel text-neutral-700">
              {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 font-cinzel text-neutral-700">
              OpenStreetMap Preview
            </span>
          </div>
        </div>

        <div ref={mapContainerRef} className="h-[320px] w-full sm:h-[440px]" />
      </div>
    </div>
  );
}
