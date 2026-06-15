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
  tags?: string[];
  images?: string[];
}

export interface SupabaseDestinationRow {
  destination_id: number;
  name: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  description: string | null;
  images: string[] | null;
  type: string | null;
  tags: string[] | null;
  highlights: string[] | null;
  best_time_to_visit: string | null;
  why_visit: string | null;
}
