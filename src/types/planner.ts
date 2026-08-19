import type { Destination } from "@/types/destination";
import type { Stay } from "@/types/stay";
import type { FleetVehicle } from "@/types/vehicle";

export type ComfortLevel = "Essential" | "Comfort" | "Premium";
export type AccommodationMode = "own" | "recommended";

export interface PlannerStaySelection {
  stayId: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface PlannerTripDetails {
  arrivalDate: string;
  departureDate: string;
  travelStartDate: string;
  travelDays: number;
  vehicleFromArrival: boolean;
  departureAirportTransfer: boolean;
}

export interface PlannerRouteLeg {
  from: string;
  to: string;
  distanceKm: number;
}

export interface PlannerRouteEstimate {
  totalDistanceKm: number;
  legs: PlannerRouteLeg[];
  includesArrivalPickup: boolean;
  includesDepartureTransfer: boolean;
  source?: "google" | "estimate";
}

export interface PlannerFormState extends PlannerTripDetails {
  selectedDestinationIds: string[];
  vehicleType: string;
  comfortLevel: ComfortLevel | "";
  selectedVehicleId: string;
  accommodationMode: AccommodationMode | "";
  selectedStayPlans: PlannerStaySelection[];
}

export interface RecommendedStay extends Stay {
  routeMatchLabel: string;
  distanceKm: number | null;
}

export interface PlannerReviewData {
  tripLabel: string;
  serviceIncluded: string;
  accommodationNote: string;
  totalDestinations: number;
  stayLengthLabel: string;
  chauffeurStartLabel: string;
  departureTransferLabel: string;
  routeEstimate: PlannerRouteEstimate;
}

export interface PlannerStep {
  id: string;
  title: string;
  caption: string;
}

export interface PlannerWhatsAppContext {
  travelerName: string;
  travelerEmail: string;
  tripDetails: PlannerTripDetails;
  selectedDestinations: Destination[];
  selectedVehicle: FleetVehicle | null;
  selectedStayPlans: Array<PlannerStaySelection & { stay: Stay }>;
  accommodationMode: AccommodationMode;
  accommodationNote: string;
  serviceIncluded: string;
  vehicleType: string;
  comfortLevel: ComfortLevel;
  routeEstimate?: PlannerRouteEstimate;
}
