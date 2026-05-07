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
import { useI18n } from "@/components/i18n/I18nProvider";
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
  const { t } = useI18n();
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
        vehicleType: form.vehicleType || t("common.notSpecified"),
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
      t,
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
                    {t("planner.eyebrow")}
                  </span>
                  <div className="h-px w-14 bg-gradient-to-l from-transparent to-amber-300" />
                </div>
                <h1 className="font-cinzel text-4xl sm:text-6xl text-white leading-tight">
                  {t("planner.title")}
                </h1>
                <p className="mt-5 max-w-2xl text-white/82 text-base sm:text-lg leading-8">
                  {t("planner.description")}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                    {t("planner.signedInAccess")}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                    {t("planner.multiDestination")}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                    {t("planner.whatsappReady")}
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
                {t("planner.loadingTitle")}
              </p>
              <p className="text-neutral-600">
                {t("planner.loadingDescription")}
              </p>
            </div>
          ) : loadingError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <p className="font-cinzel text-2xl text-red-900 mb-3">
                {t("planner.loadErrorTitle")}
              </p>
              <p className="text-red-700">{loadingError}</p>
            </div>
          ) : (
            <>
              {currentStep === 0 ? (
                <div className="space-y-8">
                  <StepHeader
                    eyebrow={t("planner.trip.eyebrow")}
                    title={t("planner.trip.title")}
                    description={t("planner.trip.description")}
                  />

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Card variant="white" className="rounded-3xl p-5">
                      <Input
                        label={t("planner.trip.arrivalDate")}
                        type="date"
                        value={form.arrivalDate}
                        onChange={(event) =>
                          updateField("arrivalDate", event.target.value)
                        }
                      />
                    </Card>

                    <Card variant="white" className="rounded-3xl p-5">
                      <Input
                        label={t("planner.trip.totalDays")}
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

                    <Card variant="white" className="rounded-3xl p-5">
                      <Input
                        label={t("planner.trip.travelStartDate")}
                        type="date"
                        value={form.travelStartDate}
                        min={form.arrivalDate || undefined}
                        onChange={(event) =>
                          updateField("travelStartDate", event.target.value)
                        }
                      />
                    </Card>

                    <Card variant="white" className="rounded-3xl p-5">
                      <Input
                        label={t("planner.trip.travelDays")}
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
                    <Card variant="white" className="rounded-3xl p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        {t("planner.trip.travelWindow")}
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {form.travelStartDate
                          ? t("common.dateRange", {
                              start: form.travelStartDate,
                              end: tripEndDate || form.travelStartDate,
                            })
                          : t("planner.trip.chooseTravelStart")}
                      </p>
                    </Card>
                    <Card variant="white" className="rounded-3xl p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        {t("planner.trip.departure")}
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {sriLankaDepartureDate ||
                          t("planner.trip.chooseArrivalStay")}
                      </p>
                    </Card>
                    <Card variant="white" className="rounded-3xl p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        {t("planner.trip.minimumStay")}
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {t("common.days", { count: requiredSriLankaStayDays })}
                      </p>
                      <p className="mt-2 text-sm text-neutral-600">
                        {t("planner.trip.basedOnTrip")}
                      </p>
                    </Card>
                    <Card variant="white" className="rounded-3xl p-6">
                      <p className="mb-3 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-600">
                        {t("planner.trip.signedInTraveler")}
                      </p>
                      <p className="font-cinzel text-lg text-[#0F172A]">
                        {travelerName || t("common.signedInTraveler")}
                      </p>
                      <p className="mt-2 text-sm text-neutral-600">
                        {travelerEmail || t("common.noEmailAvailable")}
                      </p>
                    </Card>
                  </div>

                  <ValidationErrors
                    issues={tripValidationIssues}
                    title={t("planner.trip.fixTitle")}
                  />

                  {!tripValidationIssues.length &&
                  form.arrivalDate &&
                  form.travelStartDate ? (
                    <Card
                      variant="glass"
                      className="rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-cinzel text-lg text-emerald-900">
                            {t("planner.trip.validTitle")}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-emerald-800">
                            {t("planner.trip.validDescription")}
                          </p>
                        </div>
                        <Badge
                          variant="green"
                          className="w-fit border-emerald-300 bg-emerald-100 text-emerald-800"
                        >
                          {t("common.ready")}
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
                  className="rounded-2xl border-neutral-300 text-neutral-700 hover:bg-white"
                >
                  {t("common.previous")}
                </Button>
                {currentStep < steps.length - 1 ? (
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    {!canContinue && currentStepValidationIssues.length ? (
                      <p className="text-sm text-red-700">
                        {t("planner.continueHint")}
                      </p>
                    ) : null}
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleContinue}
                      disabled={!canContinue}
                      className="rounded-2xl"
                    >
                      {t("common.continue")}
                    </Button>
                  </div>
                ) : (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-[#0F172A] px-6 py-3 font-cinzel text-sm uppercase tracking-[0.24em] text-amber-300 transition hover:bg-[#18243D]"
                  >
                    {t("common.openWhatsAppRequest")}
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
