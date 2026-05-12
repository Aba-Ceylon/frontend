import Card from "@/components/ui/Card";
import StepHeader from "@/components/ui/StepHeader";
import ValidationErrors from "@/components/ui/ValidationErrors";
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
      <StepHeader eyebrow="Step 4" title="Accommodation Preference" />

      <ValidationErrors issues={validationIssues} />

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

      <Card className="rounded-3xl border border-[#0F172A]/10 bg-[#0F172A] p-6 text-white">
        <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300 mb-3">
          Planner Note
        </p>
        <p className="whitespace-pre-line leading-7 text-black/80">
          {accommodationNote}
        </p>
      </Card>
    </div>
  );
}
