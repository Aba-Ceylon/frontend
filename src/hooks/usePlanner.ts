import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  buildPlannerReviewData,
  COMFORT_LEVELS,
  filterVehiclesForPlanner,
  getPlannerSteps,
  getTripDateRange,
  getVehicleTypes,
  normalizeStayPlanDates,
  recommendStaysForDestinations,
  validateAccommodationMode,
  validateDestinationSelection,
  validateRecommendedStaySelection,
  validateTripDetails,
  validateVehicleSelection,
} from "@/lib/planner/plannerHelpers";
import { fetchDestinations } from "@/services/destinationService";
import { fetchAllVehicles } from "@/services/fleetService";
import { fetchStays } from "@/services/stayService";
import type { Destination } from "@/types/destination";
import type {
  AccommodationMode,
  ComfortLevel,
  PlannerFormState,
  PlannerStaySelection,
  RecommendedStay,
} from "@/types/planner";
import type { Stay } from "@/types/stay";
import type { FleetVehicle } from "@/types/vehicle";

// ─── State & Actions ────────────────────────────────────────────────────────

interface PlannerState {
  form: PlannerFormState;
  destinations: Destination[];
  vehicles: FleetVehicle[];
  stays: Stay[];
  isLoading: boolean;
  loadingError: string | null;
  currentStep: number;
}

type PlannerAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; destinations: Destination[]; vehicles: FleetVehicle[]; stays: Stay[] }
  | { type: "LOAD_ERROR"; message: string }
  | { type: "UPDATE_FIELD"; key: keyof PlannerFormState; value: PlannerFormState[keyof PlannerFormState] }
  | { type: "TOGGLE_DESTINATION"; id: string }
  | { type: "SET_VEHICLE_TYPE"; vehicleType: string }
  | { type: "SET_COMFORT_LEVEL"; comfortLevel: ComfortLevel }
  | { type: "SET_ACCOMMODATION_MODE"; mode: AccommodationMode }
  | { type: "TOGGLE_STAY"; stayId: string; startDate: string; endDate: string }
  | { type: "UPDATE_STAY_PLAN"; stayId: string; field: keyof Omit<PlannerStaySelection, "stayId">; value: string }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "STEP_NEXT"; maxStep: number }
  | { type: "STEP_PREV" };

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

const INITIAL_STATE: PlannerState = {
  form: DEFAULT_FORM,
  destinations: [],
  vehicles: [],
  stays: [],
  isLoading: true,
  loadingError: null,
  currentStep: 0,
};

