import type { Destination } from "@/types/destination";
import type {
  ComfortLevel,
  PlannerReviewData,
  PlannerRouteEstimate,
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
const BANDARANAIKE_AIRPORT = {
  name: "Bandaranaike International Airport",
  coordinates: [79.8841, 7.1808] as [number, number],
};

function startOfDay(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function differenceInDays(start: string, end: string) {
  return Math.round(
    (startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_IN_MS,
  );
}

function addDays(value: string, days: number) {
  const date = startOfDay(value);
  date.setUTCDate(date.getUTCDate() + days);
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

export function getSriLankaDepartureDate(
  arrivalDate: string,
  sriLankaStayDays: number,
) {
  if (!arrivalDate || !sriLankaStayDays) {
    return "";
  }

  return addDays(arrivalDate, Math.max(sriLankaStayDays - 1, 0));
}

export function getRequiredSriLankaStayDays(details: PlannerTripDetails) {
  if (!details.travelDays) {
    return 1;
  }

  if (!details.arrivalDate || !details.travelStartDate) {
    return details.travelDays;
  }

  const daysBeforeRouteStarts = differenceInDays(
    details.arrivalDate,
    details.travelStartDate,
  );

  if (daysBeforeRouteStarts < 0) {
    return details.travelDays;
  }

  return daysBeforeRouteStarts + details.travelDays;
}

export function getSriLankaStayLength(arrivalDate: string, departureDate: string) {
  if (!arrivalDate || !departureDate) {
    return { calendarDays: 0, nights: 0 };
  }

  const nights = differenceInDays(arrivalDate, departureDate);
  if (nights < 0) {
    return { calendarDays: 0, nights: 0 };
  }

  return { calendarDays: nights + 1, nights };
}

export function calculatePlannerRouteEstimate(
  destinations: Destination[],
  options: {
    vehicleFromArrival: boolean;
    departureAirportTransfer: boolean;
  },
): PlannerRouteEstimate {
  const routePoints = destinations.map((destination) => ({
    name: destination.name,
    coordinates: destination.coordinates,
  }));

  if (options.vehicleFromArrival && routePoints.length) {
    routePoints.unshift(BANDARANAIKE_AIRPORT);
  }

  if (options.departureAirportTransfer && routePoints.length) {
    routePoints.push(BANDARANAIKE_AIRPORT);
  }

  const legs = routePoints.slice(1).map((point, index) => {
    const previous = routePoints[index];
    const directDistance = haversineDistanceKm(
      previous.coordinates[1],
      previous.coordinates[0],
      point.coordinates[1],
      point.coordinates[0],
    );

    return {
      from: previous.name,
      to: point.name,
    distanceKm: Math.max(1, Math.round(directDistance * 1.25)),
    };
  });

  return {
    totalDistanceKm: legs.reduce((total, leg) => total + leg.distanceKm, 0),
    legs,
    includesArrivalPickup: options.vehicleFromArrival,
    includesDepartureTransfer: options.departureAirportTransfer,
    source: "estimate",
  };
}

export function validateTripDetails(details: PlannerTripDetails) {
  const issues: string[] = [];

  if (!details.arrivalDate) {
    issues.push("Arrival date is required.");
  }

  if (!details.departureDate) {
    issues.push("Departure or return-flight date is required.");
  }

  if (!details.travelStartDate) {
    issues.push("Travel start date is required.");
  }

  if (details.travelDays < 1) {
    issues.push("Travel days must be at least 1 day.");
  }

  if (details.arrivalDate && details.departureDate) {
    if (differenceInDays(details.arrivalDate, details.departureDate) < 0) {
      issues.push("Departure date cannot be before your arrival date.");
    }
  }

  if (details.arrivalDate && details.travelStartDate) {
    const daysBeforeRouteStarts = differenceInDays(
      details.arrivalDate,
      details.travelStartDate,
    );

    if (daysBeforeRouteStarts < 0) {
      issues.push("Travel start date cannot be before your arrival date.");
    }

  }

  if (details.departureDate && details.travelStartDate && details.travelDays > 0) {
    const routeEndDate = getTripEndDate(details.travelStartDate, details.travelDays);
    if (routeEndDate && differenceInDays(routeEndDate, details.departureDate) < 0) {
      issues.push(
        `Your ${details.travelDays}-day route ends on ${toDisplayDate(routeEndDate)}, after your departure on ${toDisplayDate(details.departureDate)}. Shorten the route or change the dates.`,
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
  destinations: Destination[];
  accommodationMode: "own" | "recommended" | "";
  selectedStayCount: number;
}): PlannerReviewData {
  const tripRange = getTripDateRange(input.tripDetails);
  const stayLength = getSriLankaStayLength(
    input.tripDetails.arrivalDate,
    input.tripDetails.departureDate,
  );
  const routeEstimate = calculatePlannerRouteEstimate(input.destinations, {
    vehicleFromArrival: input.tripDetails.vehicleFromArrival,
    departureAirportTransfer: input.tripDetails.departureAirportTransfer,
  });
  const chauffeurStartLabel = input.tripDetails.vehicleFromArrival
    ? `Arrival pickup on ${toDisplayDate(input.tripDetails.arrivalDate)}`
    : `Service begins with the tour on ${toDisplayDate(input.tripDetails.travelStartDate)}`;

  return {
    tripLabel: `${toDisplayDate(input.tripDetails.arrivalDate)} arrival - ${toDisplayDate(input.tripDetails.departureDate)} departure - guided route ${tripRange.label}`,
    serviceIncluded: `${chauffeurStartLabel}. Guided vehicle service is planned for ${input.tripDetails.travelDays} day${input.tripDetails.travelDays === 1 ? "" : "s"}.${input.tripDetails.departureAirportTransfer ? " Airport drop-off requested for departure." : " Departure airport transfer not requested."}`,
    accommodationNote: buildAccommodationNote(
      input.accommodationMode,
      input.destinations.length,
      input.tripDetails.travelDays,
      input.selectedStayCount,
    ),
    totalDestinations: input.destinations.length,
    stayLengthLabel: stayLength.calendarDays
      ? `${stayLength.calendarDays} calendar day${stayLength.calendarDays === 1 ? "" : "s"} / ${stayLength.nights} night${stayLength.nights === 1 ? "" : "s"}`
      : "Dates not complete",
    chauffeurStartLabel,
    departureTransferLabel: input.tripDetails.departureAirportTransfer
      ? "Airport drop-off required"
      : "No departure transfer required",
    routeEstimate,
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
  const stayLength = getSriLankaStayLength(
    context.tripDetails.arrivalDate,
    context.tripDetails.departureDate,
  );
  const routeEstimate = context.routeEstimate ?? calculatePlannerRouteEstimate(
    context.selectedDestinations,
    {
      vehicleFromArrival: context.tripDetails.vehicleFromArrival,
      departureAirportTransfer: context.tripDetails.departureAirportTransfer,
    },
  );
  const routeLegLines = routeEstimate.legs.length
    ? routeEstimate.legs
        .map(
          (leg, index) =>
            `${index + 1}. ${leg.from} to ${leg.to}: ~${leg.distanceKm} km`,
        )
        .join("\n")
    : "Route distance requires at least two route points";
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
Departure / return flight: ${toDisplayDate(context.tripDetails.departureDate)}
Time in Sri Lanka: ${stayLength.calendarDays} calendar days / ${stayLength.nights} nights
Travel start date: ${toDisplayDate(context.tripDetails.travelStartDate)}
Travel duration: ${context.tripDetails.travelDays} days
Vehicle needed from arrival: ${context.tripDetails.vehicleFromArrival ? "Yes - airport pickup requested" : "No - start on tour date"}
Departure airport transfer: ${context.tripDetails.departureAirportTransfer ? "Yes" : "No"}

${routeEstimate.source === "google" ? "Google Maps road distance" : "Estimated route distance"}: ${routeEstimate.totalDistanceKm} km${routeEstimate.source === "google" ? "" : " (planning estimate; final road route to be confirmed)"}
Route legs:
${routeLegLines}

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
    getRequiredSriLankaStayDays,
    getSriLankaStayLength,
    getSriLankaDepartureDate,
    getTripEndDate,
    toDisplayDate,
  };
}
