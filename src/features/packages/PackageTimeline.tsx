import { ItineraryDay } from "@/types/package";

export default function PackageTimeline({
  itinerary,
}: {
  itinerary: ItineraryDay[];
}) {
  return (
    <ol className="relative">
      {itinerary.map((day, index) => (
        <li
          key={`${day.day}-${day.title}-${index}`}
          className="relative grid grid-cols-[56px_minmax(0,1fr)] gap-5 pb-10 last:pb-0 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-7"
          data-reveal
        >
          {index < itinerary.length - 1 ? (
            <span
              className="absolute bottom-0 left-[27px] top-14 w-px bg-[#c99a2b]/35 sm:left-[35px] sm:top-[4.5rem]"
              aria-hidden="true"
            />
          ) : null}
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-[#c99a2b]/50 bg-white sm:h-[72px] sm:w-[72px]">
            <span className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-[#9b7422]">Day</span>
            <span className="font-cinzel text-lg leading-none text-[#182231] sm:text-2xl">{day.day}</span>
          </div>
          <div className="border border-[#182231]/8 bg-white p-5 transition-colors duration-300 hover:border-[#c99a2b]/40 sm:p-6">
            <h3 className="font-cinzel text-xl leading-snug text-[#182231]">{day.title}</h3>
            <p className="mt-2 text-[15px] leading-7 text-[#182231]/68">{day.description}</p>
            {day.highlights.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {day.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-[var(--ivory)] px-3 py-1 text-xs text-[#182231]/75"
                  >
                    {h}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
