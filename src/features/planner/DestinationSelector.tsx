"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, MapPin, Search, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ValidationErrors from "@/components/ui/ValidationErrors";
import StepHeader from "@/components/ui/StepHeader";
import PlannerInteractiveMap from "@/features/planner/PlannerInteractiveMap";
import {
  ALL_DISTRICTS,
  filterPlannerDestinations,
  getDestinationDistricts,
} from "@/lib/planner/destinationFilters";
import type { Destination } from "@/types/destination";

const FALLBACK_IMAGE = "/images/heritage/sl-image.webp";

interface DestinationSelectorProps {
  destinations: Destination[];
  selectedDestinationIds: string[];
  validationIssues?: string[];
  onToggleDestination: (destinationId: string) => void;
}

export default function DestinationSelector({
  destinations,
  selectedDestinationIds,
  validationIssues = [],
  onToggleDestination,
}: DestinationSelectorProps) {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState(ALL_DISTRICTS);
  const districts = useMemo(() => getDestinationDistricts(destinations), [destinations]);
  const filteredDestinations = useMemo(
    () => filterPlannerDestinations(destinations, district, query),
    [destinations, district, query],
  );
  const hasFilters = district !== ALL_DISTRICTS || query.trim().length > 0;

  const clearFilters = () => {
    setDistrict(ALL_DISTRICTS);
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <StepHeader eyebrow="Step 2" title="Select Your Destinations" />
        <Badge variant="light" className="w-fit border-neutral-200 bg-white text-neutral-700">
          {selectedDestinationIds.length} destination{selectedDestinationIds.length === 1 ? "" : "s"} selected
        </Badge>
      </div>

      <ValidationErrors issues={validationIssues} />

      <div className="border-y border-[#182231]/12 bg-[#f8f5ef] py-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#182231]/58">
              Search destinations
            </span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#182231]/42" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by place or location"
                className="min-h-12 w-full border border-[#182231]/14 bg-white py-3 pl-11 pr-4 text-sm text-[#182231] outline-none transition placeholder:text-[#182231]/38 focus:border-[#9b7422] focus:ring-2 focus:ring-[#9b7422]/12"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#182231]/58">
              Filter by district
            </span>
            <select
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              className="min-h-12 w-full border border-[#182231]/14 bg-white px-4 py-3 text-sm text-[#182231] outline-none transition focus:border-[#9b7422] focus:ring-2 focus:ring-[#9b7422]/12"
            >
              <option value={ALL_DISTRICTS}>All districts</option>
              {districts.map((districtName) => (
                <option key={districtName} value={districtName}>{districtName}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#182231]/14 px-5 font-cinzel text-[10px] uppercase tracking-[0.16em] text-[#182231] transition hover:border-[#9b7422] hover:text-[#9b7422] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </div>

        <p className="mt-4 text-xs text-[#182231]/55" aria-live="polite">
          Showing {filteredDestinations.length} of {destinations.length} destinations
          {district !== ALL_DISTRICTS ? ` in ${district}` : ""}
        </p>
      </div>

      <PlannerInteractiveMap
        destinations={filteredDestinations}
        onToggleDestination={onToggleDestination}
        selectedDestinationIds={selectedDestinationIds}
      />

      {filteredDestinations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDestinations.map((destination) => {
            const isSelected = selectedDestinationIds.includes(destination.id);
            const image = destination.images?.[0] || FALLBACK_IMAGE;

            return (
              <button
                key={destination.id}
                type="button"
                onClick={() => onToggleDestination(destination.id)}
                aria-pressed={isSelected}
                className={`group overflow-hidden border bg-white text-left transition focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9b7422] ${
                  isSelected
                    ? "border-[#9b7422] shadow-[0_18px_45px_rgba(155,116,34,0.16)]"
                    : "border-[#182231]/10 hover:border-[#9b7422]/55 hover:shadow-[0_18px_42px_rgba(24,34,49,0.08)]"
                }`}
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-[#e9e3d9]">
                  <Image
                    src={image}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                  {isSelected ? (
                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-[#182231] text-[#f0c967] shadow-lg">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : null}
                </span>

                <span className="flex min-h-[96px] items-start justify-between gap-4 p-5">
                  <span>
                    <span className="block font-cinzel text-xl leading-tight text-[#182231]">{destination.name}</span>
                    <span className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#182231]/58">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9b7422]" />
                      {destination.district}, {destination.province}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-[#182231]/20 px-6 py-14 text-center">
          <p className="font-cinzel text-xl text-[#182231]">No destinations found</p>
          <p className="mt-2 text-sm text-[#182231]/55">Try another keyword or choose a different district.</p>
          <button type="button" onClick={clearFilters} className="mt-5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#9b7422] underline underline-offset-4">Clear filters</button>
        </div>
      )}
    </div>
  );
}
