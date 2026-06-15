"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StepHeader from "@/components/ui/StepHeader";
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
  return (
    <div className="space-y-6">
      <StepHeader
        eyebrow="Step 5"
        title="Review your custom journey details and send your request"
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card variant="white" className="p-6 xl:col-span-2">
          <p className="mb-4 font-cinzel text-sm uppercase tracking-[0.24em] text-[#6e7684]">
            Custom Journey Summary
          </p>
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-cinzel text-lg text-[#182231]">Traveler</p>
              <p className="text-sm leading-6 text-[#445062]">
                {travelerName || "Signed-in Traveler"}
                {travelerEmail ? ` - ${travelerEmail}` : ""}
              </p>
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#182231]">Trip</p>
              <p className="text-sm leading-6 text-[#445062]">
                {reviewData.tripLabel}
              </p>
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#182231]">
                Destinations
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDestinations.map((destination) => (
                  <Badge
                    key={destination.id}
                    variant="light"
                    className="border-[#182231]/10 bg-[#f4ecdf] py-2 text-[#445062]"
                  >
                    {destination.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#182231]">Vehicle</p>
              {selectedVehicle ? (
                <Card
                  variant="white"
                  className="border-[#182231]/8 bg-[#f8f3ea] p-4 shadow-none"
                >
                  <p className="font-cinzel text-xl text-[#182231]">
                    {selectedVehicle.brandName} {selectedVehicle.name}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#566173]">
                    {selectedVehicle.shortDescription}
                  </p>
                </Card>
              ) : null}
            </div>

            <div>
              <p className="mb-2 font-cinzel text-lg text-[#182231]">
                Accommodation
              </p>
              <p className="whitespace-pre-line text-sm leading-7 text-[#445062]">
                {reviewData.accommodationNote}
              </p>
              {accommodationMode === "recommended" && selectedStayPlans.length ? (
                <div className="mt-4 grid gap-3">
                  {selectedStayPlans.map((plan) => (
                    <Card
                      key={plan.stayId}
                      variant="white"
                      className="border-[#182231]/8 bg-[#f8f3ea] p-4 shadow-none"
                    >
                      <p className="font-cinzel text-lg text-[#182231]">
                        {plan.stay.name}
                      </p>
                      <p className="mt-1 text-sm text-[#566173]">
                        {plan.checkInDate} to {plan.checkOutDate}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="border-[#182231]/8 bg-[#f8f3ea] p-6 text-[#182231]">
          <p className="mb-4 font-cinzel text-sm uppercase tracking-[0.24em] text-[#8b6b1f]">
            WhatsApp Request
          </p>
          <p className="mb-6 text-sm leading-7 text-[#445062]">
            Your planner request will open as a pre-filled WhatsApp message,
            ready to send directly to the ABA Ceylon team.
          </p>
          <p className="mb-2 text-sm text-[#6e7684]">Admin WhatsApp</p>
          <p className="mb-6 font-cinzel text-xl text-[#182231]">
            {adminPhoneNumber}
          </p>
          <div className="mb-6 border-t border-[#182231]/8 pt-5">
            <p className="text-sm leading-7 text-[#445062]">
              {reviewData.serviceIncluded}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            fullWidth
            className="min-h-13"
            onClick={() =>
              window.open(whatsappHref, "_blank", "noopener,noreferrer")
            }
          >
            Request via WhatsApp
          </Button>
        </Card>
      </div>
    </div>
  );
}
