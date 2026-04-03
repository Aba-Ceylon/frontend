import { useState } from "react";
import PlannerInteractiveMap from "@/features/planner/PlannerInteractiveMap";
import type { Destination } from "@/types/destination";
import DestinationMapModal from "@/features/planner/DestinationMapModal";

interface DestinationSelectorProps {
  destinations: Destination[];
  selectedDestinationIds: string[];
  validationIssues: string[];
  onToggleDestination: (destinationId: string) => void;
}

export default function DestinationSelector({
  destinations,
  selectedDestinationIds,
  validationIssues,
  onToggleDestination,
}: DestinationSelectorProps) {
  const [mapDestination, setMapDestination] = useState<Destination | null>(
    null,
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
              Step 2
            </p>
            <h2 className="font-cinzel text-3xl text-[#0F172A]">
              Select Your Destinations
            </h2>
          </div>
          <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700">
            {selectedDestinationIds.length} destination
            {selectedDestinationIds.length === 1 ? "" : "s"} selected
          </div>
        </div>

        {validationIssues.length ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
            <p className="font-cinzel text-lg text-red-900 mb-3">
              Required Detail
            </p>
            <ul className="space-y-2 text-sm text-red-700">
              {validationIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : null}

          return (
            <button
              key={destination.id}
              type="button"
              onClick={() => onToggleDestination(destination.id)}
              className={`rounded-3xl border p-5 text-left transition ${
                isSelected
                  ? "border-amber-500 bg-amber-50 shadow-[0_20px_50px_rgba(201,154,43,0.16)]"
                  : "border-neutral-200 bg-white hover:border-amber-200 hover:shadow-lg"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
                    {destination.category}
                  </p>
                  <h3 className="font-cinzel text-2xl text-[#0F172A] mt-2">
                    {destination.name}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-cinzel uppercase tracking-[0.22em] ${
                    isSelected
                      ? "bg-[#0F172A] text-amber-300"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {isSelected ? "Selected" : "Tap to add"}
                </span>
              </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => {
            const isSelected = selectedDestinationIds.includes(destination.id);
            const previewImage = destination.images?.[0];

            return (
              <article
                key={destination.id}
                className={`rounded-3xl border p-5 text-left transition ${
                  isSelected
                    ? "border-amber-500 bg-amber-50 shadow-[0_20px_50px_rgba(217,119,6,0.16)]"
                    : "border-neutral-200 bg-white hover:border-amber-200 hover:shadow-lg"
                }`}
              >
                {previewImage ? (
                  <div
                    className="mb-4 h-44 rounded-[1.4rem] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${previewImage}')` }}
                  />
                ) : null}

                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
                      {destination.category}
                    </p>
                    <h3 className="font-cinzel text-2xl text-[#0F172A] mt-2">
                      {destination.name}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-cinzel uppercase tracking-[0.22em] ${
                      isSelected
                        ? "bg-[#0F172A] text-amber-300"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {isSelected ? "Selected" : "Tap to add"}
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-6 mb-4">
                  {destination.summary}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.slice(0, 2).map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{destination.region}</span>
                  <span>{destination.bestTimeToVisit}</span>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setMapDestination(destination)}
                    className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3 font-cinzel text-xs uppercase tracking-[0.22em] text-neutral-700 transition hover:border-amber-300 hover:text-[#0F172A]"
                  >
                    View Map
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleDestination(destination.id)}
                    className={`flex-1 rounded-2xl px-4 py-3 font-cinzel text-xs uppercase tracking-[0.22em] transition ${
                      isSelected
                        ? "bg-[#0F172A] text-amber-300 hover:bg-[#18243D]"
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                  >
                    {isSelected ? "Remove Destination" : "Select Destination"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <DestinationMapModal
        destination={mapDestination}
        onClose={() => setMapDestination(null)}
      />
    </>
  );
}
