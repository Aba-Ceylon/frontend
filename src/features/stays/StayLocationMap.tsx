"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Stay } from "@/types/stay";

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
      attribution: "© OpenStreetMap contributors",
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

export default function StayLocationMap({ stay }: { stay: Stay }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!stay.coordinates || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const { latitude, longitude } = stay.coordinates;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: OSM_STYLE,
      center: [longitude, latitude],
      zoom: 12.5,
      minZoom: 4,
      maxZoom: 17,
      cooperativeGestures: true,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const markerElement = document.createElement("div");
    markerElement.className = "stay-location-marker";
    markerElement.innerHTML = `
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #f59e0b, #b45309);
        border: 3px solid rgba(255,255,255,0.96);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
      ">
        ●
      </div>
    `;

    new maplibregl.Marker({ element: markerElement, anchor: "center" })
      .setLngLat([longitude, latitude])
      .setPopup(
        new maplibregl.Popup({ offset: 18 }).setHTML(`
          <div style="padding: 2px 4px; min-width: 180px;">
            <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">${stay.name}</p>
            <p style="margin: 0 0 2px; color: #475569; font-size: 12px;">${stay.category}</p>
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
  }, [stay]);

  useEffect(() => {
    if (!mapRef.current || !stay.coordinates) {
      return;
    }

    const resizeMap = () => {
      mapRef.current?.resize();
    };

    window.addEventListener("resize", resizeMap);

    return () => {
      window.removeEventListener("resize", resizeMap);
    };
  }, [stay.coordinates]);

  if (!stay.coordinates) {
    return null;
  }

  const { latitude, longitude } = stay.coordinates;

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-1">
            Location Map
          </h2>
          <p className="text-sm text-neutral-600">
            OpenStreetMap preview for this accommodation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white border border-neutral-200 px-3 py-1 text-xs font-cinzel text-neutral-700">
            {stay.category}
          </span>
          <span className="rounded-full bg-white border border-neutral-200 px-3 py-1 text-xs font-cinzel text-neutral-700">
            {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div ref={mapContainerRef} className="h-[320px] sm:h-[400px] w-full" />
      </div>
    </section>
  );
}
