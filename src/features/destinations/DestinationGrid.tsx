"use client";

import { useMemo, useState } from "react";
import { MapPin, X } from "lucide-react";
import type { Destination } from "@/types/destination";
import {
  ALL_DISTRICTS,
  filterPlannerDestinations,
  getDestinationDistricts,
} from "@/lib/planner/destinationFilters";
import DestinationCard from "./DestinationCard";

export function DestinationGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [district, setDistrict] = useState(ALL_DISTRICTS);
  const districts = useMemo(
    () => getDestinationDistricts(destinations),
    [destinations],
  );
  const filteredDestinations = useMemo(
    () => filterPlannerDestinations(destinations, district, ""),
    [destinations, district],
  );

  return (
    <div>
      <div className="mb-10 border-y border-[#182231]/12 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="block w-full sm:max-w-sm">
            <span className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#182231]/58">
              Filter by district
            </span>
            <span className="relative block">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7422]" />
              <select
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="min-h-12 w-full appearance-none border border-[#182231]/14 bg-white py-3 pl-11 pr-10 text-sm text-[#182231] outline-none transition focus:border-[#9b7422] focus:ring-2 focus:ring-[#9b7422]/12"
              >
                <option value={ALL_DISTRICTS}>All districts</option>
                {districts.map((districtName) => (
                  <option key={districtName} value={districtName}>
                    {districtName}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#182231]/48"
                aria-hidden="true"
              >
                ▼
              </span>
            </span>
          </label>

          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <p className="text-sm text-[#182231]/58" aria-live="polite">
              {filteredDestinations.length} destination
              {filteredDestinations.length === 1 ? "" : "s"}
              {district !== ALL_DISTRICTS ? ` in ${district}` : ""}
            </p>
            {district !== ALL_DISTRICTS ? (
              <button
                type="button"
                onClick={() => setDistrict(ALL_DISTRICTS)}
                className="inline-flex min-h-11 items-center gap-2 border border-[#182231]/14 px-4 font-cinzel text-[10px] uppercase tracking-[0.16em] text-[#182231] transition hover:border-[#9b7422] hover:text-[#9b7422]"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filteredDestinations.length > 0 ? (
        <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[#182231]/20 px-6 py-16 text-center">
          <p className="font-cinzel text-2xl text-[#182231]">
            No destinations found
          </p>
          <button
            type="button"
            onClick={() => setDistrict(ALL_DISTRICTS)}
            className="mt-5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#9b7422] underline underline-offset-4"
          >
            Show all destinations
          </button>
        </div>
      )}
    </div>
  );
}
