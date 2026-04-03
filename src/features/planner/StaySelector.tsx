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
  const selectedStayIds = selectedStayPlans.map((plan) => plan.stayId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500 mb-2">
            Recommended Stays
          </p>
          <h3 className="font-cinzel text-2xl text-[#0F172A]">
            Choose Accommodation For Your Dates
          </h3>
        </div>
        <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700">
          {selectedStayPlans.length} stay
          {selectedStayPlans.length === 1 ? "" : "s"} selected
        </span>
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
                className={`rounded-3xl border overflow-hidden bg-white transition ${
                  isSelected
                    ? "border-amber-500 shadow-[0_20px_50px_rgba(217,119,6,0.16)]"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div
                    className="w-full md:w-44 h-56 md:h-auto bg-cover bg-center"
                    style={{ backgroundImage: `url('${stay.image}')` }}
                  />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
                          {stay.category}
                        </p>
                        <h4 className="font-cinzel text-2xl text-[#0F172A] mt-2">
                          {stay.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleStay(stay.id)}
                        className={`rounded-full px-4 py-2 text-sm transition ${
                          isSelected
                            ? "bg-[#0F172A] text-amber-300"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                      >
                        {isSelected ? "Selected" : "Add stay"}
                      </button>
                    </div>

                    <p className="text-sm text-neutral-600 leading-6 mb-3">
                      {stay.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                        {stay.routeMatchLabel}
                      </span>
                      {stay.distanceKm !== null ? (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                          ~{stay.distanceKm} km from route
                        </span>
                      ) : null}
                    </div>

                    {isSelected && selectedPlan ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                            Check-in
                          </span>
                          <input
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
                            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-[#0F172A] [color-scheme:light] outline-none focus:border-amber-400"
                          />
                        </label>
                        <label className="block">
                          <span className="block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                            Check-out
                          </span>
                          <input
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
                            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-[#0F172A] [color-scheme:light] outline-none focus:border-amber-400"
                          />
                        </label>
                        <p className="sm:col-span-2 text-sm text-neutral-600">
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
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-600">
          No recommended stays matched this route yet. Try adjusting your
          destination selection or continue with your own accommodation.
        </div>
      )}
    </div>
  );
}
