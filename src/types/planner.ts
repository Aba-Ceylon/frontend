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
  sriLankaStayDays: number;
  travelStartDate: string;
  travelDays: number;
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
}
