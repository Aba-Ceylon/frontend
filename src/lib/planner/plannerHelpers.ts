import type { Destination } from "@/types/destination";
import type {
  ComfortLevel,
  PlannerReviewData,
  PlannerStaySelection,
  PlannerTripDetails,
  PlannerWhatsAppContext,
  RecommendedStay,
} from "@/types/planner";
import type { Stay } from "@/types/stay";
import type { FleetVehicle } from "@/types/vehicle";

export const COMFORT_LEVELS: Array<{
  value: ComfortLevel;
  title: string;
  description: string;
}> = [
  {
    value: "Essential",
    title: "Essential",
    description: "Straightforward, practical travel for compact budgets.",
  },
  {
    value: "Comfort",
    title: "Comfort",
    description: "Balanced space and features for relaxed touring.",
  },
  {
    value: "Premium",
    title: "Premium",
    description: "Higher-end comfort with elevated in-car features.",
  },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(value: string) {
  return new Date(`${value}T00:00:00`);
}

function differenceInDays(start: string, end: string) {
  return Math.round(
    (startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_IN_MS,
  );
}

function addDays(value: string, days: number) {
  const date = startOfDay(value);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function toDisplayDate(value: string) {
  if (!value) {
    return "Not specified";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(startOfDay(value));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function getPlannerSteps() {
  return [
    {
      id: "trip",
      title: "Trip Details",
      caption: "Arrival, total stay, and travel duration",
    },
    {
      id: "destinations",
      title: "Destinations",
      caption: "Build your own route",
    },
    {
      id: "vehicle",
      title: "Vehicle",
      caption: "Type, comfort, and exact vehicle",
    },
    {
      id: "accommodation",
      title: "Accommodation",
      caption: "Own stay or recommended stays",
    },
    {
      id: "review",
      title: "Review & Request",
      caption: "Confirm and send to WhatsApp",
    },
  ];
}

export function getVehicleTypes(vehicles: FleetVehicle[]) {
  return Array.from(new Set(vehicles.map((vehicle) => vehicle.type))).sort();
}

export function classifyVehicleComfort(vehicle: FleetVehicle): ComfortLevel {
  const brand = `${vehicle.brandName} ${vehicle.name}`.toLowerCase();
  const features = vehicle.features.join(" ").toLowerCase();

  if (
    /lexus|mercedes|bmw|cadillac|land cruiser|luxury|premium/.test(brand) ||
    /wifi|refreshments|privacy|reclining|premium/.test(features)
  ) {
    return "Premium";
  }

  if (
    vehicle.passengerCapacity >= 5 ||
    /comfort|charging|climate|executive|spacious/.test(features)
  ) {
    return "Comfort";
  }

  return "Essential";
}

export function filterVehiclesForPlanner(
  vehicles: FleetVehicle[],
  vehicleType: string,
  comfortLevel: ComfortLevel | "",
) {
  return vehicles.filter((vehicle) => {
    const typeMatches = vehicleType ? vehicle.type === vehicleType : true;
    const comfortMatches = comfortLevel
      ? classifyVehicleComfort(vehicle) === comfortLevel
      : true;

    return typeMatches && comfortMatches;
  });
}

export function getTripEndDate(travelStartDate: string, travelDays: number) {
  if (!travelStartDate || !travelDays) {
    return "";
  }

  return addDays(travelStartDate, Math.max(travelDays - 1, 0));
}

export function validateTripDetails(details: PlannerTripDetails) {
  const issues: string[] = [];

  if (!details.arrivalDate) {
    issues.push("Arrival date is required.");
  }

  if (details.sriLankaStayDays < 1) {
    issues.push("Total stay in Sri Lanka must be at least 1 day.");
  }

  if (!details.travelStartDate) {
    issues.push("Travel start date is required.");
  }

  if (details.travelDays < 1) {
    issues.push("Travel days must be at least 1 day.");
  }

  if (details.arrivalDate && details.travelStartDate) {
    if (differenceInDays(details.arrivalDate, details.travelStartDate) < 0) {
      issues.push("Travel start date cannot be before your arrival date.");
    }

    const totalWindowUsed =
      differenceInDays(details.arrivalDate, details.travelStartDate) +
      details.travelDays;

    if (totalWindowUsed > details.sriLankaStayDays) {
      issues.push(
        "Travel route duration must fit within your total Sri Lanka stay.",
      );
    }
  }

  return issues;
}

export function validateDestinationSelection(selectedDestinationIds: string[]) {
  const issues: string[] = [];

  if (!selectedDestinationIds.length) {
    issues.push("Select at least one destination for your custom route.");
  }

  return issues;
}

export function validateVehicleSelection(input: {
  comfortLevel: ComfortLevel | "";
  filteredVehicleCount: number;
  selectedVehicleId: string;
  vehicleType: string;
}) {
  const issues: string[] = [];

  if (!input.vehicleType) {
    issues.push("Select a vehicle type.");
  }

  if (!input.comfortLevel) {
    issues.push("Select a comfort level.");
  }

  if (
    input.vehicleType &&
    input.comfortLevel &&
    input.filteredVehicleCount === 0
  ) {
    issues.push(
      "No vehicles match the selected type and comfort level right now.",
    );
  }

  if (!input.selectedVehicleId) {
    issues.push("Choose the exact vehicle you want for this journey.");
  }

  return issues;
}

export function recommendStaysForDestinations(
  stays: Stay[],
  destinations: Destination[],
) {
  if (!destinations.length) {
    return stays.slice(0, 6).map<RecommendedStay>((stay) => ({
      ...stay,
      routeMatchLabel: "Available across your custom route",
      distanceKm: null,
    }));
  }

  return stays
    .map<RecommendedStay>((stay) => {
      if (!stay.coordinates) {
        return {
          ...stay,
          routeMatchLabel: "Recommended for your route",
          distanceKm: null,
        };
      }

      let nearestDestination = destinations[0];
      let nearestDistance = Number.POSITIVE_INFINITY;

      destinations.forEach((destination) => {
        const distance = haversineDistanceKm(
          stay.coordinates!.latitude,
          stay.coordinates!.longitude,
          destination.coordinates[1],
          destination.coordinates[0],
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestDestination = destination;
        }
      });

      return {
        ...stay,
        routeMatchLabel: `Closest to ${nearestDestination.name}`,
        distanceKm: Number.isFinite(nearestDistance)
          ? Math.round(nearestDistance)
          : null,
      };
    })
    .sort((left, right) => {
      const leftDistance = left.distanceKm ?? Number.POSITIVE_INFINITY;
      const rightDistance = right.distanceKm ?? Number.POSITIVE_INFINITY;
      return leftDistance - rightDistance;
    })
    .slice(0, 8);
}

export function getTripDateRange(details: PlannerTripDetails) {
  if (!details.travelStartDate || !details.travelDays) {
    return {
      startDate: "",
      endDate: "",
      label: "Travel dates not selected",
    };
  }

  const endDate = getTripEndDate(details.travelStartDate, details.travelDays);

  return {
    startDate: details.travelStartDate,
    endDate,
    label: `${toDisplayDate(details.travelStartDate)} - ${toDisplayDate(endDate)}`,
  };
}

export function normalizeStayPlanDates(
  plan: PlannerStaySelection,
  details: PlannerTripDetails,
) {
  const range = getTripDateRange(details);
  const defaultCheckIn = range.startDate;
  const defaultCheckOut = range.endDate || range.startDate;

  return {
    ...plan,
    checkInDate: plan.checkInDate || defaultCheckIn,
    checkOutDate: plan.checkOutDate || defaultCheckOut,
  };
}

export function validateStayPlan(
  plan: PlannerStaySelection,
  details: PlannerTripDetails,
) {
  const range = getTripDateRange(details);

  if (!plan.checkInDate || !plan.checkOutDate) {
    return false;
  }

  if (differenceInDays(plan.checkInDate, plan.checkOutDate) < 0) {
    return false;
  }

  if (
    range.startDate &&
    differenceInDays(range.startDate, plan.checkInDate) < 0
  ) {
    return false;
  }

  if (range.endDate && differenceInDays(plan.checkOutDate, range.endDate) < 0) {
    return false;
  }

  return true;
}

export function validateAccommodationMode(
  accommodationMode: "own" | "recommended" | "",
) {
  const issues: string[] = [];

  if (!accommodationMode) {
    issues.push("Choose how you want us to handle accommodation.");
  }

  return issues;
}

export function validateRecommendedStaySelection(input: {
  accommodationMode: "own" | "recommended" | "";
  details: PlannerTripDetails;
  recommendedStaysCount: number;
  selectedStayPlans: PlannerStaySelection[];
}) {
  const issues: string[] = [];

  if (input.accommodationMode !== "recommended") {
    return issues;
  }

  if (!input.recommendedStaysCount) {
    issues.push(
      "No recommended stays are available for this route yet. Choose your own accommodation or adjust the route.",
    );
  }

  if (!input.selectedStayPlans.length) {
    issues.push(
      "Select at least one stay for the recommended accommodation option.",
    );
  }

  if (
    input.selectedStayPlans.some(
      (plan) => !validateStayPlan(plan, input.details),
    )
  ) {
    issues.push(
      "Review stay dates so they fit within your selected travel window.",
    );
  }

  return issues;
}

export function buildAccommodationNote(
  accommodationMode: "own" | "recommended" | "",
  destinationCount: number,
  travelDays: number,
  selectedStayCount: number,
) {
  if (accommodationMode === "own") {
    return `Accommodation Preference Noted
Since you have your own accommodation arrangements, we'll focus on providing you with the perfect vehicle and driver for your selected route through ${destinationCount} destination${destinationCount === 1 ? "" : "s"}.

Service Included: Vehicle hire with experienced chauffeur guide for ${travelDays} day${travelDays === 1 ? "" : "s"}.`;
  }

  if (accommodationMode === "recommended") {
    return `Accommodation Preference Noted
We'll combine your selected route with recommended stays that best suit your destinations and travel dates.

Recommended Stay Plan: ${selectedStayCount} accommodation${selectedStayCount === 1 ? "" : "s"} selected for your ${travelDays}-day route.`;
  }

  return "Select how you would like us to handle accommodation for your route.";
}

export function buildPlannerReviewData(input: {
  tripDetails: PlannerTripDetails;
  destinationCount: number;
  accommodationMode: "own" | "recommended" | "";
  selectedStayCount: number;
}): PlannerReviewData {
  const tripRange = getTripDateRange(input.tripDetails);

  return {
    tripLabel: `${toDisplayDate(input.tripDetails.arrivalDate)} arrival • ${input.tripDetails.sriLankaStayDays} days in Sri Lanka • ${tripRange.label}`,
    serviceIncluded: `Vehicle hire with experienced chauffeur guide for ${input.tripDetails.travelDays} day${input.tripDetails.travelDays === 1 ? "" : "s"}.`,
    accommodationNote: buildAccommodationNote(
      input.accommodationMode,
      input.destinationCount,
      input.tripDetails.travelDays,
      input.selectedStayCount,
    ),
    totalDestinations: input.destinationCount,
  };
}

export function formatStayPlanLabel(
  stayName: string,
  checkInDate: string,
  checkOutDate: string,
) {
  return `${stayName}: ${toDisplayDate(checkInDate)} to ${toDisplayDate(checkOutDate)}`;
}

export function buildPlannerWhatsAppMessage(context: PlannerWhatsAppContext) {
  const destinationLines = context.selectedDestinations.length
    ? context.selectedDestinations
        .map(
          (destination, index) =>
            `${index + 1}. ${destination.name} (${destination.region})`,
        )
        .join("\n")
    : "None selected";
  const stayLines =
    context.accommodationMode === "recommended" &&
    context.selectedStayPlans.length
      ? context.selectedStayPlans
          .map(
            (plan, index) =>
              `${index + 1}. ${formatStayPlanLabel(
                plan.stay.name,
                plan.checkInDate,
                plan.checkOutDate,
              )}`,
          )
          .join("\n")
      : "Traveler has own accommodation";

  return `Custom Planner Request

Traveler: ${context.travelerName || "Signed-in traveler"}
Email: ${context.travelerEmail || "Not provided"}

Arrival in Sri Lanka: ${toDisplayDate(context.tripDetails.arrivalDate)}
Total stay in Sri Lanka: ${context.tripDetails.sriLankaStayDays} days
Travel start date: ${toDisplayDate(context.tripDetails.travelStartDate)}
Travel duration: ${context.tripDetails.travelDays} days

Destinations:
${destinationLines}

Vehicle Type: ${context.vehicleType}
Comfort Level: ${context.comfortLevel}
Selected Vehicle: ${context.selectedVehicle ? `${context.selectedVehicle.brandName} ${context.selectedVehicle.name}` : "Not selected"}

Accommodation Mode: ${context.accommodationMode === "recommended" ? "Recommended stays" : "Own accommodation"}
${context.accommodationNote}

Selected Stays:
${stayLines}

Service Included:
${context.serviceIncluded}`;
}

export function plannerDateHelpers() {
  return {
    addDays,
    getTripEndDate,
    toDisplayDate,
  };
}
