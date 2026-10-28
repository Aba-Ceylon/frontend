"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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
    { id: "background", type: "background", paint: { "background-color": "#0f172a" } },
    { id: "osm-layer", type: "raster", source: "osm-tiles", minzoom: 0, maxzoom: 22 },
  ],
};

type LocationMapProps = {
  coordinates: [number, number];
  title: string;
  zoom?: number;
  className?: string;
};

/** A focused OpenStreetMap view with one location marker. */
export default function LocationMap({
  coordinates,
  title,
  zoom = 12,
  className = "h-[320px] w-full sm:h-[400px]",
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [longitude, latitude] = coordinates;

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [longitude, latitude],
      zoom,
      minZoom: 4,
      maxZoom: 17,
      cooperativeGestures: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    new maplibregl.Marker({ color: "#C99A2B" })
      .setLngLat([longitude, latitude])
      .setPopup(new maplibregl.Popup({ offset: 24 }).setText(title))
      .addTo(map);
    map.on("load", () => setIsReady(true));

    return () => map.remove();
  }, [longitude, latitude, title, zoom]);

  return (
    <div className="relative bg-[#182231]" aria-label={`Map showing ${title}`}>
      <div ref={containerRef} className={className} />
      {!isReady ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#182231]/90 px-6 text-center">
          <p className="font-cinzel text-xs uppercase tracking-[0.18em] text-[#f0c967]">
            Loading map
          </p>
        </div>
      ) : null}
    </div>
  );
}
