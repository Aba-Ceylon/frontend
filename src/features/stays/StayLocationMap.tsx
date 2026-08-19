"use client";

import GoogleLocationMap from "@/components/maps/GoogleLocationMap";
import type { Stay } from "@/types/stay";

function formatCoordinate(value: number) {
  return Number(value).toFixed(4);
}

export default function StayLocationMap({ stay }: { stay: Stay }) {
  if (!stay.coordinates) {
    return null;
  }

  const { latitude, longitude } = stay.coordinates;

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mb-1 font-cinzel text-2xl text-neutral-900">Location</h2>
          <p className="text-sm text-neutral-600">
            {stay.name} is located in {stay.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-cinzel text-neutral-700">
            {stay.category}
          </span>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-cinzel text-neutral-700">
            {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <GoogleLocationMap coordinates={[longitude, latitude]} title={stay.name} zoom={12.5} />
      </div>
    </section>
  );
}
