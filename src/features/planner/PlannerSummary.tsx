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
      <div>
        <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
          Review & Send Request
        </p>
        <h2 className="font-cinzel text-3xl text-[#0F172A]">
          Review your custom journey details and send your request
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 xl:col-span-2">
          <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500 mb-4">
            Custom Journey Summary
          </p>
          <div className="space-y-6">
            <div>
              <p className="font-cinzel text-lg text-[#0F172A] mb-2">
                Traveler
              </p>
              <p className="text-sm text-neutral-700 leading-6">
                {travelerName || "Signed-in Traveler"}
                {travelerEmail ? ` • ${travelerEmail}` : ""}
              </p>
            </div>

            <div>
              <p className="font-cinzel text-lg text-[#0F172A] mb-2">Trip</p>
              <p className="text-sm text-neutral-700 leading-6">
                {reviewData.tripLabel}
              </p>
            </div>

            <div>
              <p className="font-cinzel text-lg text-[#0F172A] mb-2">
                Destinations
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDestinations.map((destination) => (
                  <span
                    key={destination.id}
                    className="rounded-full bg-neutral-100 px-3 py-2 text-sm text-neutral-700"
                  >
                    {destination.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-cinzel text-lg text-[#0F172A] mb-2">Vehicle</p>
              {selectedVehicle ? (
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="font-cinzel text-xl text-[#0F172A]">
                    {selectedVehicle.brandName} {selectedVehicle.name}
                  </p>
                  <p className="text-sm text-neutral-600 mt-2">
                    {selectedVehicle.shortDescription}
                  </p>
                </div>
              ) : null}
            </div>

            <div>
              <p className="font-cinzel text-lg text-[#0F172A] mb-2">
                Accommodation
              </p>
              <p className="whitespace-pre-line text-sm text-neutral-700 leading-7">
                {reviewData.accommodationNote}
              </p>
              {accommodationMode === "recommended" &&
              selectedStayPlans.length ? (
                <div className="mt-4 grid gap-3">
                  {selectedStayPlans.map((plan) => (
                    <div
                      key={plan.stayId}
                      className="rounded-2xl border border-neutral-200 p-4"
                    >
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {plan.stay.name}
                      </p>
                      <p className="text-sm text-neutral-600 mt-1">
                        {plan.checkInDate} to {plan.checkOutDate}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#0F172A]/10 bg-[#0F172A] p-6 text-white">
          <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300 mb-4">
            WhatsApp Request
          </p>
          <p className="text-sm text-white/75 leading-7 mb-6">
            Your planner request will open a pre-filled WhatsApp message ready
            to send to the system administrator.
          </p>
          <p className="text-sm text-white/60 mb-2">Admin WhatsApp</p>
          <p className="font-cinzel text-xl text-white mb-6">
            {adminPhoneNumber}
          </p>
          <p className="text-sm text-white/80 mb-6">
            {reviewData.serviceIncluded}
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-4 font-cinzel text-sm uppercase tracking-[0.24em] text-[#0F172A] transition hover:bg-amber-300"
          >
            Request via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
