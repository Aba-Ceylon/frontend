import { createClient } from "@supabase/supabase-js";
import { packages as fallbackPackages } from "@/data/packages";
import { vehicles as fallbackVehicles } from "@/data/vehicles";
import type { SupabasePackageRow, PackageItem } from "@/types/package";
import type { SupabaseVehicleRow } from "@/types/vehicle";

// Simple in-memory cache — refreshes every 10 minutes
let cache: { context: string; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

function formatPackages(packages: PackageItem[]): string {
  return packages
    .map((pkg) => {
      const services = pkg.includedServices?.length
        ? `Includes: ${pkg.includedServices.join(", ")}.`
        : "";
      const vehicle = pkg.recommendedVehicle
        ? `Recommended vehicle: ${pkg.recommendedVehicle.type}.`
        : "";
      return [
        `• ${pkg.title} (${pkg.duration}, ${pkg.km} km)`,
        `  Route: ${pkg.route.join(" → ")}`,
        `  ${pkg.summary}`,
        services ? `  ${services}` : "",
        vehicle ? `  ${vehicle}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function formatVehicles(
  vehicles: Array<{
    name: string;
    type: string;
    passengerCapacity: number;
    availabilityStatus: string;
    shortDescription: string;
    features: string[];
  }>
): string {
  return vehicles
    .map((v) => {
      return [
        `• ${v.name} (${v.type})`,
        `  Seats: ${v.passengerCapacity} passengers`,
        `  Status: ${v.availabilityStatus}`,
        `  ${v.shortDescription}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export async function fetchChatContext(): Promise<string> {
  // Return cached context if still fresh
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.context;
  }

  let packagesText = "";
  let vehiclesText = "";

  try {
    const supabase = getServerSupabase();

    // Fetch packages
    const { data: pkgData } = await supabase
      .from("packages")
      .select(
        "package_id, title, duration_days, distance_km, route, overview, included_services, recommended_vehicle"
      )
      .order("package_id", { ascending: true });

    if (pkgData && pkgData.length > 0) {
      const mapped = (pkgData as SupabasePackageRow[]).map((row) => ({
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
      packagesText = formatPackages(mapped);
    } else {
      packagesText = formatPackages(fallbackPackages);
    }

    // Fetch vehicles
    const { data: vehData } = await supabase
      .from("vehicles")
      .select(
        "vehicle_id, vehicle_name, vehicle_type, brand_name, passenger_capacity, availability_status"
      )
      .order("vehicle_id", { ascending: true });

    if (vehData && vehData.length > 0) {
      const mapped = (vehData as SupabaseVehicleRow[]).map((row) => ({
        name: `${row.brand_name} ${row.vehicle_name}`,
        type: row.vehicle_type,
        passengerCapacity: row.passenger_capacity,
        availabilityStatus: row.availability_status,
        shortDescription: `${row.brand_name} ${row.vehicle_type} for ${row.passenger_capacity} passengers.`,
        features: [],
      }));
      vehiclesText = formatVehicles(mapped);
    } else {
      vehiclesText = formatVehicles(
        fallbackVehicles.map((v) => ({
          name: v.name,
          type: v.type,
          passengerCapacity: v.passengerCapacity,
          availabilityStatus: "Available",
          shortDescription: v.shortDescription,
          features: v.features,
        }))
      );
    }
  } catch {
    // Supabase failed — use fallback data
    packagesText = formatPackages(fallbackPackages);
    vehiclesText = formatVehicles(
      fallbackVehicles.map((v) => ({
        name: v.name,
        type: v.type,
        passengerCapacity: v.passengerCapacity,
        availabilityStatus: "Available",
        shortDescription: v.shortDescription,
        features: v.features,
      }))
    );
  }

  const context = `
=== ABA CEYLON TOURS — LIVE PACKAGES ===
${packagesText}

=== ABA CEYLON TOURS — AVAILABLE FLEET ===
${vehiclesText}
`.trim();

  cache = { context, fetchedAt: Date.now() };
  return context;
}
