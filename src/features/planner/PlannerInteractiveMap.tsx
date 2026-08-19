"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMapLegendCategory, mapCategoryStyles, mapLegendItems } from "@/components/interactiveSriLanka/mapCategoryUtils";
import { loadGoogleMaps, type GoogleMap, type GoogleMarker } from "@/lib/googleMaps";
import type { Destination } from "@/types/destination";

const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };
interface PlannerInteractiveMapProps { destinations: Destination[]; onToggleDestination: (destinationId: string) => void; selectedDestinationIds: string[]; }

export default function PlannerInteractiveMap({ destinations, onToggleDestination, selectedDestinationIds }: PlannerInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMapDestination, setSelectedMapDestination] = useState<Destination | null>(null);
  const selectedDestinationSet = useMemo(() => new Set(selectedDestinationIds), [selectedDestinationIds]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let cancelled = false;
    loadGoogleMaps().then((maps) => {
      if (cancelled || !mapContainerRef.current) return;
      mapRef.current = new maps.Map(mapContainerRef.current, { center: SRI_LANKA_CENTER, zoom: 7, minZoom: 6.3, maxZoom: 12.5, mapTypeControl: false, streetViewControl: false, gestureHandling: "cooperative" });
      setMapLoaded(true);
    }).catch(() => !cancelled && setError("Google Maps is unavailable. Check the API key and its website restrictions."));
    return () => { cancelled = true; markersRef.current.forEach((marker) => marker.setMap(null)); markersRef.current = []; mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    let cancelled = false;
    loadGoogleMaps().then((maps) => {
      if (cancelled || !mapRef.current) return;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = destinations.map((destination) => {
        const [lng, lat] = destination.coordinates;
        const selected = selectedDestinationSet.has(destination.id);
        const marker = new maps.Marker({ map: mapRef.current, position: { lat, lng }, title: destination.name, icon: { path: 0, scale: selected ? 10 : 8, fillColor: mapCategoryStyles[getMapLegendCategory(destination)].markerColor, fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: selected ? 3 : 2 } });
        marker.addListener("click", () => { setSelectedMapDestination(destination); mapRef.current?.panTo({ lat, lng }); mapRef.current?.setZoom(8.8); });
        return marker;
      });
    });
    return () => { cancelled = true; };
  }, [destinations, mapLoaded, selectedDestinationSet]);

  const closePanel = () => { setSelectedMapDestination(null); mapRef.current?.panTo(SRI_LANKA_CENTER); mapRef.current?.setZoom(7); };
  const selected = selectedMapDestination && selectedDestinationSet.has(selectedMapDestination.id);

  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 font-cinzel text-sm uppercase tracking-[0.28em] text-amber-700">Interactive Map</p><h3 className="font-cinzel text-2xl text-[#0F172A]">Add Destinations From The Map</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Click any Google Maps marker to preview the location and add or remove it from your journey.</p></div><div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700">{selectedDestinationIds.length} selected from route map</div></div>
    <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-[#0F172A] shadow-[0_24px_80px_rgba(15,23,42,0.18)]"><div ref={mapContainerRef} className="h-[420px] w-full sm:h-[520px]" />
      {!mapLoaded ? <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/88"><p className="font-cinzel text-base uppercase tracking-[0.22em] text-amber-100">Loading Google Maps</p></div> : null}
      {error ? <p className="absolute inset-x-4 bottom-4 rounded-lg bg-white p-3 text-sm text-red-800">{error}</p> : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#020617]/78 to-transparent p-5 sm:p-6"><h4 className="font-cinzel text-2xl text-amber-100 sm:text-3xl">Explore Sri Lanka By Route</h4></div>
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2 rounded-xl bg-[#020617]/90 p-3 text-xs text-amber-50">{mapLegendItems.map(({ category }) => <span key={category} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ background: mapCategoryStyles[category].markerColor }} />{category}</span>)}</div>
      {selectedMapDestination ? <div className="absolute inset-x-3 bottom-3 z-20 rounded-[1.5rem] border border-white/70 bg-white/96 p-4 shadow-2xl md:inset-x-auto md:bottom-5 md:right-5 md:w-[320px]"><button type="button" onClick={closePanel} className="float-right text-xs text-neutral-600">Close</button><p className="font-cinzel text-xs uppercase tracking-[0.22em] text-amber-700">{selectedMapDestination.category}</p><h4 className="mt-2 font-cinzel text-2xl text-[#0F172A]">{selectedMapDestination.name}</h4><p className="mt-3 text-sm leading-6 text-neutral-600">{selectedMapDestination.summary}</p><button type="button" onClick={() => { onToggleDestination(selectedMapDestination.id); setSelectedMapDestination(null); }} className={`mt-5 w-full rounded-2xl px-4 py-3 font-cinzel text-xs uppercase tracking-[0.22em] ${selected ? "bg-[#0F172A] text-amber-300" : "bg-amber-500 text-white"}`}>{selected ? "Remove From Planner" : "Add To Planner"}</button></div> : null}
    </div>
  </div>;
}
