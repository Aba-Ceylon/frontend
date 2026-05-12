export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
}

export interface SupabaseVehicleRow {
  vehicle_id: number;
  vehicle_type: string;
  brand_name: string;
  vehicle_name: string;
  vehicle_number: string;
  passenger_capacity: number;
  owner_name: string;
  owner_whatsapp_number: string;
  availability_status: string;
  images: string[] | null;
}

export interface FleetVehicle {
  id: string;
  name: string;
  type: string;
  brandName: string;
  vehicleNumber: string;
  passengerCapacity: number;
  ownerName: string;
  ownerWhatsAppNumber: string;
  availabilityStatus: string;
  images: string[];
  imageUrl: string;
  shortDescription: string;
  luggageCapacity: number;
  models: string[];
  features: string[];
}
