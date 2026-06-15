import { stays as fallbackStays } from "@/data/stays";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Stay, SupabaseAccommodationRow } from "@/types/stay";

const STAY_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
  "https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&q=80",
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

function buildStaySlug(name: string, accommodationId: number) {
  const base = slugify(name) || `stay-${accommodationId}`;
  return `${base}-${accommodationId}`;
}

function extractAccommodationIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function formatCoordinate(value: number) {
  return Number(value).toFixed(4);
}

function buildLocation(latitude: number, longitude: number) {
  return `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`;
}

function parseAmenities(value: string | null) {
  if (!isNonEmptyString(value)) {
    return ["Facilities available on request"];
  }

  const amenities = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return amenities.length ? amenities : ["Facilities available on request"];
}

function getStayDescription(
  row: SupabaseAccommodationRow,
  amenities: string[],
) {
  const category = row.type.trim();
  const ownerSegment = isNonEmptyString(row.owner_name)
    ? ` hosted by ${row.owner_name.trim()}`
    : "";

  if (amenities.length) {
    return `A ${category.toLowerCase()} stay${ownerSegment} with facilities including ${amenities.join(", ")}.`;
  }

  return `A curated ${category.toLowerCase()} stay${ownerSegment} in Sri Lanka.`;
}

function getFallbackImage(accommodationId: number) {
  return STAY_FALLBACK_IMAGES[
    (Math.max(accommodationId, 1) - 1) % STAY_FALLBACK_IMAGES.length
  ];
}

function mapFallbackStay(stay: Stay, index: number): Stay {
  return {
    ...stay,
    accommodationId: stay.accommodationId ?? index + 1,
    images: stay.images ?? [stay.image],
    ownerName: stay.ownerName ?? null,
    ownerWhatsAppNumber: stay.ownerWhatsAppNumber ?? null,
    coordinates: stay.coordinates ?? null,
  };
}

function mapAccommodationRow(row: SupabaseAccommodationRow): Stay {
  const amenities = parseAmenities(row.facilities);
  const images = row.images ?? [];

  return {
    id: buildStaySlug(row.name, row.accommodation_id),
    accommodationId: row.accommodation_id,
    name: row.name.trim(),
    location: buildLocation(row.latitude, row.longitude),
    category: row.type.trim(),
    image: images[0] || getFallbackImage(row.accommodation_id),
    images,
    description: getStayDescription(row, amenities),
    amenities,
    ownerName: row.owner_name,
    ownerWhatsAppNumber: row.owner_whatsapp_number,
    coordinates: {
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
    },
  };
}

function getFallbackStays() {
  return fallbackStays.map(mapFallbackStay);
}

let staysCache: Stay[] | null = null;
let staysPromise: Promise<Stay[]> | null = null;

export async function fetchStays() {
  if (staysCache) {
    return staysCache;
  }

  if (staysPromise) {
    return staysPromise;
  }

  staysPromise = (async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("accommodations")
        .select("*")
        .order("accommodation_id", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as SupabaseAccommodationRow[];
      const result = !rows.length ? getFallbackStays() : rows.map(mapAccommodationRow);

      staysCache = result;
      return result;
    } catch {
      const fallback = getFallbackStays();
      staysCache = fallback;
      return fallback;
    } finally {
      staysPromise = null;
    }
  })();

  return staysPromise;
}

export async function fetchStayBySlug(slug: string) {
  const fallbackMatch = getFallbackStays().find((stay) => stay.id === slug);
  const accommodationId = extractAccommodationIdFromSlug(slug);

  try {
    const supabase = getSupabaseClient();

    if (accommodationId !== null) {
      const { data, error } = await supabase
        .from("accommodations")
        .select("*")
        .eq("accommodation_id", accommodationId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        return mapAccommodationRow(data as SupabaseAccommodationRow);
      }
    }

    const stays = await fetchStays();
    return stays.find((stay) => stay.id === slug) ?? fallbackMatch ?? null;
  } catch {
    return fallbackMatch ?? null;
  }
}
