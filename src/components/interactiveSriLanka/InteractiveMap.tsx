"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destinations } from "@/data/destinations";
import { Destination } from "@/types/destination";
import DestinationPanel from "./DestinationPanel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header fade in on scroll
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

      // Legend slide in
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
    if (!mapContainer.current || map.current) return;

    try {
      // Initialize map centered on Sri Lanka
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
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
        },
        center: [80.7718, 7.8731],
        zoom: 7,
        minZoom: 6.5,
        maxZoom: 12,
        cooperativeGestures: true, // Enable Ctrl+scroll and two-finger zoom
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), "top-right");

      // Error handling
      map.current.on("error", (e) => {
        console.error("Map error:", e);
      });

      // Wait for map to load
      map.current.on("load", () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);

        // Add markers for each destination
        destinations.forEach((destination) => {
          const el = document.createElement("div");
          el.className = "custom-marker";
          el.style.width = "40px";
          el.style.height = "40px";
          el.style.cursor = "pointer";

          const categoryColors = {
            Heritage: "#D97706",
            Nature: "#059669",
            Adventure: "#DC2626",
            Coastal: "#0284C7",
          };

          const categoryIcons = {
            Heritage: "🏛️",
            Nature: "🌿",
            Adventure: "🦁",
            Coastal: "🏖️",
          };

          el.innerHTML = `
            <div class="marker-pin" style="
              width: 40px;
              height: 40px;
              background: ${categoryColors[destination.category]};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              transform-origin: center center;
            ">
              <span style="color: white; font-size: 20px; font-weight: bold;">
                ${categoryIcons[destination.category]}
              </span>
            </div>
          `;

          el.addEventListener("mouseenter", () => {
            const pin = el.querySelector(".marker-pin") as HTMLElement;
            if (pin) pin.style.transform = "scale(1.2)";
          });

          el.addEventListener("mouseleave", () => {
            const pin = el.querySelector(".marker-pin") as HTMLElement;
            if (pin) pin.style.transform = "scale(1)";
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat(destination.coordinates)
            .addTo(map.current!);

          el.addEventListener("click", () => {
            setSelectedDestination(destination);
            map.current?.flyTo({
              center: destination.coordinates,
              zoom: 9,
              duration: 1500,
            });
          });

          markersRef.current.push(marker);
        });
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

  const handleClosePanel = () => {
    setSelectedDestination(null);
    if (map.current) {
      map.current.flyTo({
        center: [80.7718, 7.8731],
        zoom: 7,
        duration: 1500,
      });
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-slate-50">
      <div
        ref={mapContainer}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {!mapLoaded && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-amber-100 font-cinzel text-lg tracking-wider">
              Loading Heritage Map...
            </p>
          </div>
        </div>
      )}

      <div
        ref={headerRef}
        className="absolute top-0 left-0 right-0 z-10 bg-linear-to-b from-black/70 via-black/50 to-transparent p-8 md:p-12 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto">
          {/* Decorative Top */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-amber-400"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          </div>

          <h2 className="text-4xl md:text-6xl font-medium mb-4 font-cinzel text-amber-100 drop-shadow-2xl tracking-wide">
            Explore Sri Lanka
          </h2>
          <p className="text-lg md:text-xl text-amber-50/90 max-w-2xl font-light tracking-wide leading-relaxed">
            Discover the island&apos;s most captivating destinations. Click on
            any location to learn more.
          </p>

          {/* Decorative Bottom */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="w-8 h-px bg-amber-400"></div>
          </div>
        </div>
      </div>

      <div
        ref={legendRef}
        className="absolute bottom-8 left-8 z-10 bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-amber-400/20"
      >
        <h3 className="font-medium text-base mb-4 text-amber-400 font-cinzel tracking-wider">
          Destination Types
        </h3>
        <div className="space-y-3">
          {[
            { category: "Heritage", color: "#D97706", icon: "🏛️" },
            { category: "Nature", color: "#059669", icon: "🌿" },
            { category: "Adventure", color: "#DC2626", icon: "🦁" },
            { category: "Coastal", color: "#0284C7", icon: "🏖️" },
          ].map(({ category, color, icon }) => (
            <div
              key={category}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm transition-transform group-hover:scale-110"
                style={{ background: color }}
              >
                {icon}
              </div>
              <span className="text-sm text-amber-50 font-cinzel tracking-wide group-hover:text-amber-400 transition-colors">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedDestination && (
        <DestinationPanel
          destination={selectedDestination}
          onClose={handleClosePanel}
        />
      )}
    </section>
  );
}
