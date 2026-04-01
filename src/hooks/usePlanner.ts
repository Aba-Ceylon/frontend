import { useCallback, useEffect, useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import {
  buildPlannerReviewData,
  COMFORT_LEVELS,
  filterVehiclesForPlanner,
  getPlannerSteps,
  getTripDateRange,
  getVehicleTypes,
  normalizeStayPlanDates,
  recommendStaysForDestinations,
  validateStayPlan,
  validateTripDetails,
} from "@/lib/planner/plannerHelpers";
import { fetchAllVehicles } from "@/services/fleetService";
import { fetchStays } from "@/services/stayService";
import type {
  AccommodationMode,
  ComfortLevel,
  PlannerFormState,
  PlannerStaySelection,
  RecommendedStay,
} from "@/types/planner";
import type { Stay } from "@/types/stay";
import type { FleetVehicle } from "@/types/vehicle";

const DEFAULT_FORM: PlannerFormState = {
  arrivalDate: "",
  sriLankaStayDays: 7,
  travelStartDate: "",
  travelDays: 5,
  selectedDestinationIds: [],
  vehicleType: "",
  comfortLevel: "",
  selectedVehicleId: "",
  accommodationMode: "",
  selectedStayPlans: [],
};

export function usePlanner() {
  const [form, setForm] = useState<PlannerFormState>(DEFAULT_FORM);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadPlannerData() {
      setIsLoading(true);
      setLoadingError(null);

      try {
        const [vehicleRows, stayRows] = await Promise.all([
          fetchAllVehicles(),
          fetchStays(),
        ]);

        if (!active) {
          return;
        }

        setVehicles(vehicleRows);
        setStays(stayRows);
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load planner data.";
        setLoadingError(message);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadPlannerData();

    return () => {
      active = false;
    };
  }, []);

  const steps = useMemo(() => getPlannerSteps(), []);

  const selectedDestinations = useMemo(
    () =>
      destinations.filter((destination) =>
        form.selectedDestinationIds.includes(destination.id),
      ),
    [form.selectedDestinationIds],
  );

  const vehicleTypes = useMemo(() => getVehicleTypes(vehicles), [vehicles]);

  const filteredVehicles = useMemo(
    () =>
      filterVehiclesForPlanner(vehicles, form.vehicleType, form.comfortLevel),
    [form.comfortLevel, form.vehicleType, vehicles],
  );

  const selectedVehicle = useMemo(
    () =>
      vehicles.find((vehicle) => vehicle.id === form.selectedVehicleId) || null,
    [form.selectedVehicleId, vehicles],
  );

  const recommendedStays = useMemo(
    () => recommendStaysForDestinations(stays, selectedDestinations),
    [selectedDestinations, stays],
  );

  const selectedStayPlans = useMemo(
    () =>
      form.selectedStayPlans.reduce<
        Array<PlannerStaySelection & { stay: RecommendedStay }>
      >((plans, plan) => {
        const stay = recommendedStays.find(
          (recommendedStay) => recommendedStay.id === plan.stayId,
        );

        if (!stay) {
          return plans;
        }

        plans.push({
          ...normalizeStayPlanDates(plan, form),
          stay,
        });

        return plans;
      }, []),
    [form, recommendedStays],
  );

  const reviewData = useMemo(
    () =>
      buildPlannerReviewData({
        tripDetails: form,
        destinationCount: selectedDestinations.length,
        accommodationMode: form.accommodationMode,
        selectedStayCount: selectedStayPlans.length,
      }),
    [form, selectedDestinations.length, selectedStayPlans.length],
  );

  const tripValidationIssues = useMemo(() => validateTripDetails(form), [form]);

  const isTripStepValid = tripValidationIssues.length === 0;
  const isDestinationStepValid = form.selectedDestinationIds.length > 0;
  const isVehicleStepValid =
    Boolean(form.vehicleType) &&
    Boolean(form.comfortLevel) &&
    Boolean(form.selectedVehicleId);
  const isAccommodationStepValid =
    form.accommodationMode === "own"
      ? true
      : form.accommodationMode === "recommended"
        ? selectedStayPlans.length > 0 &&
          selectedStayPlans.every((plan) => validateStayPlan(plan, form))
        : false;

  const stepValidity = [
    isTripStepValid,
    isDestinationStepValid,
    isVehicleStepValid,
    isAccommodationStepValid,
    isTripStepValid &&
      isDestinationStepValid &&
      isVehicleStepValid &&
      isAccommodationStepValid,
  ];

  const updateField = useCallback(
    <Key extends keyof PlannerFormState>(
      key: Key,
      value: PlannerFormState[Key],
    ) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const toggleDestination = useCallback((destinationId: string) => {
    setForm((current) => {
      const isSelected = current.selectedDestinationIds.includes(destinationId);

      return {
        ...current,
        selectedDestinationIds: isSelected
          ? current.selectedDestinationIds.filter((id) => id !== destinationId)
          : [...current.selectedDestinationIds, destinationId],
      };
    });
  }, []);

  const setVehicleType = useCallback((vehicleType: string) => {
    setForm((current) => ({
      ...current,
      vehicleType,
      selectedVehicleId: "",
    }));
  }, []);

  const setComfortLevel = useCallback((comfortLevel: ComfortLevel) => {
    setForm((current) => ({
      ...current,
      comfortLevel,
      selectedVehicleId: "",
    }));
  }, []);

  const setAccommodationMode = useCallback((mode: AccommodationMode) => {
    setForm((current) => ({
      ...current,
      accommodationMode: mode,
      selectedStayPlans:
        mode === "recommended" ? current.selectedStayPlans : [],
    }));
  }, []);

  const toggleStaySelection = useCallback((stayId: string) => {
    setForm((current) => {
      const existing = current.selectedStayPlans.find(
        (plan) => plan.stayId === stayId,
      );

      if (existing) {
        return {
          ...current,
          selectedStayPlans: current.selectedStayPlans.filter(
            (plan) => plan.stayId !== stayId,
          ),
        };
      }

      const range = getTripDateRange(current);

      const nextPlan: PlannerStaySelection = normalizeStayPlanDates(
        {
          stayId,
          checkInDate: range.startDate,
          checkOutDate: range.endDate || range.startDate,
        },
        current,
      );

      return {
        ...current,
        selectedStayPlans: [...current.selectedStayPlans, nextPlan],
      };
    });
  }, []);

  const updateStayPlan = useCallback(
    (
      stayId: string,
      field: keyof Omit<PlannerStaySelection, "stayId">,
      value: string,
    ) => {
      setForm((current) => ({
        ...current,
        selectedStayPlans: current.selectedStayPlans.map((plan) =>
          plan.stayId === stayId ? { ...plan, [field]: value } : plan,
        ),
      }));
    },
    [],
  );

  const goToNextStep = useCallback(() => {
    setCurrentStep((current) =>
      Math.min(current + 1, Math.max(steps.length - 1, 0)),
    );
  }, [steps.length]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((current) => Math.max(current - 1, 0));
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  return {
    allDestinations: destinations,
    comfortLevels: COMFORT_LEVELS,
    currentStep,
    filteredVehicles,
    form,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isAccommodationStepValid,
    isDestinationStepValid,
    isLoading,
    isTripStepValid,
    isVehicleStepValid,
    loadingError,
    recommendedStays,
    reviewData,
    selectedDestinations,
    selectedStayPlans,
    selectedVehicle,
    setAccommodationMode,
    setComfortLevel,
    setVehicleType,
    stays,
    stepValidity,
    steps,
    toggleDestination,
    toggleStaySelection,
    tripValidationIssues,
    updateField,
    updateStayPlan,
    vehicleTypes,
    vehicles,
  };
}
