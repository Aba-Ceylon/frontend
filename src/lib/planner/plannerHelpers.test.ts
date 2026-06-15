import assert from "node:assert/strict";
import test from "node:test";
import * as plannerHelpersModule from "./plannerHelpers";

const plannerHelpers = (
  plannerHelpersModule as typeof plannerHelpersModule & {
    default?: typeof plannerHelpersModule;
  }
).default ?? plannerHelpersModule;

const {
  classifyVehicleComfort,
  recommendStaysForDestinations,
  validateTripDetails,
} = plannerHelpers;

test("validateTripDetails flags impossible travel windows", () => {
  const issues = validateTripDetails({
    arrivalDate: "2026-06-10",
    sriLankaStayDays: 2,
    travelStartDate: "2026-06-09",
    travelDays: 3,
  });

  assert.ok(
    issues.some((issue) =>
      issue.includes("Travel start date cannot be before your arrival date."),
    ),
  );
  assert.ok(
    issues.some((issue) =>
      issue.includes("Total stay in Sri Lanka must be at least as long"),
    ),
  );
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
