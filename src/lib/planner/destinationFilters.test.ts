import assert from "node:assert/strict";
import test from "node:test";
import type { Destination } from "@/types/destination";
import {
  ALL_DISTRICTS,
  filterPlannerDestinations,
  getDestinationDistricts,
} from "./destinationFilters";

const destination = (
  name: string,
  district: string,
  province: string,
  region: string,
): Destination => ({
  id: name.toLowerCase().replaceAll(" ", "-"),
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  category: "Heritage",
  region,
  province,
  district,
  coordinates: [80, 7],
  summary: "",
  description: "",
  highlights: [],
  bestTimeToVisit: "",
  whyVisit: "",
});

const destinations = [
  destination("Mihintale", "Anuradhapura", "North Central Province", "Cultural Triangle"),
  destination("Ruwanwelisaya", "Anuradhapura", "North Central Province", "Cultural Triangle"),
  destination("Galle Fort", "Galle", "Southern Province", "South Coast"),
];

test("filterPlannerDestinations filters by district and keyword together", () => {
  assert.deepEqual(
    filterPlannerDestinations(destinations, "Anuradhapura", "mihin").map(({ name }) => name),
    ["Mihintale"],
  );
});

test("filterPlannerDestinations searches location fields case-insensitively", () => {
  assert.deepEqual(
    filterPlannerDestinations(destinations, ALL_DISTRICTS, "SOUTHERN").map(({ name }) => name),
    ["Galle Fort"],
  );
});

test("getDestinationDistricts returns unique sorted districts", () => {
  assert.deepEqual(getDestinationDistricts(destinations), ["Anuradhapura", "Galle"]);
});
