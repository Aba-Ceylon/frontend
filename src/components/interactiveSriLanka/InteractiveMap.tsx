"use client";

import { useEffect, useRef, useState } from "react";
import { destinations as fallbackDestinations } from "@/data/destinations";
import { fetchDestinations } from "@/services/destinationService";
import type { Destination } from "@/types/destination";
import DestinationPanel from "./DestinationPanel";
import { getMapLegendCategory, mapCategoryStyles, mapLegendItems } from "./mapCategoryUtils";
import { loadGoogleMaps, type GoogleMap, type GoogleMarker } from "@/lib/googleMaps";

const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>(fallbackDestinations);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [legendExpanded, setLegendExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    fetchDestinations().then((rows) => { if (active) { setDestinations(rows); setIsLoadingDestinations(false); } });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    let cancelled = false;
    loadGoogleMaps().then((maps) => {
      if (cancelled || !mapContainer.current) return;
      mapRef.current = new maps.Map(mapContainer.current, { center: SRI_LANKA_CENTER, zoom: 7, minZoom: 6.5, maxZoom: 12, mapTypeControl: false, streetViewControl: false, gestureHandling: "cooperative" });
      setMapLoaded(true);
    }).catch(() => !cancelled && setMapError("Google Maps is unavailable. Check the API key and its website restrictions."));
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
        const marker = new maps.Marker({ map: mapRef.current, position: { lat, lng }, title: destination.name, icon: { path: 0, scale: 8, fillColor: mapCategoryStyles[getMapLegendCategory(destination)].markerColor, fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2 } });
        marker.addListener("click", () => { setSelectedDestination(destination); mapRef.current?.panTo({ lat, lng }); mapRef.current?.setZoom(9); });
        return marker;
      });
    });
    return () => { cancelled = true; };
  }, [destinations, mapLoaded]);

  const activeDestination = selectedDestination && destinations.some((destination) => destination.id === selectedDestination.id) ? selectedDestination : null;
  const closePanel = () => { setSelectedDestination(null); mapRef.current?.panTo(SRI_LANKA_CENTER); mapRef.current?.setZoom(7); };

  return <section id="map" className="relative h-[100svh] min-h-[680px] w-full bg-slate-50">
    <div ref={mapContainer} className="absolute inset-0 z-0" />
    {!mapLoaded ? <div className="absolute inset-0 z-5 flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800"><div className="text-center"><div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" /><p className="font-cinzel text-lg tracking-wider text-amber-100">Loading Google Maps...</p></div></div> : null}
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 bg-linear-to-b from-black/70 via-black/50 to-transparent p-4 sm:p-6 md:p-12"><div className="mx-auto max-w-7xl"><h2 className="mb-3 font-cinzel text-3xl font-medium tracking-wide text-amber-100 drop-shadow-2xl sm:text-4xl md:text-6xl">Interactive Map</h2><p className="max-w-2xl text-sm font-light leading-6 tracking-wide text-amber-50/90 sm:text-base md:text-xl">Explore destinations across Sri Lanka and plan your perfect journey</p>{isLoadingDestinations ? <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-amber-100/85">Refreshing live locations</p> : null}</div></div>
    <div className="absolute bottom-4 left-4 z-10 sm:bottom-8 sm:left-8"><button type="button" onClick={() => setLegendExpanded((value) => !value)} className="border border-amber-400/30 bg-slate-900/95 px-4 py-3 font-cinzel text-xs uppercase tracking-[0.2em] text-amber-100 shadow-2xl">{legendExpanded ? "Hide categories" : "Show categories"}</button>{legendExpanded ? <div className="mt-2 grid max-w-xs gap-2 border border-amber-400/20 bg-slate-900/95 p-4 shadow-2xl">{mapLegendItems.map(({ category, description }) => <div key={category} className="flex items-start gap-3 text-amber-50"><i className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: mapCategoryStyles[category].markerColor }} /><span><b className="block font-cinzel text-xs">{category}</b><small className="text-amber-50/65">{description}</small></span></div>)}</div> : null}</div>
    {mapError ? <p className="absolute inset-x-4 bottom-5 z-20 rounded-lg bg-white p-4 text-center text-sm text-red-800">{mapError}</p> : null}
    {activeDestination ? <DestinationPanel destination={activeDestination} onClose={closePanel} /> : null}
  </section>;
}
