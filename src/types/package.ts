export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface PackageItem {
  id: string;
  title: string;
  duration: string;
  route: string[];
  km: number;
  summary: string;
  image: string;
  overview: string;
  itinerary: ItineraryDay[];
  includedServices: string[];
  recommendedVehicle: {
    type: string;
    description: string;
  };
}
