"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Stay } from "@/types/stay";
import { SectionKicker } from "@/components/ui/Teardrop";

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
    <section data-reveal>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionKicker>Location</SectionKicker>
          <h2 className="mt-4 font-cinzel text-3xl leading-tight text-[#182231] sm:text-4xl">
            Where you&rsquo;ll be
          </h2>
          <p className="mt-2 text-[15px] text-[#182231]/65">
            {stay.name} is in {stay.location}.
          </p>
        </div>
        <span className="w-fit rounded-full border border-[#182231]/12 bg-white px-4 py-2 text-xs tracking-[0.08em] text-[#182231]/70">
          {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
        </span>
      </div>

      <div className="overflow-hidden border border-[#182231]/10 bg-white shadow-[0_24px_60px_-30px_rgba(13,20,30,0.35)]">
        <div ref={mapContainerRef} className="h-[340px] w-full sm:h-[440px]" />
      </div>
    </section>
  );
}
