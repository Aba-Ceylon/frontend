"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StepHeader from "@/components/ui/StepHeader";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { Destination } from "@/types/destination";
import type { PlannerReviewData } from "@/types/planner";
import type { Stay } from "@/types/stay";
import type { FleetVehicle } from "@/types/vehicle";

interface PlannerSummaryProps {
  accommodationMode: "own" | "recommended" | "";
  adminPhoneNumber: string;
  reviewData: PlannerReviewData;
  selectedDestinations: Destination[];
  selectedStayPlans: Array<{
    checkInDate: string;
    checkOutDate: string;
    stay: Stay;
    stayId: string;
  }>;
  selectedVehicle: FleetVehicle | null;
  travelerEmail: string;
  travelerName: string;
  whatsappHref: string;
}

export default function PlannerSummary({
  accommodationMode,
  adminPhoneNumber,
  reviewData,
  selectedDestinations,
  selectedStayPlans,
  selectedVehicle,
  travelerEmail,
  travelerName,
  whatsappHref,
}: PlannerSummaryProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <StepHeader
        eyebrow={t("planner.review.eyebrow")}
        title={t("planner.review.title")}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card variant="white" className="rounded-3xl p-6 xl:col-span-2">
          <p className="mb-4 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500">
            {t("planner.review.summary")}
          </p>
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-cinzel text-lg text-[#0F172A]">
                {t("planner.review.traveler")}
              </p>
              <p className="text-sm leading-6 text-neutral-700">
                {travelerName || t("common.signedInTraveler")}
                {travelerEmail ? ` - ${travelerEmail}` : ""}
              </p>
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#0F172A]">{t("planner.review.trip")}</p>
              <p className="text-sm leading-6 text-neutral-700">
                {reviewData.tripLabel}
              </p>
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#0F172A]">
                {t("planner.review.destinations")}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDestinations.map((destination) => (
                  <Badge
                    key={destination.id}
                    variant="light"
                    className="border-neutral-200 bg-neutral-100 py-2 text-neutral-700"
                  >
                    {destination.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#0F172A]">{t("planner.review.vehicle")}</p>
              {selectedVehicle ? (
                <Card
                  variant="white"
                  className="rounded-2xl bg-neutral-50 p-4 shadow-none"
                >
                  <p className="font-cinzel text-xl text-[#0F172A]">
                    {selectedVehicle.brandName} {selectedVehicle.name}
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    {selectedVehicle.shortDescription}
                  </p>
                </Card>
              ) : null}
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#0F172A]">
                {t("planner.review.accommodation")}
              </p>
              <p className="whitespace-pre-line text-sm leading-7 text-neutral-700">
                {reviewData.accommodationNote}
              </p>
              {accommodationMode === "recommended" &&
              selectedStayPlans.length ? (
                <div className="mt-4 grid gap-3">
                  {selectedStayPlans.map((plan) => (
                    <Card
                      key={plan.stayId}
                      variant="white"
                      className="rounded-2xl p-4 shadow-none"
                    >
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {plan.stay.name}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        {plan.checkInDate} to {plan.checkOutDate}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border border-[#0F172A]/10 bg-[#0F172A] p-6 text-white">
          <p className="mb-4 font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300">
            {t("planner.review.whatsappRequest")}
          </p>
          <p className="mb-6 text-sm leading-7 text-white/75">
            {t("planner.review.whatsappDescription")}
          </p>
          <p className="mb-2 text-sm text-white/60">{t("planner.review.adminWhatsApp")}</p>
          <p className="mb-6 font-cinzel text-xl text-white">
            {adminPhoneNumber}
          </p>
          <p className="mb-6 text-sm text-white/80">
            {reviewData.serviceIncluded}
          </p>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="rounded-2xl bg-amber-400 text-[#0F172A] hover:bg-amber-300"
            onClick={() =>
              window.open(whatsappHref, "_blank", "noopener,noreferrer")
            }
          >
            {t("common.requestViaWhatsApp")}
          </Button>
        </Card>
      </div>
    </div>
  );
}
