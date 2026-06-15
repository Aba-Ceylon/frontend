"use client";

import { useEffect, useMemo, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StepHeader from "@/components/ui/StepHeader";
import ValidationErrors from "@/components/ui/ValidationErrors";
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

const {
  getRequiredSriLankaStayDays,
  getSriLankaDepartureDate,
  getTripEndDate,
} = plannerDateHelpers();

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
  const sriLankaDepartureDate = getSriLankaDepartureDate(
    form.arrivalDate,
    form.sriLankaStayDays,
  );
  const requiredSriLankaStayDays = getRequiredSriLankaStayDays(form);
  const canContinue = stepValidity[currentStep];
  const currentStepValidationIssues = [
    tripValidationIssues,
    destinationValidationIssues,
    vehicleValidationIssues,
    [...accommodationModeValidationIssues, ...stayValidationIssues],
    [],
  ][currentStep];

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    goToNextStep();
  };

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
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4)_0%,rgba(246,240,230,0.9)_38%,rgba(239,230,216,0.92)_100%)]"
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
          className="overflow-hidden border border-[#182231]/8 bg-[#f8f3ea] shadow-[0_24px_70px_rgba(17,24,39,0.06)]"
        >
          <div className="relative min-h-[440px] sm:min-h-[500px]">
            <div
              ref={heroBackgroundRef}
              className="absolute inset-0 scale-[1.08] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/planner.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,240,230,0.94),rgba(246,240,230,0.78),rgba(246,240,230,0.42))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(191,146,48,0.18),transparent_24%)]" />
            <div
              ref={heroContentRef}
              className="relative flex min-h-[440px] sm:min-h-[500px] items-end px-6 py-12 sm:px-10 sm:py-14"
            >
              <div className="max-w-4xl">
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-px w-14 bg-gradient-to-r from-transparent to-amber-300" />
                  <span className="font-cinzel text-xs uppercase tracking-[0.34em] text-amber-700">
                    Protected Journey Planner
                  </span>
                  <div className="h-px w-14 bg-gradient-to-l from-transparent to-amber-300" />
                </div>
                <h1 className="font-cinzel text-4xl sm:text-6xl text-[#182231] leading-tight">
                  Curate A Fully Custom Sri Lanka Journey
                </h1>
                <p className="mt-5 max-w-2xl text-[#445062] text-base sm:text-lg leading-8">
                  Build your own route, match it with the right chauffeur
                  vehicle, decide how accommodation should work, and send the
                  full request straight to the ABA Ceylon team through WhatsApp.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="border border-[#182231]/8 bg-[rgba(255,253,248,0.84)] px-4 py-2 text-sm text-[#445062]">
                    Signed-in planner access
                  </span>
                  <span className="border border-[#182231]/8 bg-[rgba(255,253,248,0.84)] px-4 py-2 text-sm text-[#445062]">
                    Multi-destination custom route
                  </span>
                  <span className="border border-[#182231]/8 bg-[rgba(255,253,248,0.84)] px-4 py-2 text-sm text-[#445062]">
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
          className="mt-8 border border-[#182231]/8 bg-[rgba(255,253,248,0.84)] backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]"
        >
          {isLoading ? (
            <div className="border border-neutral-200 bg-white p-10 text-center">
              <p className="font-cinzel text-2xl text-[#0F172A] mb-3">
                Loading Planner Data
              </p>
              <p className="text-neutral-600">
                Fetching vehicles, stays, and route recommendations for your
                custom trip.
              </p>
            </div>
          ) : loadingError ? (
            <div className="border border-red-200 bg-red-50 p-8">
              <p className="font-cinzel text-2xl text-red-900 mb-3">
                Planner Data Couldn&apos;t Load
              </p>
              <p className="text-red-700">{loadingError}</p>
            </div>
          ) : (
            <>
              {currentStep === 0 ? (
                <div className="space-y-8">
                  <StepHeader
                    eyebrow="Step 1"
                    title="Trip Details"
                    description="Tell us when you arrive in Sri Lanka, how long you plan to stay, and how many days of guided travel you want us to arrange."
                  />

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Card variant="white" className="p-5">
                      <Input
                        label="Arrival Date In Sri Lanka"
                        type="date"
                        value={form.arrivalDate}
                        onChange={(event) =>
                          updateField("arrivalDate", event.target.value)
                        }
                      />
                    </Card>

                    <Card variant="white" className="p-5">
                      <Input
                        label="Total Days In Sri Lanka"
                        type="number"
                        min={1}
                        value={form.sriLankaStayDays}
                        onChange={(event) =>
                          updateField(
                            "sriLankaStayDays",
                            Math.max(1, Number(event.target.value) || 1),
                          )
                        }
                      />
                    </Card>

                    <Card variant="white" className="p-5">
                      <Input
                        label="Travel Start Date"
                        type="date"
                        value={form.travelStartDate}
                        min={form.arrivalDate || undefined}
                        onChange={(event) =>
                          updateField("travelStartDate", event.target.value)
                        }
                      />
                    </Card>

                    <Card variant="white" className="p-5">
                      <Input
                        label="Travel Days With Driver"
                        type="number"
                        min={1}
                        value={form.travelDays}
                        onChange={(event) =>
                          updateField(
                            "travelDays",
                            Math.max(1, Number(event.target.value) || 1),
                          )
                        }
                      />
                    </Card>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-4">
                    <Card variant="white" className="p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        Travel Window
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {form.travelStartDate
                          ? `${form.travelStartDate} to ${tripEndDate || form.travelStartDate}`
                          : "Choose a travel start date"}
                      </p>
                    </Card>
                    <Card variant="white" className="p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        Sri Lanka Departure
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {sriLankaDepartureDate ||
                          "Choose your arrival and stay duration"}
                      </p>
                    </Card>
                    <Card variant="white" className="p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        Minimum Stay Needed
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {requiredSriLankaStayDays} day
                        {requiredSriLankaStayDays === 1 ? "" : "s"}
                      </p>
                      <p className="mt-2 text-sm text-neutral-600">
                        Based on your arrival date, route start date, and route
                        duration.
                      </p>
                    </Card>
                    <Card variant="white" className="p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        Signed-in Traveler
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {travelerName || "Signed-in traveler"}
                      </p>
                      <p className="mt-2 text-sm text-neutral-600">
                        {travelerEmail || "No email available"}
                      </p>
                    </Card>
                  </div>

                  <ValidationErrors
                    issues={tripValidationIssues}
                    title="Please fix these details before continuing"
                  />

                  {!tripValidationIssues.length &&
                  form.arrivalDate &&
                  form.travelStartDate ? (
                    <Card
                      variant="glass"
                      className="border border-emerald-200/70 bg-emerald-50/80 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-cinzel text-lg text-emerald-900">
                            Trip details look valid
                          </p>
                          <p className="mt-2 text-sm leading-6 text-emerald-800">
                            Your current stay window supports this guided route,
                            so you can continue to destination selection.
                          </p>
                        </div>
                        <Badge
                          variant="green"
                          className="w-fit border-emerald-300 bg-emerald-100 text-emerald-800"
                        >
                          Ready
                        </Badge>
                      </div>
                    </Card>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0}
                  className="border-neutral-300 text-neutral-700 hover:bg-white"
                >
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    {!canContinue && currentStepValidationIssues.length ? (
                      <p className="text-sm text-red-700">
                        Complete the required details in this step to continue.
                      </p>
                    ) : null}
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleContinue}
                      disabled={!canContinue}
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#182231] px-6 py-3 font-cinzel text-sm uppercase tracking-[0.24em] text-white transition hover:bg-[#243142]"
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
