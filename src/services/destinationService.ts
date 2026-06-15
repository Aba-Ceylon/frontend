import { destinations as destinationMetadataSeeds } from "@/data/destinations";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  Destination,
  DestinationCategory,
  SupabaseDestinationRow,
} from "@/types/destination";

const DEFAULT_HIGHLIGHTS = [
  "Curated route stop",
  "Private chauffeur-guided access",
  "Flexible custom planning",
];
const DEFAULT_SUMMARY =
  "A curated Sri Lanka destination ready for your custom route.";
const DEFAULT_DESCRIPTION =
  "Discover this Sri Lanka stop as part of a personalized route with ABA Ceylon.";
const DEFAULT_WHY_VISIT =
  "It fits naturally into a personalized ABA Ceylon route with chauffeur-guided flexibility.";

const regionLookup = new Map(
  Array.from(
    new Set(destinationMetadataSeeds.map((destination) => destination.region)),
  ).map((region) => [normalizeName(region), region]),
);

const provinceLookup = new Map(
  Array.from(
    new Set(
      destinationMetadataSeeds.map((destination) => destination.province),
    ),
  ).map((province) => [normalizeName(province), province]),
);

const districtLookup = new Map(
  Array.from(
    new Set(
      destinationMetadataSeeds.map((destination) => destination.district),
    ),
  ).map((district) => [normalizeName(district), district]),
);

