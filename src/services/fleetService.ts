import { vehicles as fallbackVehicles } from "@/data/vehicles";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { FleetVehicle, SupabaseVehicleRow } from "@/types/vehicle";

const VEHICLE_FALLBACK_IMAGE = "/images/fleet/fleets.png";

function mapVehicleRow(row: SupabaseVehicleRow): FleetVehicle {
  const images = row.images ?? [];

  return {
    id: String(row.vehicle_id),
    name: row.vehicle_name,
    type: row.vehicle_type,
    brandName: row.brand_name,
    vehicleNumber: row.vehicle_number,
    passengerCapacity: row.passenger_capacity,
    ownerName: row.owner_name,
    ownerWhatsAppNumber: row.owner_whatsapp_number,
    availabilityStatus: row.availability_status,
    images,
    imageUrl: images[0] || VEHICLE_FALLBACK_IMAGE,
    shortDescription: `${row.brand_name} ${row.vehicle_type} with comfortable seating for ${row.passenger_capacity} passengers.`,
    luggageCapacity: Math.max(1, Math.floor(row.passenger_capacity / 2)),
    models: [row.vehicle_name],
    features: [
      `Type: ${row.vehicle_type}`,
      `Status: ${row.availability_status}`,
      `Owner: ${row.owner_name}`,
      `Vehicle No: ${row.vehicle_number}`,
    ],
  };
}

function mapFallbackVehicle(
  vehicle: (typeof fallbackVehicles)[number],
): FleetVehicle {
  return {
    id: vehicle.id,
    name: vehicle.name,
    type: vehicle.type,
    brandName: vehicle.models[0] || vehicle.name,
    vehicleNumber: "Available on request",
    passengerCapacity: vehicle.passengerCapacity,
    ownerName: "ABA Ceylon",
    ownerWhatsAppNumber: "+94722554488",
    availabilityStatus: "Available",
    images: [vehicle.imageUrl],
    imageUrl: vehicle.imageUrl,
    shortDescription: vehicle.shortDescription,
    luggageCapacity: vehicle.luggageCapacity,
    models: vehicle.models,
    features: vehicle.features,
  };
}

function getFallbackFleetVehicles() {
  return fallbackVehicles.map(mapFallbackVehicle);
}

export async function fetchVehiclesPage(page: number, pageSize: number) {
  try {
    const supabase = getSupabaseClient();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("vehicles")
      .select("*", { count: "exact" })
      .order("vehicle_id", { ascending: true })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []) as SupabaseVehicleRow[];

    return {
      vehicles: rows.map(mapVehicleRow),
      totalCount: count ?? rows.length,
    };
  } catch {
    const fallback = getFallbackFleetVehicles();
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    return {
      vehicles: fallback.slice(from, to),
      totalCount: fallback.length,
    };
  }
}

export async function fetchAllVehicles() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("vehicle_id", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []) as SupabaseVehicleRow[];

    if (!rows.length) {
      return getFallbackFleetVehicles();
    }

    return rows.map(mapVehicleRow);
  } catch {
    return getFallbackFleetVehicles();
  }
}

export async function fetchVehicleById(id: string) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("vehicle_id", Number(id))
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return mapVehicleRow(data as SupabaseVehicleRow);
  } catch {
    return (
      getFallbackFleetVehicles().find((vehicle) => vehicle.id === id) || null
    );
  }
}
