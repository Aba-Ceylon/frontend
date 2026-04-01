export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface RecommendedVehicle {
  type: string;
  description: string;
}

export interface PackageItem {
  id: string;
  packageId?: number;
  title: string;
  duration: string;
  route: string[];
  km: number;
  summary: string;
  image: string;
  images?: string[];
  overview: string;
  itinerary: ItineraryDay[];
  includedServices: string[];
  recommendedVehicle: RecommendedVehicle | null;
}

export interface SupabasePackageRow {
  package_id: number;
  title: string;
  duration_days: number;
  distance_km: number;
  route: string | null;
  overview: string | null;
  itinerary: unknown;
  included_services: unknown;
  recommended_vehicle: string | null;
  images: unknown;
  created_at: string;
}
