import { createClient } from "@supabase/supabase-js";
import { destinations } from "@/data/destinations";
import { packages as fallbackPackages } from "@/data/packages";
import { vehicles as fallbackVehicles } from "@/data/vehicles";
import type { Destination } from "@/types/destination";
import type { PackageItem, SupabasePackageRow } from "@/types/package";
import type { FleetVehicle, SupabaseVehicleRow } from "@/types/vehicle";

interface ChatKnowledge {
  packages: PackageItem[];
  vehicles: FleetVehicle[];
  destinations: Destination[];
}

let cache: { knowledge: ChatKnowledge; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(url, key);
}

function mapFallbackVehicles(): FleetVehicle[] {
  return fallbackVehicles.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    type: vehicle.type,
    brandName: vehicle.models[0] || vehicle.name,
    vehicleNumber: "Available on request",
    passengerCapacity: vehicle.passengerCapacity,
    ownerName: "ABA Ceylon",
    ownerWhatsAppNumber: "",
    availabilityStatus: "Available",
    images: vehicle.imageUrl ? [vehicle.imageUrl] : [],
    imageUrl: vehicle.imageUrl,
    shortDescription: vehicle.shortDescription,
    luggageCapacity: vehicle.luggageCapacity,
    models: vehicle.models,
    features: vehicle.features,
  }));
}

function mapSupabasePackages(rows: SupabasePackageRow[]): PackageItem[] {
  return rows.map((row) => ({
    id: String(row.package_id),
    packageId: row.package_id,
    title: row.title,
    duration: `${row.duration_days} Days`,
    route: row.route
      ? row.route.split(/,\s*|\s*->\s*|\s*→\s*|\s*\|\s*/).filter(Boolean)
      : [],
    km: row.distance_km,
    summary: row.overview?.slice(0, 140) ?? "",
    image: "",
    overview: row.overview ?? "",
    itinerary: [],
    includedServices: Array.isArray(row.included_services)
      ? (row.included_services as string[])
      : [],
    recommendedVehicle: row.recommended_vehicle
      ? { type: row.recommended_vehicle, description: "" }
      : null,
  }));
}

function mapSupabaseVehicles(rows: SupabaseVehicleRow[]): FleetVehicle[] {
  return rows.map((row) => {
    const name = `${row.brand_name} ${row.vehicle_name}`.trim();

    return {
      id: String(row.vehicle_id),
      name,
      type: row.vehicle_type,
      brandName: row.brand_name,
      vehicleNumber: row.vehicle_number,
      passengerCapacity: row.passenger_capacity,
      ownerName: row.owner_name,
      ownerWhatsAppNumber: row.owner_whatsapp_number,
      availabilityStatus: row.availability_status,
      images: row.images ?? [],
      imageUrl: row.images?.[0] ?? "",
      shortDescription: `${name} for up to ${row.passenger_capacity} passengers.`,
      luggageCapacity: 0,
      models: [],
      features: [],
    };
  });
}

export async function fetchChatKnowledge(): Promise<ChatKnowledge> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.knowledge;
  }

  let packageList = fallbackPackages;
  let vehicleList = mapFallbackVehicles();

  try {
    const supabase = getServerSupabase();

    const { data: packageRows } = await supabase
      .from("packages")
      .select(
        "package_id, title, duration_days, distance_km, route, overview, included_services, recommended_vehicle",
      )
      .order("package_id", { ascending: true });

    if (packageRows?.length) {
      packageList = mapSupabasePackages(packageRows as SupabasePackageRow[]);
    }

    const { data: vehicleRows } = await supabase
      .from("vehicles")
      .select(
        "vehicle_id, vehicle_type, brand_name, vehicle_name, vehicle_number, passenger_capacity, owner_name, owner_whatsapp_number, availability_status, images",
      )
      .order("vehicle_id", { ascending: true });

    if (vehicleRows?.length) {
      vehicleList = mapSupabaseVehicles(vehicleRows as SupabaseVehicleRow[]);
    }
  } catch {
    packageList = fallbackPackages;
    vehicleList = mapFallbackVehicles();
  }

  const knowledge: ChatKnowledge = {
    packages: packageList,
    vehicles: vehicleList,
    destinations,
  };

  cache = { knowledge, fetchedAt: Date.now() };
  return knowledge;
}

export type { ChatKnowledge };