function getFallbackDestinations() {
  return [...destinationMetadataSeeds].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter(isNonEmptyString)
      .map((item) => item.trim())
      .filter(Boolean);
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

  return normalized
    .split(/[\n,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
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

function buildSummaryFromDescription(description: string) {
  const normalized = description.replace(/\s+/g, " ").trim();
  const firstSentence = normalized.match(/.+?[.!?](?:\s|$)/)?.[0]?.trim();

  if (firstSentence && firstSentence.length <= 140) {
    return firstSentence;
  }

  if (normalized.length <= 140) {
    return normalized;
  }

  return `${normalized.slice(0, 137).trimEnd()}...`;
}

function buildSummaryFromTags(tags: string[]) {
  if (!tags.length) {
    return null;
  }

  if (tags.length === 1) {
    return `Known for ${tags[0]}.`;
  }

  const leadingTags = tags.slice(0, 3);
  return `Known for ${leadingTags.join(", ")}.`;
}

function inferLookupValue(
  tags: string[],
  lookup: Map<string, string>,
  fallbackValue?: string,
) {
  for (const tag of tags) {
    const match = lookup.get(normalizeName(tag));

    if (match) {
      return match;
    }
  }

  return fallbackValue || "Sri Lanka";
}

function resolveDestinationCategory(
  destinationType: string | null,
  tags: string[],
  fallbackCategory?: Destination["category"],
): Destination["category"] {
  const normalizedType = isNonEmptyString(destinationType)
    ? normalizeName(destinationType)
    : "";
  const normalizedTags = tags.map(normalizeName).join(" ");
  const searchText = `${normalizedType} ${normalizedTags}`.trim();

  const categoryMatchers: Array<{
    match: RegExp;
    category: DestinationCategory;
  }> = [
    { match: /heritage|cultural|culture|ancient|unesco|temple|fort/, category: "Heritage" },
    { match: /wildlife|safari|national park|eco park/, category: "Wildlife" },
    { match: /beach/, category: "Beach" },
    { match: /coast|coastal|bay|lagoon|island|marine/, category: "Coastal" },
    { match: /adventure|rafting|surf|trek|hike|climb/, category: "Adventure" },
    { match: /city|town|capital|urban/, category: "City" },
    { match: /unique|experience|pilgrimage|sacred/, category: "Unique" },
    { match: /nature|mountain|hill|forest|tea|lake|plain/, category: "Nature" },
  ];

  const matchedCategory = categoryMatchers.find(({ match }) =>
    match.test(searchText),
  )?.category;

  if (matchedCategory) {
    return matchedCategory;
  }

  if (isNonEmptyString(destinationType)) {
    return destinationType.trim();
  }

  return fallbackCategory || "Nature";
}

function buildDestinationSummary(
  row: SupabaseDestinationRow,
  tags: string[],
  fallbackDestination?: Destination,
) {
  if (fallbackDestination?.summary) {
    return fallbackDestination.summary;
  }

  if (isNonEmptyString(row.description)) {
    return buildSummaryFromDescription(row.description);
  }

  return buildSummaryFromTags(tags) || DEFAULT_SUMMARY;
}

function buildDestinationDescription(
  row: SupabaseDestinationRow,
  fallbackDestination?: Destination,
) {
  if (isNonEmptyString(row.description)) {
    return row.description.trim();
  }

  return fallbackDestination?.description || DEFAULT_DESCRIPTION;
}

function buildDestinationHighlights(
  row: SupabaseDestinationRow,
  fallbackDestination?: Destination,
) {
  const highlights = parseStringArray(row.highlights);

  if (highlights.length) {
    return highlights;
  }

  if (fallbackDestination?.highlights?.length) {
    return fallbackDestination.highlights;
  }

  return DEFAULT_HIGHLIGHTS;
}

function buildDestinationBestTimeToVisit(
  row: SupabaseDestinationRow,
  fallbackDestination?: Destination,
) {
  if (isNonEmptyString(row.best_time_to_visit)) {
    return row.best_time_to_visit.trim();
  }

  return fallbackDestination?.bestTimeToVisit || "Year round";
}

function buildDestinationWhyVisit(
  row: SupabaseDestinationRow,
  fallbackDestination?: Destination,
) {
  if (isNonEmptyString(row.why_visit)) {
    return row.why_visit.trim();
  }

  return fallbackDestination?.whyVisit || DEFAULT_WHY_VISIT;
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
  const tags = parseStringArray(row.tags);
  const images = (row.images ?? []).filter(isNonEmptyString);

  return {
    id: fallbackDestination?.id || buildDestinationId(name, row.destination_id),
    destinationId: row.destination_id,
    name,
    slug:
      fallbackDestination?.slug ||
      slugify(name) ||
      `destination-${row.destination_id}`,
    category: resolveDestinationCategory(
      row.type,
      tags,
      fallbackDestination?.category,
    ),
    region: inferLookupValue(tags, regionLookup, fallbackDestination?.region),
    province: inferLookupValue(
      tags,
      provinceLookup,
      fallbackDestination?.province,
    ),
    district: inferLookupValue(
      tags,
      districtLookup,
      fallbackDestination?.district,
    ),
    coordinates,
    summary: buildDestinationSummary(row, tags, fallbackDestination),
    description: buildDestinationDescription(row, fallbackDestination),
    highlights: buildDestinationHighlights(row, fallbackDestination),
    bestTimeToVisit: buildDestinationBestTimeToVisit(
      row,
      fallbackDestination,
    ),
    whyVisit: buildDestinationWhyVisit(row, fallbackDestination),
    tags,
    images: images.length ? images : (fallbackDestination?.images ?? []),
  } satisfies Destination;
}

function buildDestinationsFromRows(rows: SupabaseDestinationRow[]) {
  const fallbackMap = new Map(
    destinationMetadataSeeds.map((destination) => [
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

let destinationsCache: Destination[] | null = null;
let destinationsPromise: Promise<Destination[]> | null = null;

export async function fetchDestinations() {
  if (destinationsCache) {
    return destinationsCache;
  }

  if (destinationsPromise) {
    return destinationsPromise;
  }

  destinationsPromise = (async () => {
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
      const result = !rows.length
        ? getFallbackDestinations()
        : buildDestinationsFromRows(rows);

      destinationsCache = result;
      return result;
    } catch {
      const fallback = getFallbackDestinations();
      destinationsCache = fallback;
      return fallback;
    } finally {
      destinationsPromise = null;
    }
  })();

  return destinationsPromise;
}

export async function fetchDestinationBySlug(slug: string) {
  const fallbackMatch = getFallbackDestinations().find(
    (destination) => destination.slug === slug,
  );

  try {
    const destinations = await fetchDestinations();
    return (
      destinations.find((destination) => destination.slug === slug) ??
      fallbackMatch ??
      null
    );
  } catch {
    return fallbackMatch ?? null;
  }
}
