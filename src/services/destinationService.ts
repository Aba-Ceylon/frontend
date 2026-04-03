import { destinations as fallbackDestinations } from "@/data/destinations";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Destination, SupabaseDestinationRow } from "@/types/destination";

const DEFAULT_HIGHLIGHTS = [
  "Curated route stop",
  "Private chauffeur-guided access",
  "Flexible custom planning",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function toCoordinate(value: number | string | null | undefined) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(parsed) ? parsed : null;
}

function buildDestinationId(name: string, destinationId: number) {
  const base = slugify(name) || `destination-${destinationId}`;
  return `${base}-${destinationId}`;
}

function buildDestinationSummary(
  row: SupabaseDestinationRow,
  fallbackDestination?: Destination,
) {
  if (isNonEmptyString(row.description)) {
    return row.description.trim();
  }

  return (
    fallbackDestination?.summary ||
    "A curated Sri Lanka destination ready for your custom route."
  );
}

function buildDestinationDescription(
  row: SupabaseDestinationRow,
  fallbackDestination?: Destination,
) {
  if (isNonEmptyString(row.description)) {
    return row.description.trim();
  }

  return (
    fallbackDestination?.description ||
    "Discover this Sri Lanka stop as part of a personalized route with ABA Ceylon."
  );
}

function mapFallbackDestination(destination: Destination): Destination {
  return {
    ...destination,
    destinationId: destination.destinationId,
    images: destination.images ?? [],
  };
}

function mapDestinationRow(
  row: SupabaseDestinationRow,
  fallbackDestination?: Destination,
): Destination | null {
  if (!isNonEmptyString(row.name)) {
    return null;
  }

  const latitude = toCoordinate(row.latitude);
  const longitude = toCoordinate(row.longitude);
  const fallbackCoordinates = fallbackDestination?.coordinates;

  if ((latitude === null || longitude === null) && !fallbackCoordinates) {
    return null;
  }

  const name = row.name.trim();
  const coordinates: [number, number] =
    latitude !== null && longitude !== null
      ? [longitude, latitude]
      : fallbackCoordinates!;
  const images = (row.images ?? []).filter(isNonEmptyString);

  return {
    id: fallbackDestination?.id || buildDestinationId(name, row.destination_id),
    destinationId: row.destination_id,
    name,
    slug:
      fallbackDestination?.slug ||
      slugify(name) ||
      `destination-${row.destination_id}`,
    category: fallbackDestination?.category || "Nature",
    region: fallbackDestination?.region || "Sri Lanka",
    province: fallbackDestination?.province || "Sri Lanka",
    district: fallbackDestination?.district || "Sri Lanka",
    coordinates,
    summary: buildDestinationSummary(row, fallbackDestination),
    description: buildDestinationDescription(row, fallbackDestination),
    highlights: fallbackDestination?.highlights?.length
      ? fallbackDestination.highlights
      : DEFAULT_HIGHLIGHTS,
    bestTimeToVisit: fallbackDestination?.bestTimeToVisit || "Year round",
    whyVisit:
      fallbackDestination?.whyVisit ||
      "It fits naturally into a personalized ABA Ceylon route with chauffeur-guided flexibility.",
    images: images.length ? images : (fallbackDestination?.images ?? []),
  } satisfies Destination;
}

function buildDestinationsFromRows(rows: SupabaseDestinationRow[]) {
  const fallbackMap = new Map(
    fallbackDestinations.map((destination) => [
      normalizeName(destination.name),
      destination,
    ]),
  );

  return rows
    .map((row) =>
      mapDestinationRow(
        row,
        isNonEmptyString(row.name)
          ? fallbackMap.get(normalizeName(row.name))
          : undefined,
      ),
    )
    .filter((destination): destination is Destination => destination !== null)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getFallbackDestinations() {
  return fallbackDestinations
    .map(mapFallbackDestination)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function fetchDestinations() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("destination_id", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []) as SupabaseDestinationRow[];

    if (!rows.length) {
      return getFallbackDestinations();
    }

    const mappedDestinations = buildDestinationsFromRows(rows);

    return mappedDestinations.length
      ? mappedDestinations
      : getFallbackDestinations();
  } catch {
    return getFallbackDestinations();
  }
}
