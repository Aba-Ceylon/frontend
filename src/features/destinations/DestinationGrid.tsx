"use client";

import { useMemo, useState } from "react";
import { ChevronDown, MapPin, X } from "lucide-react";
import type { Destination } from "@/types/destination";
import {
  ALL_DISTRICTS,
  filterPlannerDestinations,
  getDestinationDistricts,
} from "@/lib/planner/destinationFilters";
import ListingIntro, { ResultCount } from "@/components/ui/ListingIntro";
import DestinationCard from "./DestinationCard";

const PAGE_SIZE = 12;

export function DestinationGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [district, setDistrict] = useState(ALL_DISTRICTS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const districts = useMemo(
    () => getDestinationDistricts(destinations),
    [destinations],
  );
  const filteredDestinations = useMemo(
    () => filterPlannerDestinations(destinations, district, ""),
    [destinations, district],
  );
  const shownDestinations = filteredDestinations.slice(0, visibleCount);
  const remaining = filteredDestinations.length - shownDestinations.length;

  const chooseDistrict = (value: string) => {
    setDistrict(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      <ListingIntro
        kicker="Where to go"
        title="Find your corner of the island."
        description="Filter by district, open a place to read our local notes, then add it to your route."
        aside={
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end lg:flex-col lg:items-end">
            <ResultCount count={filteredDestinations.length} noun="destination" />
            <div className="flex items-center gap-3">
              <label className="relative block">
                <span className="sr-only">Filter by district</span>
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7422]" />
                <select
                  value={district}
                  onChange={(event) => chooseDistrict(event.target.value)}
                  className="min-h-12 w-full min-w-[240px] cursor-pointer appearance-none rounded-full border border-[#182231]/15 bg-white py-3 pl-11 pr-11 text-sm text-[#182231] outline-none transition hover:border-[#9b7422] focus:border-[#9b7422] focus:ring-2 focus:ring-[#9b7422]/15"
                >
                  <option value={ALL_DISTRICTS}>All districts</option>
                  {districts.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#182231]/50"
                  aria-hidden="true"
                />
              </label>
              {district !== ALL_DISTRICTS ? (
                <button
                  type="button"
                  onClick={() => chooseDistrict(ALL_DISTRICTS)}
                  className="round-btn round-btn-light"
                  aria-label="Clear district filter"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        }
      />

      {shownDestinations.length > 0 ? (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-10" data-reveal-stagger>
            {shownDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>

          {remaining > 0 ? (
            <div className="mt-14 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex min-h-12 items-center gap-3 border border-[#182231] px-8 py-3 font-cinzel text-xs uppercase tracking-[0.24em] text-[#182231] transition-colors duration-300 hover:bg-[#182231] hover:text-white"
              >
                Show more destinations
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-sm text-[#182231]/55">
                Showing {shownDestinations.length} of {filteredDestinations.length}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="border border-dashed border-[#182231]/20 px-6 py-16 text-center">
          <p className="font-cinzel text-2xl text-[#182231]">No destinations found</p>
          <button
            type="button"
            onClick={() => chooseDistrict(ALL_DISTRICTS)}
            className="editorial-link mt-5 text-[#9b7422]"
          >
            Show all destinations
          </button>
        </div>
      )}
    </div>
  );
}
