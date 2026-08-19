import { NextResponse } from "next/server";

type RoutePoint = {
  name: string;
  latitude: number;
  longitude: number;
};

type RouteRequest = {
  points?: RoutePoint[];
};

function isRoutePoint(point: unknown): point is RoutePoint {
  if (!point || typeof point !== "object") return false;
  const candidate = point as RoutePoint;
  return (
    typeof candidate.name === "string" &&
    Number.isFinite(candidate.latitude) &&
    Number.isFinite(candidate.longitude) &&
    candidate.latitude >= -90 && candidate.latitude <= 90 &&
    candidate.longitude >= -180 && candidate.longitude <= 180
  );
}

function waypoint(point: RoutePoint) {
  return {
    location: {
      latLng: { latitude: point.latitude, longitude: point.longitude },
    },
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Google Routes API is not configured." }, { status: 503 });
  }

  let body: RouteRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid route request." }, { status: 400 });
  }

  const points = body.points;
  if (!Array.isArray(points) || points.length < 2 || points.length > 27 || !points.every(isRoutePoint)) {
    return NextResponse.json({ error: "Provide between 2 and 27 valid route points." }, { status: 400 });
  }

  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.legs.distanceMeters",
    },
    body: JSON.stringify({
      origin: waypoint(points[0]),
      destination: waypoint(points[points.length - 1]),
      intermediates: points.slice(1, -1).map(waypoint),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Google Maps could not calculate this route." }, { status: 502 });
  }

  const data = (await response.json()) as { routes?: Array<{ legs?: Array<{ distanceMeters?: number }> }> };
  const legs = data.routes?.[0]?.legs;
  if (!legs || legs.length !== points.length - 1 || legs.some((leg) => !Number.isFinite(leg.distanceMeters))) {
    return NextResponse.json({ error: "Google Maps returned an incomplete route." }, { status: 502 });
  }

  const routeLegs = legs.map((leg, index) => ({
    from: points[index].name,
    to: points[index + 1].name,
    distanceKm: Math.max(1, Math.round((leg.distanceMeters ?? 0) / 1000)),
  }));

  return NextResponse.json({
    totalDistanceKm: routeLegs.reduce((total, leg) => total + leg.distanceKm, 0),
    legs: routeLegs,
  });
}
