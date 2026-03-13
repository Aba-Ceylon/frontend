export type DestinationCategory = 'Heritage' | 'Nature' | 'Adventure' | 'Coastal';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  category: DestinationCategory;
  coordinates: [number, number]; // [longitude, latitude]
  summary: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  whyVisit: string;
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