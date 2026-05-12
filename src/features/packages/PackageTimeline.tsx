import { ItineraryDay } from "@/types/package";

export default function PackageTimeline({
  itinerary,
}: {
  itinerary: ItineraryDay[];
}) {
  return (
    <div className="space-y-6">
      {itinerary.map((day) => (
        <div key={day.day} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#1A2238] text-white flex items-center justify-center font-cinzel text-sm flex-shrink-0">
              {day.day}
            </div>
            {day.day < itinerary.length && (
              <div className="w-px flex-1 bg-neutral-200 mt-2" />
            )}
          </div>
          <div className="pb-6">
            <h4 className="font-cinzel text-base font-medium text-neutral-900 mb-1">
              {day.title}
            </h4>
            <p className="text-sm text-neutral-600 mb-2">{day.description}</p>
            <div className="flex flex-wrap gap-2">
              {day.highlights.map((h) => (
                <span
                  key={h}
                  className="text-xs px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
