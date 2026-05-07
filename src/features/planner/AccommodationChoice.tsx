import Card from "@/components/ui/Card";
import StepHeader from "@/components/ui/StepHeader";
import ValidationErrors from "@/components/ui/ValidationErrors";
import { useI18n } from "@/components/i18n/I18nProvider";
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
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <StepHeader
        eyebrow={t("planner.accommodation.eyebrow")}
        title={t("planner.accommodation.title")}
      />

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
            {t("planner.accommodation.ownTitle")}
          </p>
          <p className="text-sm text-neutral-600 leading-6">
            {t("planner.accommodation.ownDescription")}
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
            {t("planner.accommodation.recommendedTitle")}
          </p>
          <p className="text-sm text-neutral-600 leading-6">
            {t("planner.accommodation.recommendedDescription")}
          </p>
        </button>
      </div>

      <Card className="rounded-3xl border border-[#0F172A]/10 bg-[#0F172A] p-6 text-white">
        <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300 mb-3">
          {t("planner.accommodation.plannerNote")}
        </p>
        <p className="whitespace-pre-line leading-7 text-black/80">
          {accommodationNote}
        </p>
      </Card>
    </div>
  );
}
