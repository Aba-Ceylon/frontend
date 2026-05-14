import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useI18n } from "@/components/i18n/I18nProvider";
import ValidationErrors from "@/components/ui/ValidationErrors";
import { formatStayPlanLabel } from "@/lib/planner/plannerHelpers";
import type { PlannerStaySelection, RecommendedStay } from "@/types/planner";

interface StaySelectorProps {
  recommendedStays: RecommendedStay[];
  selectedStayPlans: Array<PlannerStaySelection & { stay: RecommendedStay }>;
  tripEndDate: string;
  tripStartDate: string;
  validationIssues: string[];
  onDateChange: (
    stayId: string,
    field: keyof Omit<PlannerStaySelection, "stayId">,
    value: string,
  ) => void;
  onToggleStay: (stayId: string) => void;
}

export default function StaySelector({
  recommendedStays,
  selectedStayPlans,
  tripEndDate,
  tripStartDate,
  validationIssues,
  onDateChange,
  onToggleStay,
}: StaySelectorProps) {
  const { t } = useI18n();
  const selectedStayIds = selectedStayPlans.map((plan) => plan.stayId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500">
            {t("planner.accommodation.recommendedStays")}
          </p>
          <h3 className="font-cinzel text-2xl text-[#0F172A]">
            {t("planner.accommodation.chooseAccommodation")}
          </h3>
        </div>
        <Badge
          variant="light"
          className="w-fit border-neutral-200 bg-white text-neutral-700"
        >
          {t("planner.accommodation.staysSelected", {
            count: selectedStayPlans.length,
          })}
        </Badge>
      </div>

      <ValidationErrors issues={validationIssues} />

      {recommendedStays.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {recommendedStays.map((stay) => {
            const isSelected = selectedStayIds.includes(stay.id);
            const selectedPlan = selectedStayPlans.find(
              (plan) => plan.stayId === stay.id,
            );

            return (
              <div
                key={stay.id}
                className={`rounded-3xl overflow-hidden border bg-white transition ${
                  isSelected
                    ? "border-amber-500 shadow-[0_20px_50px_rgba(201,154,43,0.16)]"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div
                    className="h-56 w-full bg-cover bg-center md:h-auto md:w-44"
                    style={{ backgroundImage: `url('${stay.image}')` }}
                  />
                  <div className="flex-1 p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
                          {stay.category}
                        </p>
                        <h4 className="mt-2 font-cinzel text-2xl text-[#0F172A]">
                          {stay.name}
                        </h4>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "primary" : "outline"}
                        onClick={() => onToggleStay(stay.id)}
                        className={`rounded-full ${
                          isSelected
                            ? "bg-[#0F172A] text-amber-300"
                            : "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                      >
                        {isSelected ? t("common.selected") : t("planner.accommodation.addStay")}
                      </Button>
                    </div>

                    <p className="mb-3 text-sm leading-6 text-neutral-600">
                      {stay.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge
                        variant="light"
                        className="border-neutral-200 bg-neutral-100 text-neutral-700"
                      >
                        {stay.routeMatchLabel}
                      </Badge>
                      {stay.distanceKm !== null ? (
                        <Badge
                          variant="light"
                          className="border-neutral-200 bg-neutral-100 text-neutral-700"
                        >
                          {t("planner.accommodation.fromRoute", {
                            km: stay.distanceKm,
                          })}
                        </Badge>
                      ) : null}
                    </div>

                    {isSelected && selectedPlan ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          label={t("planner.accommodation.checkIn")}
                          type="date"
                          value={selectedPlan.checkInDate}
                          min={tripStartDate}
                          max={tripEndDate || tripStartDate}
                          onChange={(event) =>
                            onDateChange(
                              stay.id,
                              "checkInDate",
                              event.target.value,
                            )
                          }
                        />
                        <Input
                          label={t("planner.accommodation.checkOut")}
                          type="date"
                          value={selectedPlan.checkOutDate}
                          min={selectedPlan.checkInDate || tripStartDate}
                          max={tripEndDate || tripStartDate}
                          onChange={(event) =>
                            onDateChange(
                              stay.id,
                              "checkOutDate",
                              event.target.value,
                            )
                          }
                        />
                        <p className="text-sm text-neutral-600 sm:col-span-2">
                          {formatStayPlanLabel(
                            stay.name,
                            selectedPlan.checkInDate,
                            selectedPlan.checkOutDate,
                          )}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card
          variant="white"
          className="rounded-3xl border-dashed p-8 text-center text-neutral-600"
        >
          {t("planner.accommodation.noStays")}
        </Card>
      )}
    </div>
  );
}
