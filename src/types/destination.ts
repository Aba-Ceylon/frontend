export type DestinationCategory =
  | "Heritage"
  | "Nature"
  | "Adventure"
  | "Coastal"
  | "Wildlife"
  | "City"
  | "Beach"
  | "Unique";

export type DestinationRegion =
  | "Cultural Triangle"
  | "Hill Country"
  | "South Coast"
  | "East Coast"
  | "Wildlife Belt"
  | "Northern Sri Lanka"
  | "West Coast";

export interface Destination {
  id: string;
  destinationId?: number;
  name: string;
  slug: string;
  category: DestinationCategory | string;
  region: DestinationRegion | string;
  province: string;
  district: string;
  coordinates: [number, number]; // [longitude, latitude]
  summary: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  whyVisit: string;
  images?: string[];
}

export interface SupabaseDestinationRow {
  destination_id: number;
  name: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  description: string | null;
  images: string[] | null;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
}

export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
}

export interface Stay {
  id: string;
  name: string;
  location: string;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
}

export interface Planner {
  id: string;
  destinations: string[];
  dates: string[];
}
