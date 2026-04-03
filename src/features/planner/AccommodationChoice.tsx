import type { AccommodationMode } from "@/types/planner";

interface AccommodationChoiceProps {
  accommodationMode: AccommodationMode | "";
  accommodationNote: string;
  validationIssues: string[];
  onModeChange: (mode: AccommodationMode) => void;
}

export default function AccommodationChoice({
  accommodationMode,
  accommodationNote,
  validationIssues,
  onModeChange,
}: AccommodationChoiceProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
          Step 4
        </p>
        <h2 className="font-cinzel text-3xl text-[#0F172A]">
          Accommodation Preference
        </h2>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => onModeChange("own")}
          className={`rounded-3xl border p-6 text-left transition ${
            accommodationMode === "own"
              ? "border-amber-500 bg-amber-50 shadow-[0_20px_50px_rgba(201,154,43,0.16)]"
              : "border-neutral-200 bg-white hover:border-amber-200"
          }`}
        >
          <p className="font-cinzel text-xl text-[#0F172A] mb-2">
            I Already Have Accommodation
          </p>
          <p className="text-sm text-neutral-600 leading-6">
            Continue only with vehicle hire and chauffeur guide support for the
            destinations you selected.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("recommended")}
          className={`rounded-3xl border p-6 text-left transition ${
            accommodationMode === "recommended"
              ? "border-amber-500 bg-amber-50 shadow-[0_20px_50px_rgba(201,154,43,0.16)]"
              : "border-neutral-200 bg-white hover:border-amber-200"
          }`}
        >
          <p className="font-cinzel text-xl text-[#0F172A] mb-2">
            Recommend Stays For My Route
          </p>
          <p className="text-sm text-neutral-600 leading-6">
            Show me system-recommended accommodations based on my selected
            destinations and route timing.
          </p>
        </button>
      </div>

      <div className="rounded-3xl border border-[#0F172A]/10 bg-[#0F172A] p-6 text-white">
        <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300 mb-3">
          Planner Note
        </p>
        <p className="whitespace-pre-line leading-7 text-white/80">
          {accommodationNote}
        </p>
      </div>
    </div>
  );
}
