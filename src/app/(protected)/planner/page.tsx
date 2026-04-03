"use client";

import { useEffect, useMemo, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AccommodationChoice from "@/features/planner/AccommodationChoice";
import DestinationSelector from "@/features/planner/DestinationSelector";
import PlannerStepper from "@/features/planner/PlannerStepper";
import PlannerSummary from "@/features/planner/PlannerSummary";
import StaySelector from "@/features/planner/StaySelector";
import VehicleSelector from "@/features/planner/VehicleSelector";
import { usePlanner } from "@/hooks/usePlanner";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import {
  buildPlannerWhatsAppMessage,
  plannerDateHelpers,
} from "@/lib/planner/plannerHelpers";

const { getTripEndDate } = plannerDateHelpers();
const INPUT_CLASS =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-[#0F172A] [color-scheme:light] outline-none placeholder:text-neutral-400 focus:border-amber-400";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PlannerPage() {
  const { user } = useUser();
  const pageRef = useRef<HTMLDivElement>(null);
  const pageBackgroundRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBackgroundRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const stepperWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    accommodationModeValidationIssues,
    allDestinations,
    comfortLevels,
    currentStep,
    destinationValidationIssues,
    filteredVehicles,
    form,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isLoading,
    loadingError,
    recommendedStays,
    reviewData,
    selectedDestinations,
    selectedStayPlans,
    selectedVehicle,
    setAccommodationMode,
    setComfortLevel,
    setVehicleType,
    stayValidationIssues,
    stepValidity,
    steps,
    toggleDestination,
    toggleStaySelection,
    tripValidationIssues,
    updateField,
    updateStayPlan,
    vehicleValidationIssues,
    vehicleTypes,
  } = usePlanner();

  const travelerName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "";
  const travelerEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  const whatsappMessage = useMemo(
    () =>
      buildPlannerWhatsAppMessage({
        travelerName,
        travelerEmail,
        tripDetails: form,
        selectedDestinations,
        selectedVehicle,
        selectedStayPlans,
        accommodationMode:
          form.accommodationMode === "recommended" ? "recommended" : "own",
        accommodationNote: reviewData.accommodationNote,
        serviceIncluded: reviewData.serviceIncluded,
        vehicleType: form.vehicleType || "Not selected",
        comfortLevel: form.comfortLevel || "Essential",
      }),
    [
      form,
      reviewData.accommodationNote,
      reviewData.serviceIncluded,
      selectedDestinations,
      selectedStayPlans,
      selectedVehicle,
      travelerEmail,
      travelerName,
    ],
  );

  const { adminPhoneNumber, href: whatsappHref } = useWhatsApp(whatsappMessage);
  const tripEndDate = getTripEndDate(form.travelStartDate, form.travelDays);
  const canContinue = stepValidity[currentStep];

  useEffect(() => {
    if (
      !pageRef.current ||
      !pageBackgroundRef.current ||
      !heroRef.current ||
      !heroBackgroundRef.current ||
      !heroContentRef.current ||
      !stepperWrapRef.current ||
      !panelRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const introTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      introTimeline
        .fromTo(
          heroContentRef.current,
          { y: 56, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.05, delay: 0.08 },
        )
        .fromTo(
          stepperWrapRef.current,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75 },
          "-=0.62",
        )
        .fromTo(
          panelRef.current,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75 },
          "-=0.54",
        );

      gsap.to(heroBackgroundRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(pageBackgroundRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      gsap.to(heroContentRef.current, {
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(246,235,216,0.54)_0%,rgba(245,242,237,0.44)_38%,rgba(232,226,215,0.58)_100%)]"
    >
      <div
        ref={pageBackgroundRef}
        className="absolute inset-0 scale-[1.06] bg-cover bg-center bg-no-repeat opacity-38"
        style={{ backgroundImage: "url('/plannerBakcground.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,240,0.36),rgba(245,242,237,0.5),rgba(234,228,219,0.64))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_42%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.08),transparent_36%)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div
          ref={heroRef}
          className="rounded-[2rem] overflow-hidden border border-[#0F172A]/10 bg-[#0F172A] shadow-[0_30px_120px_rgba(15,23,42,0.28)]"
        >
          <div className="relative min-h-[440px] sm:min-h-[500px]">
            <div
              ref={heroBackgroundRef}
              className="absolute inset-0 scale-[1.08] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/planner.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,15,28,0.72),rgba(15,23,42,0.56),rgba(8,12,20,0.68))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,154,43,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(201,154,43,0.18),transparent_30%)]" />
            <div
              ref={heroContentRef}
              className="relative flex min-h-[440px] sm:min-h-[500px] items-end px-6 py-12 sm:px-10 sm:py-14"
            >
              <div className="max-w-4xl">
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-px w-14 bg-gradient-to-r from-transparent to-amber-300" />
                  <span className="font-cinzel text-xs uppercase tracking-[0.34em] text-amber-300">
                    Protected Journey Planner
                  </span>
                  <div className="h-px w-14 bg-gradient-to-l from-transparent to-amber-300" />
                </div>
                <h1 className="font-cinzel text-4xl sm:text-6xl text-white leading-tight">
                  Curate A Fully Custom Sri Lanka Journey
                </h1>
                <p className="mt-5 max-w-2xl text-white/82 text-base sm:text-lg leading-8">
                  Build your own route, match it with the right chauffeur
                  vehicle, decide how accommodation should work, and send the
                  full request straight to the ABA Ceylon team through WhatsApp.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                    Signed-in planner access
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                    Multi-destination custom route
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                    WhatsApp-ready request summary
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={stepperWrapRef} className="mt-8">
          <PlannerStepper
            currentStep={currentStep}
            onStepClick={goToStep}
            stepValidity={stepValidity}
            steps={steps}
          />
        </div>

        <div
          ref={panelRef}
          className="mt-8 rounded-[2rem] border border-white/55 bg-[rgba(252,250,246,0.74)] backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
        >
          {isLoading ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center">
              <p className="font-cinzel text-2xl text-[#0F172A] mb-3">
                Loading Planner Data
              </p>
              <p className="text-neutral-600">
                Fetching vehicles, stays, and route recommendations for your
                custom trip.
              </p>
            </div>
          ) : loadingError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <p className="font-cinzel text-2xl text-red-900 mb-3">
                Planner Data Couldn&apos;t Load
              </p>
              <p className="text-red-700">{loadingError}</p>
            </div>
          ) : (
            <>
              {currentStep === 0 ? (
                <div className="space-y-8">
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
                      Step 1
                    </p>
                    <h2 className="font-cinzel text-3xl text-[#0F172A]">
                      Trip Details
                    </h2>
                    <p className="text-neutral-600 mt-3 leading-7">
                      Tell us when you arrive in Sri Lanka, how long you plan to
                      stay, and how many days of guided travel you want us to
                      arrange.
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="block rounded-3xl border border-neutral-200 bg-white p-5">
                      <span className="block font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600 mb-3">
                        Arrival Date In Sri Lanka
                      </span>
                      <input
                        type="date"
                        value={form.arrivalDate}
                        onChange={(event) =>
                          updateField("arrivalDate", event.target.value)
                        }
                        className={INPUT_CLASS}
                      />
                    </label>

                    <label className="block rounded-3xl border border-neutral-200 bg-white p-5">
                      <span className="block font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600 mb-3">
                        Total Days In Sri Lanka
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={form.sriLankaStayDays}
                        onChange={(event) =>
                          updateField(
                            "sriLankaStayDays",
                            Math.max(1, Number(event.target.value) || 1),
                          )
                        }
                        className={INPUT_CLASS}
                      />
                    </label>

                    <label className="block rounded-3xl border border-neutral-200 bg-white p-5">
                      <span className="block font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600 mb-3">
                        Travel Start Date
                      </span>
                      <input
                        type="date"
                        value={form.travelStartDate}
                        min={form.arrivalDate || undefined}
                        onChange={(event) =>
                          updateField("travelStartDate", event.target.value)
                        }
                        className={INPUT_CLASS}
                      />
                    </label>

                    <label className="block rounded-3xl border border-neutral-200 bg-white p-5">
                      <span className="block font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600 mb-3">
                        Travel Days With Driver
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={form.travelDays}
                        onChange={(event) =>
                          updateField(
                            "travelDays",
                            Math.max(1, Number(event.target.value) || 1),
                          )
                        }
                        className={INPUT_CLASS}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                      <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600 mb-3">
                        Travel Window
                      </p>
                      <p className="text-lg text-[#0F172A] font-cinzel">
                        {form.travelStartDate
                          ? `${form.travelStartDate} to ${tripEndDate || form.travelStartDate}`
                          : "Choose a travel start date"}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                      <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600 mb-3">
                        Signed-in Traveler
                      </p>
                      <p className="text-lg text-[#0F172A] font-cinzel">
                        {travelerName || "Signed-in traveler"}
                      </p>
                      <p className="text-sm text-neutral-600 mt-2">
                        {travelerEmail || "No email available"}
                      </p>
                    </div>
                  </div>

                  {tripValidationIssues.length ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                      <p className="font-cinzel text-lg text-red-900 mb-3">
                        Please fix these details before continuing
                      </p>
                      <ul className="space-y-2 text-sm text-red-700">
                        {tripValidationIssues.map((issue) => (
                          <li key={issue}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {currentStep === 1 ? (
                <DestinationSelector
                  destinations={allDestinations}
                  onToggleDestination={toggleDestination}
                  selectedDestinationIds={form.selectedDestinationIds}
                  validationIssues={destinationValidationIssues}
                />
              ) : null}

              {currentStep === 2 ? (
                <VehicleSelector
                  comfortLevels={comfortLevels}
                  filteredVehicles={filteredVehicles}
                  selectedComfortLevel={form.comfortLevel}
                  selectedVehicleId={form.selectedVehicleId}
                  selectedVehicleType={form.vehicleType}
                  validationIssues={vehicleValidationIssues}
                  vehicleTypes={vehicleTypes}
                  onComfortChange={setComfortLevel}
                  onVehicleSelect={(vehicleId) =>
                    updateField("selectedVehicleId", vehicleId)
                  }
                  onVehicleTypeChange={setVehicleType}
                />
              ) : null}

              {currentStep === 3 ? (
                <div className="space-y-8">
                  <AccommodationChoice
                    accommodationMode={form.accommodationMode}
                    accommodationNote={reviewData.accommodationNote}
                    validationIssues={accommodationModeValidationIssues}
                    onModeChange={setAccommodationMode}
                  />

                  {form.accommodationMode === "recommended" ? (
                    <StaySelector
                      recommendedStays={recommendedStays}
                      selectedStayPlans={selectedStayPlans}
                      tripEndDate={tripEndDate}
                      tripStartDate={form.travelStartDate}
                      validationIssues={stayValidationIssues}
                      onDateChange={updateStayPlan}
                      onToggleStay={toggleStaySelection}
                    />
                  ) : null}
                </div>
              ) : null}

              {currentStep === 4 ? (
                <PlannerSummary
                  accommodationMode={form.accommodationMode}
                  adminPhoneNumber={adminPhoneNumber}
                  reviewData={reviewData}
                  selectedDestinations={selectedDestinations}
                  selectedStayPlans={selectedStayPlans}
                  selectedVehicle={selectedVehicle}
                  travelerEmail={travelerEmail}
                  travelerName={travelerName}
                  whatsappHref={whatsappHref}
                />
              ) : null}

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0}
                  className="rounded-2xl border border-neutral-300 px-6 py-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-700 transition hover:bg-white disabled:opacity-40"
                >
                  Previous
                </button>
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!canContinue}
                    className="rounded-2xl bg-[#0F172A] px-6 py-3 font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300 transition hover:bg-[#18243D] disabled:opacity-40"
                  >
                    Continue
                  </button>
                ) : (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-[#0F172A] px-6 py-3 font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300 transition hover:bg-[#18243D]"
                  >
                    Open WhatsApp Request
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
