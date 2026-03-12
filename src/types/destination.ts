export interface Destination {
  id: string;
  name: string;
  slug: string;
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