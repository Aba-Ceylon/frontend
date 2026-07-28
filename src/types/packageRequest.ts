export type AccommodationRequest =
  | "recommend"
  | "already-arranged"
  | "not-needed";

export type AccommodationStyle =
  | "flexible"
  | "comfort"
  | "boutique"
  | "premium";

export type VehicleRequest =
  | "recommend"
  | "sedan"
  | "suv"
  | "van"
  | "premium";

export interface PackageRequestDetails {
  arrivalDate: string;
  departureDate: string;
  chauffeurStartDate: string;
  chauffeurEndDate: string;
  adults: number;
  children: number;
  luggage: number;
  arrivalTransfer: boolean;
  departureTransfer: boolean;
  accommodation: AccommodationRequest;
  accommodationStyle: AccommodationStyle;
  vehicle: VehicleRequest;
  arrivalReference: string;
  departureReference: string;
  notes: string;
}
