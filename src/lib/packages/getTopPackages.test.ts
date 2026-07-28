import assert from "node:assert/strict";
import test from "node:test";
import type { PackageItem } from "@/types/package";
import { getTopPackages } from "./getTopPackages";

const makePackage = (id: string): PackageItem => ({
  id,
  title: id,
  duration: "3 Days",
  route: ["Colombo", "Kandy"],
  km: 100,
  summary: "A curated journey.",
  image: "/fpmock1.png",
  overview: "Overview",
  itinerary: [],
  includedServices: [],
  recommendedVehicle: null,
});

test("returns the requested number of packages in source order", () => {
  const source = ["one", "two", "three"].map(makePackage);
  assert.deepEqual(
    getTopPackages(source, 2).map((item) => item.id),
    ["one", "two"],
  );
});

test("returns an empty selection for a non-positive limit", () => {
  assert.deepEqual(getTopPackages([makePackage("one")], 0), []);
});
