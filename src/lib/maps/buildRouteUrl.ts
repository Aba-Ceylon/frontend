// Google Maps supports multi-stop directions via a plain deep link (no API
// key needed) — it just opens Maps with these params pre-filled:
// https://www.google.com/maps/dir/?api=1&origin=...&destination=...&waypoints=A|B|C
const DIRECTIONS_BASE_URL = "https://www.google.com/maps/dir/";
const COUNTRY_HINT = "Sri Lanka";

// Google Maps' consumer directions UI supports at most 10 total stops
// (origin + up to 8 waypoints + destination). Routes longer than that are
// evenly sampled down rather than dropped, so the shape of the trip survives.
const MAX_TOTAL_STOPS = 10;

function withCountryHint(stop: string) {
  const trimmed = stop.trim();
  const alreadyHasCountry = trimmed.toLowerCase().includes(COUNTRY_HINT.toLowerCase());
  return alreadyHasCountry ? trimmed : `${trimmed}, ${COUNTRY_HINT}`;
}

function sampleStops(stops: string[], maxStops: number) {
  if (stops.length <= maxStops) return stops;

  const lastIndex = stops.length - 1;
  const step = lastIndex / (maxStops - 1);

  return Array.from({ length: maxStops }, (_, i) =>
    stops[Math.round(i * step)],
  );
}

/**
 * Builds a Google Maps "get directions" deep link that routes through every
 * stop in a package/journey's route, in order. Returns null when there
 * aren't at least two named stops to draw a route between.
 */
export function buildGoogleMapsRouteUrl(routeStops: string[]): string | null {
  const stops = routeStops.map((stop) => stop.trim()).filter(Boolean);
  if (stops.length < 2) return null;

  const capped = sampleStops(stops, MAX_TOTAL_STOPS);
  const [origin, ...rest] = capped;
  const destination = rest.pop();
  if (!destination) return null;
  const waypoints = rest;

  const params = new URLSearchParams({
    api: "1",
    origin: withCountryHint(origin),
    destination: withCountryHint(destination),
    travelmode: "driving",
  });

  if (waypoints.length) {
    params.set("waypoints", waypoints.map(withCountryHint).join("|"));
  }

  return `${DIRECTIONS_BASE_URL}?${params.toString()}`;
}
