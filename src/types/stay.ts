export interface Stay {
  id: string;
  accommodationId?: number;
  name: string;
  location: string;
  category: string;
  pricePerNight?: number;
  rating?: number;
  image: string;
  images?: string[];
  description: string;
  amenities: string[];
  ownerName?: string | null;
  ownerWhatsAppNumber?: string | null;
  coordinates?: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface SupabaseAccommodationRow {
  accommodation_id: number;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
  facilities: string | null;
  owner_name: string | null;
  owner_whatsapp_number: string | null;
  images: string[] | null;
}