function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, loadingError: null };

    case "LOAD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        destinations: action.destinations,
        vehicles: action.vehicles,
        stays: action.stays,
      };

    case "LOAD_ERROR":
      return { ...state, isLoading: false, loadingError: action.message };

    case "UPDATE_FIELD":
      return { ...state, form: { ...state.form, [action.key]: action.value } };

    case "TOGGLE_DESTINATION": {
      const ids = state.form.selectedDestinationIds;
      const next = ids.includes(action.id)
        ? ids.filter((id) => id !== action.id)
        : [...ids, action.id];
      return { ...state, form: { ...state.form, selectedDestinationIds: next } };
    }

    case "SET_VEHICLE_TYPE":
      return { ...state, form: { ...state.form, vehicleType: action.vehicleType, selectedVehicleId: "" } };

    case "SET_COMFORT_LEVEL":
      return { ...state, form: { ...state.form, comfortLevel: action.comfortLevel, selectedVehicleId: "" } };

    case "SET_ACCOMMODATION_MODE":
      return {
        ...state,
        form: {
          ...state.form,
          accommodationMode: action.mode,
          selectedStayPlans: action.mode === "recommended" ? state.form.selectedStayPlans : [],
        },
      };

    case "TOGGLE_STAY": {
      const existing = state.form.selectedStayPlans.find((p) => p.stayId === action.stayId);
      if (existing) {
        return {
          ...state,
          form: {
            ...state.form,
            selectedStayPlans: state.form.selectedStayPlans.filter((p) => p.stayId !== action.stayId),
          },
        };
      }
      const nextPlan = normalizeStayPlanDates(
        { stayId: action.stayId, checkInDate: action.startDate, checkOutDate: action.endDate },
        state.form,
      );
      return {
        ...state,
        form: { ...state.form, selectedStayPlans: [...state.form.selectedStayPlans, nextPlan] },
      };
    }

    case "UPDATE_STAY_PLAN":
      return {
        ...state,
        form: {
          ...state.form,
          selectedStayPlans: state.form.selectedStayPlans.map((p) =>
            p.stayId === action.stayId ? { ...p, [action.field]: action.value } : p,
          ),
        },
      };

    case "GO_TO_STEP":
      return { ...state, currentStep: action.step };

    case "STEP_NEXT":
      return { ...state, currentStep: Math.min(state.currentStep + 1, action.maxStep) };

    case "STEP_PREV":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };

    default:
      return state;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePlanner() {
  const [state, dispatch] = useReducer(plannerReducer, INITIAL_STATE);
  const { form, destinations, vehicles, stays, isLoading, loadingError, currentStep } = state;

  // Data loading — single batched dispatch
  useEffect(() => {
    let active = true;
    dispatch({ type: "LOAD_START" });

    Promise.all([fetchDestinations(), fetchAllVehicles(), fetchStays()])
      .then(([d, v, s]) => {
        if (!active) return;
        dispatch({ type: "LOAD_SUCCESS", destinations: d, vehicles: v, stays: s });
      })
      .catch((err) => {
        if (!active) return;
        dispatch({ type: "LOAD_ERROR", message: err instanceof Error ? err.message : "Failed to load planner data." });
      });

    return () => { active = false; };
  }, []);

  const steps = useMemo(() => getPlannerSteps(), []);

  const selectedDestinations = useMemo(
    () => destinations.filter((d) => form.selectedDestinationIds.includes(d.id)),
    [destinations, form.selectedDestinationIds],
  );

  const vehicleTypes = useMemo(() => getVehicleTypes(vehicles), [vehicles]);

  const filteredVehicles = useMemo(
    () => filterVehiclesForPlanner(vehicles, form.vehicleType, form.comfortLevel),
    [vehicles, form.vehicleType, form.comfortLevel],
  );

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === form.selectedVehicleId) ?? null,
    [vehicles, form.selectedVehicleId],
  );

  const recommendedStays = useMemo(
    () => recommendStaysForDestinations(stays, selectedDestinations),
    [stays, selectedDestinations],
  );

  const selectedStayPlans = useMemo(
    () =>
      form.selectedStayPlans.reduce<Array<PlannerStaySelection & { stay: RecommendedStay }>>(
        (acc, plan) => {
          const stay = recommendedStays.find((s) => s.id === plan.stayId);
          if (stay) acc.push({ ...normalizeStayPlanDates(plan, form), stay });
          return acc;
        },
        [],
      ),
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

  // Validations
  const tripValidationIssues = useMemo(() => validateTripDetails(form), [form]);
  const destinationValidationIssues = useMemo(
    () => validateDestinationSelection(form.selectedDestinationIds),
    [form.selectedDestinationIds],
  );
  const vehicleValidationIssues = useMemo(
    () => validateVehicleSelection({ comfortLevel: form.comfortLevel, filteredVehicleCount: filteredVehicles.length, selectedVehicleId: form.selectedVehicleId, vehicleType: form.vehicleType }),
    [filteredVehicles.length, form.comfortLevel, form.selectedVehicleId, form.vehicleType],
  );
  const accommodationModeValidationIssues = useMemo(
    () => validateAccommodationMode(form.accommodationMode),
    [form.accommodationMode],
  );
  const stayValidationIssues = useMemo(
    () => validateRecommendedStaySelection({ accommodationMode: form.accommodationMode, details: form, recommendedStaysCount: recommendedStays.length, selectedStayPlans: form.selectedStayPlans }),
    [form, recommendedStays.length],
  );

  const isTripStepValid = tripValidationIssues.length === 0;
  const isDestinationStepValid = destinationValidationIssues.length === 0;
  const isVehicleStepValid = vehicleValidationIssues.length === 0;
  const isAccommodationStepValid = accommodationModeValidationIssues.length === 0 && stayValidationIssues.length === 0;

  const stepValidity = useMemo(
    () => [isTripStepValid, isDestinationStepValid, isVehicleStepValid, isAccommodationStepValid,
      isTripStepValid && isDestinationStepValid && isVehicleStepValid && isAccommodationStepValid],
    [isTripStepValid, isDestinationStepValid, isVehicleStepValid, isAccommodationStepValid],
  );

  // Actions
  const updateField = useCallback(<K extends keyof PlannerFormState>(key: K, value: PlannerFormState[K]) => {
    dispatch({ type: "UPDATE_FIELD", key, value });
  }, []);

  const toggleDestination = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_DESTINATION", id });
  }, []);

  const setVehicleType = useCallback((vehicleType: string) => {
    dispatch({ type: "SET_VEHICLE_TYPE", vehicleType });
  }, []);

  const setComfortLevel = useCallback((comfortLevel: ComfortLevel) => {
    dispatch({ type: "SET_COMFORT_LEVEL", comfortLevel });
  }, []);

  const setAccommodationMode = useCallback((mode: AccommodationMode) => {
    dispatch({ type: "SET_ACCOMMODATION_MODE", mode });
  }, []);

  const toggleStaySelection = useCallback((stayId: string) => {
    const range = getTripDateRange(state.form);
    dispatch({ type: "TOGGLE_STAY", stayId, startDate: range.startDate, endDate: range.endDate || range.startDate });
  }, [state.form]);

  const updateStayPlan = useCallback((stayId: string, field: keyof Omit<PlannerStaySelection, "stayId">, value: string) => {
    dispatch({ type: "UPDATE_STAY_PLAN", stayId, field, value });
  }, []);

  const goToNextStep = useCallback(() => {
    dispatch({ type: "STEP_NEXT", maxStep: steps.length - 1 });
  }, [steps.length]);

  const goToPreviousStep = useCallback(() => {
    dispatch({ type: "STEP_PREV" });
  }, []);

  const goToStep = useCallback((step: number) => {
    const canAccess = stepValidity.slice(0, step).every(Boolean);
    if (canAccess) dispatch({ type: "GO_TO_STEP", step });
  }, [stepValidity]);

  return {
    accommodationModeValidationIssues,
    allDestinations: destinations,
    comfortLevels: COMFORT_LEVELS,
    currentStep,
    destinationValidationIssues,
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
    stayValidationIssues,
    stays,
    stepValidity,
    steps,
    toggleDestination,
    toggleStaySelection,
    tripValidationIssues,
    updateField,
    updateStayPlan,
    vehicleValidationIssues,
    vehicleTypes,
    vehicles,
  };
}
