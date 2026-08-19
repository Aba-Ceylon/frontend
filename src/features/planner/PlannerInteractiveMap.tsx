"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getMapLegendCategory,
  mapCategoryStyles,
  mapLegendItems,
} from "@/components/interactiveSriLanka/mapCategoryUtils";
import type { Destination } from "@/types/destination";
import { loadGoogleMaps } from "@/lib/maps/loadGoogleMaps";

const SRI_LANKA_CENTER: [number, number] = [80.7718, 7.8731];

interface PlannerInteractiveMapProps {
  destinations: Destination[];
  onToggleDestination: (destinationId: string) => void;
  selectedDestinationIds: string[];
}

export default function PlannerInteractiveMap({
  destinations,
  onToggleDestination,
  selectedDestinationIds,
}: PlannerInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<
    Array<{
      destinationId: string;
      marker: google.maps.Marker;
    }>
  >([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [selectedMapDestinationState, setSelectedMapDestination] =
    useState<Destination | null>(null);
  const [legendExpanded, setLegendExpanded] = useState(false);

  const selectedDestinationSet = useMemo(
    () => new Set(selectedDestinationIds),
    [selectedDestinationIds],
  );
  const selectedMapDestination = useMemo(
    () =>
      selectedMapDestinationState &&
      destinations.some(
        (destination) => destination.id === selectedMapDestinationState.id,
      )
        ? selectedMapDestinationState
        : null,
    [destinations, selectedMapDestinationState],
  );

  useEffect(() => {
    let isActive = true;
    void loadGoogleMaps()
      .then(() => {
        if (!isActive || !mapContainerRef.current || mapRef.current) return;
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: { lng: SRI_LANKA_CENTER[0], lat: SRI_LANKA_CENTER[1] },
          zoom: 7,
          minZoom: 6.3,
          maxZoom: 12.5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "cooperative",
        });
        setIsMapLoaded(true);
      })
      .catch((error: unknown) => {
        console.error("Unable to load Google Maps:", error);
        if (isActive) setMapError(true);
      });

    return () => {
      isActive = false;
      markersRef.current.forEach(({ marker }) => marker.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isMapLoaded) {
      return;
    }

    markersRef.current.forEach(({ marker }) => marker.setMap(null));
    markersRef.current = [];

    destinations.forEach((destination) => {
      const isSelected = selectedDestinationSet.has(destination.id);
      const categoryStyle = mapCategoryStyles[getMapLegendCategory(destination)];
      const marker = new google.maps.Marker({
        map,
        position: { lng: destination.coordinates[0], lat: destination.coordinates[1] },
        title: destination.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 9 : 7,
          fillColor: categoryStyle.markerColor,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: isSelected ? 3 : 2,
        },
      });
      marker.addListener("click", () => {
          setSelectedMapDestination(destination);
          map.panTo({ lng: destination.coordinates[0], lat: destination.coordinates[1] });
          map.setZoom(8.8);
        });

      markersRef.current.push({
        destinationId: destination.id,
        marker,
      });
    });
  }, [destinations, isMapLoaded, selectedDestinationSet]);

  const handleClosePanel = () => {
    setSelectedMapDestination(null);
    mapRef.current?.panTo({ lng: SRI_LANKA_CENTER[0], lat: SRI_LANKA_CENTER[1] });
    mapRef.current?.setZoom(7);
  };

  const handlePlannerAction = () => {
    if (!selectedMapDestination) {
      return;
    }

    onToggleDestination(selectedMapDestination.id);
    setSelectedMapDestination(null);
  };

  const plannerActionLabel =
    selectedMapDestination &&
    selectedDestinationSet.has(selectedMapDestination.id)
      ? "Remove From Planner"
      : "Add To Planner";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-cinzel text-sm uppercase tracking-[0.28em] text-amber-700 mb-2">
            Interactive Map
          </p>
          <h3 className="font-cinzel text-2xl text-[#0F172A]">
            Add Destinations From The Map
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            Click any map marker to preview the location and add or remove it
            directly from your journey plan.
          </p>
        </div>
        <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700">
          {selectedDestinationIds.length} selected from route map
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-[#0F172A] shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div ref={mapContainerRef} className="h-[420px] w-full sm:h-[520px]" />

        {!isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/88">
            <div className="text-center">
              <div className="mx-auto mb-5 h-16 w-16 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
              <p className="font-cinzel text-base tracking-[0.22em] text-amber-100 uppercase">
                {mapError ? "Google Map is unavailable" : "Loading Google Map"}
              </p>
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#020617]/78 via-[#020617]/40 to-transparent p-5 sm:p-6">
          <div className="max-w-2xl">
            <h4 className="font-cinzel text-2xl text-amber-100 sm:text-3xl">
              Explore Sri Lanka By Route
            </h4>
            <p className="mt-2 text-sm leading-6 text-amber-50/84 sm:text-base">
              Use the same destination map experience to build your planner with
              real route points across the island.
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-10 sm:bottom-6 sm:left-6">
          {!legendExpanded && (
            <button
              type="button"
              onClick={() => setLegendExpanded(true)}
              aria-label="Show map categories"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-[#020617]/95 shadow-2xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 sm:h-14 sm:w-14"
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
            <div className="w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-white/10 bg-[#020617]/95 p-4 shadow-2xl backdrop-blur-md sm:w-64 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-cinzel text-sm uppercase tracking-[0.28em] text-amber-300">
                  Legends
                </h4>
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
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2"
                    >
                      <div
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center"
                        style={{ background: categoryStyle.markerColor }}
                      />
                      <span className="min-w-0 truncate font-cinzel text-xs text-amber-50 sm:text-sm">
                        {category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {selectedMapDestination ? (
          <>
            <div
              className="absolute inset-0 z-20 bg-black/20 backdrop-blur-[1px]"
              onClick={handleClosePanel}
            />
            <div className="absolute inset-x-3 bottom-3 z-30 rounded-[1.5rem] border border-white/70 bg-white/96 p-4 shadow-2xl backdrop-blur md:inset-x-auto md:bottom-5 md:right-5 md:w-[320px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-cinzel text-xs uppercase tracking-[0.22em] text-amber-700">
                    {selectedMapDestination.category}
                  </p>
                  <h4 className="mt-2 font-cinzel text-2xl text-[#0F172A]">
                    {selectedMapDestination.name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleClosePanel}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 transition hover:bg-neutral-200"
                >
                  Close
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {selectedMapDestination.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedMapDestination.highlights
                  .slice(0, 2)
                  .map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                    >
                      {highlight}
                    </span>
                  ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                <span>{selectedMapDestination.region}</span>
                <span>{selectedMapDestination.bestTimeToVisit}</span>
              </div>

              <button
                type="button"
                onClick={handlePlannerAction}
                className={`mt-5 w-full rounded-2xl px-4 py-3 font-cinzel text-xs uppercase tracking-[0.22em] transition ${
                  selectedDestinationSet.has(selectedMapDestination.id)
                    ? "bg-[#0F172A] text-amber-300 hover:bg-[#18243D]"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
              >
                {plannerActionLabel}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
