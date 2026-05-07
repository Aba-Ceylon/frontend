"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ValidationErrors from "@/components/ui/ValidationErrors";
import StepHeader from "@/components/ui/StepHeader";
import PlannerInteractiveMap from "@/features/planner/PlannerInteractiveMap";
import DestinationMapModal from "@/features/planner/DestinationMapModal";
import type { Destination } from "@/types/destination";

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
  const [mapDestination, setMapDestination] = useState<Destination | null>(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <StepHeader eyebrow="Step 2" title="Select Your Destinations" />
          <Badge variant="light" className="bg-white text-neutral-700 border-neutral-200 w-fit">
            {selectedDestinationIds.length} destination{selectedDestinationIds.length === 1 ? "" : "s"} selected
          </Badge>
        </div>

        <ValidationErrors issues={validationIssues} />

        <PlannerInteractiveMap
          destinations={destinations}
          onToggleDestination={onToggleDestination}
          selectedDestinationIds={selectedDestinationIds}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => {
            const isSelected = selectedDestinationIds.includes(destination.id);
            return (
              <Card
                key={destination.id}
                variant="white"
                className={`rounded-3xl p-5 transition ${
                  isSelected
                    ? "border-amber-500 bg-amber-50 shadow-[0_20px_50px_rgba(217,119,6,0.16)]"
                    : "hover:border-amber-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <Badge variant="amber" className="mb-2">{destination.category}</Badge>
                    <h3 className="font-cinzel text-2xl text-[#0F172A] mt-1">{destination.name}</h3>
                  </div>
                  <Badge variant={isSelected ? "dark" : "light"} className={isSelected ? "bg-[#0F172A] text-amber-300 border-transparent" : "bg-neutral-100 text-neutral-500 border-neutral-200"}>
                    {isSelected ? "Selected" : "Tap to add"}
                  </Badge>
                </div>

                <p className="text-sm text-neutral-600 leading-6 mb-4">{destination.summary}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.slice(0, 2).map((h) => (
                    <Badge key={h} variant="light" className="bg-neutral-100 text-neutral-700 border-neutral-200">{h}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500 mb-5">
                  <span>{destination.region}</span>
                  <span>{destination.bestTimeToVisit}</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" size="sm" fullWidth onClick={() => setMapDestination(destination)}>
                    View Map
                  </Button>
                  <Button
                    variant={isSelected ? "primary" : "secondary"}
                    size="sm"
                    fullWidth
                    onClick={() => onToggleDestination(destination.id)}
                    className={isSelected ? "bg-[#0F172A] text-amber-300 hover:bg-[#18243D]" : "bg-amber-500 hover:bg-amber-600"}
                  >
                    {isSelected ? "Remove" : "Select"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <DestinationMapModal destination={mapDestination} onClose={() => setMapDestination(null)} />
    </>
  );
}
