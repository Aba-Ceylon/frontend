import { packages as fallbackPackages } from "@/data/packages";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  ItineraryDay,
  PackageItem,
  RecommendedVehicle,
  SupabasePackageRow,
} from "@/types/package";

const PACKAGE_FALLBACK_IMAGES = [
  "/fpmock1.png",
  "/fpmock2.png",
  "/fpmock3.png",
  "/fpmock4.png",
  "/fpmock5.png",
  "/fpmock6.png",
  "/fpmock7.png",
  "/fpmock8.png",
  "/fpmock9.png",
  "/fpmock10.png",
  "/fpmock11.png",
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

function buildPackageSlug(title: string, packageId: number) {
  const base = slugify(title) || `package-${packageId}`;
  return `${base}-${packageId}`;
}

function extractPackageIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function sanitizeText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (isNonEmptyString(item)) {
        return [item.trim()];
      }

      if (!item || typeof item !== "object") {
        return [];
      }

      const record = item as Record<string, unknown>;
      const nestedCandidate = [
        record.title,
        record.name,
        record.label,
        record.value,
      ].find(isNonEmptyString);

      return nestedCandidate ? [nestedCandidate.trim()] : [];
    });
  }

  if (!isNonEmptyString(value)) {
    return [];
  }

  const normalized = value.trim();

  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    try {
      return parseStringArray(JSON.parse(normalized));
    } catch {
      return [];
    }
  }

  if (normalized.includes("\n")) {
    return normalized
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (normalized.includes(",")) {
    return normalized
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [normalized];
}

function parseRoute(route: string | null): string[] {
  if (!isNonEmptyString(route)) {
    return [];
  }

  const normalizedRoute = route.trim();
  const separators = [",", " -> ", " → ", "|", " / ", "\n"];

  for (const separator of separators) {
    if (normalizedRoute.includes(separator)) {
      return normalizedRoute
        .split(separator)
        .map((stop) => stop.trim())
        .filter(Boolean);
    }
  }

  return [normalizedRoute];
}

function parseItineraryDay(value: unknown, index: number): ItineraryDay {
  if (isNonEmptyString(value)) {
    return {
      day: index + 1,
      title: `Day ${index + 1}`,
      description: value.trim(),
      highlights: [],
    };
  }

  if (!value || typeof value !== "object") {
    return {
      day: index + 1,
      title: `Day ${index + 1}`,
      description: "",
      highlights: [],
    };
  }

  const record = value as Record<string, unknown>;
  const parsedDay = Number(record.day);
  const title =
    [record.title, record.name, record.label].find(isNonEmptyString)?.trim() ||
    `Day ${Number.isFinite(parsedDay) ? parsedDay : index + 1}`;
  const description =
    [
      record.description,
      record.overview,
      record.summary,
      record.details,
      record.text,
    ]
      .find(isNonEmptyString)
      ?.trim() || "";

  return {
    day: Number.isFinite(parsedDay) ? parsedDay : index + 1,
    title,
    description,
    highlights: parseStringArray(
      record.highlights ?? record.activities ?? record.stops,
    ),
  };
}

function parseItinerary(value: unknown): ItineraryDay[] {
  if (Array.isArray(value)) {
    return value.map(parseItineraryDay);
  }

  if (!isNonEmptyString(value)) {
    return [];
  }

  const normalized = value.trim();

  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    try {
      const parsed = JSON.parse(normalized);
      return Array.isArray(parsed) ? parsed.map(parseItineraryDay) : [];
    } catch {
      return [];
    }
  }

  return normalized
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(parseItineraryDay);
}

function getFallbackImage(packageId: number) {
  return PACKAGE_FALLBACK_IMAGES[
    (Math.max(packageId, 1) - 1) % PACKAGE_FALLBACK_IMAGES.length
  ];
}

function getSummary(overview: string, route: string[]) {
  if (overview) {
    if (overview.length <= 140) {
      return overview;
    }

    return `${overview.slice(0, 137).trimEnd()}...`;
  }

  if (route.length) {
    return `A curated journey through ${route.join(", ")}.`;
  }

  return "A curated travel package across Sri Lanka.";
}

function getOverview(overview: string | null, route: string[]) {
  const normalizedOverview = sanitizeText(overview);

  if (normalizedOverview) {
    return normalizedOverview;
  }

  if (route.length) {
    return `Explore ${route.join(", ")} on a curated Sri Lankan journey.`;
  }

  return "Discover a curated travel experience across Sri Lanka.";
}

function getRecommendedVehicle(
  value: string | null,
): RecommendedVehicle | null {
  const vehicleType = sanitizeText(value);

  if (!vehicleType) {
    return null;
  }

  return {
    type: vehicleType,
    description:
      "Recommended for comfortable travel across this route and itinerary.",
  };
}

function mapFallbackPackage(pkg: PackageItem, index: number): PackageItem {
  return {
    ...pkg,
    packageId: pkg.packageId ?? index + 1,
    images: pkg.images ?? [pkg.image],
    recommendedVehicle: pkg.recommendedVehicle ?? null,
  };
}

function mapPackageRow(row: SupabasePackageRow): PackageItem {
  const route = parseRoute(row.route);
  const overview = getOverview(row.overview, route);
  const images = parseStringArray(row.images);

  return {
    id: buildPackageSlug(row.title, row.package_id),
    packageId: row.package_id,
    title: sanitizeText(row.title) || `Package ${row.package_id}`,
    duration: `${row.duration_days} ${row.duration_days === 1 ? "Day" : "Days"}`,
    route,
    km: row.distance_km,
    summary: getSummary(overview, route),
    image: images[0] || getFallbackImage(row.package_id),
    images,
    overview,
    itinerary: parseItinerary(row.itinerary),
    includedServices: parseStringArray(row.included_services),
    recommendedVehicle: getRecommendedVehicle(row.recommended_vehicle),
  };
}

function getFallbackPackages() {
  return fallbackPackages.map(mapFallbackPackage);
}

export async function fetchPackages() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("package_id", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []) as SupabasePackageRow[];

    if (!rows.length) {
      return getFallbackPackages();
    }

    return rows.map(mapPackageRow);
  } catch {
    return getFallbackPackages();
  }
}

export async function fetchPackageBySlug(slug: string) {
  const fallbackMatch = getFallbackPackages().find((pkg) => pkg.id === slug);
  const packageId = extractPackageIdFromSlug(slug);

  try {
    const supabase = getSupabaseClient();

    if (packageId !== null) {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("package_id", packageId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        return mapPackageRow(data as SupabasePackageRow);
      }
    }

    const packages = await fetchPackages();
    return packages.find((pkg) => pkg.id === slug) ?? fallbackMatch ?? null;
  } catch {
    return fallbackMatch ?? null;
  }
}
