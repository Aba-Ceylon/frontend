import assert from "node:assert/strict";
import test from "node:test";
import * as plannerHelpersModule from "./plannerHelpers";

const plannerHelpers = (
  plannerHelpersModule as typeof plannerHelpersModule & {
    default?: typeof plannerHelpersModule;
  }
).default ?? plannerHelpersModule;

const {
  calculatePlannerRouteEstimate,
  classifyVehicleComfort,
  getSriLankaStayLength,
  recommendStaysForDestinations,
  validateTripDetails,
} = plannerHelpers;

test("validateTripDetails flags impossible travel windows", () => {
  const issues = validateTripDetails({
    arrivalDate: "2026-06-10",
    departureDate: "2026-06-11",
    travelStartDate: "2026-06-09",
    travelDays: 4,
    vehicleFromArrival: true,
    departureAirportTransfer: true,
  });

  assert.ok(
    issues.some((issue) =>
      issue.includes("Travel start date cannot be before your arrival date."),
    ),
  );
  assert.ok(
    issues.some((issue) =>
      issue.includes("after your departure"),
    ),
  );
});

test("getSriLankaStayLength calculates calendar days and nights from explicit dates", () => {
  assert.deepEqual(getSriLankaStayLength("2026-07-01", "2026-07-08"), {
    calendarDays: 8,
    nights: 7,
  });
});

test("calculatePlannerRouteEstimate preserves route order and includes airport transfers", () => {
  const route = calculatePlannerRouteEstimate(
    [
      {
        id: "sigiriya",
        slug: "sigiriya",
        name: "Sigiriya",
        category: "Heritage",
        region: "Cultural Triangle",
        province: "Central Province",
        district: "Matale",
        coordinates: [80.7603, 7.9569],
        summary: "",
        description: "",
        highlights: [],
        bestTimeToVisit: "",
        whyVisit: "",
      },
      {
        id: "kandy",
        slug: "kandy",
        name: "Kandy",
        category: "Heritage",
        region: "Hill Country",
        province: "Central Province",
        district: "Kandy",
        coordinates: [80.6337, 7.2906],
        summary: "",
        description: "",
        highlights: [],
        bestTimeToVisit: "",
        whyVisit: "",
      },
    ],
    { vehicleFromArrival: true, departureAirportTransfer: true },
  );

  assert.equal(route.legs.length, 3);
  assert.equal(route.legs[0]?.from, "Bandaranaike International Airport");
  assert.equal(route.legs[0]?.to, "Sigiriya");
  assert.equal(route.legs[1]?.from, "Sigiriya");
  assert.equal(route.legs[1]?.to, "Kandy");
  assert.equal(route.legs[2]?.to, "Bandaranaike International Airport");
  assert.ok(route.totalDistanceKm > 0);
});

test("classifyVehicleComfort identifies premium vehicles from brand/features", () => {
  const comfortLevel = classifyVehicleComfort({
    id: "lux-1",
    name: "Land Cruiser",
    type: "SUV",
    brandName: "Toyota",
    vehicleNumber: "TEST-001",
    passengerCapacity: 5,
    ownerName: "ABA Ceylon",
    ownerWhatsAppNumber: "+94722554488",
    availabilityStatus: "Available",
    images: ["/images/fleet/suv.jpg"],
    imageUrl: "/images/fleet/suv.jpg",
    shortDescription: "Premium SUV for hill country and long routes.",
    luggageCapacity: 4,
    models: ["Land Cruiser"],
    features: ["Privacy glass", "On-board charging", "Premium comfort"],
  });

  assert.equal(comfortLevel, "Premium");
});

test("recommendStaysForDestinations prioritizes the closest stay to the route", () => {
  const recommended = recommendStaysForDestinations(
    [
      {
        id: "stay-near",
        name: "Near Stay",
        location: "Sigiriya",
        category: "Boutique",
        image: "/stay-near.jpg",
        description: "Closest stay.",
        amenities: ["Breakfast"],
        coordinates: { latitude: 7.9569, longitude: 80.7603 },
      },
      {
        id: "stay-far",
        name: "Far Stay",
        location: "Galle",
        category: "Boutique",
        image: "/stay-far.jpg",
        description: "Further away.",
        amenities: ["Breakfast"],
        coordinates: { latitude: 6.0535, longitude: 80.221 },
      },
    ],
    [
      {
        id: "sigiriya",
        slug: "sigiriya",
        name: "Sigiriya",
        category: "Heritage",
        region: "Cultural Triangle",
        province: "Central Province",
        district: "Matale",
        coordinates: [80.7603, 7.9569],
        summary: "Rock fortress",
        description: "Ancient rock fortress.",
        highlights: ["Rock fortress"],
        bestTimeToVisit: "December to April",
        whyVisit: "Classic Sri Lanka stop.",
      },
    ],
  );

  assert.equal(recommended[0]?.id, "stay-near");
  assert.equal(recommended[0]?.routeMatchLabel, "Closest to Sigiriya");
  assert.ok((recommended[0]?.distanceKm ?? 1) <= (recommended[1]?.distanceKm ?? 9999));
});
