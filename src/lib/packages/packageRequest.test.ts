import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PACKAGE_REQUEST,
  validatePackageRequestDates,
  validatePackageRequestParty,
} from "./packageRequest";

test("accepts chauffeur dates contained within the traveller's stay", () => {
  assert.deepEqual(
    validatePackageRequestDates({
      ...DEFAULT_PACKAGE_REQUEST,
      arrivalDate: "2027-01-10",
      departureDate: "2027-01-20",
      chauffeurStartDate: "2027-01-12",
      chauffeurEndDate: "2027-01-16",
    }),
    [],
  );
});

test("rejects chauffeur service outside the traveller's stay", () => {
  const issues = validatePackageRequestDates({
    ...DEFAULT_PACKAGE_REQUEST,
    arrivalDate: "2027-01-10",
    departureDate: "2027-01-20",
    chauffeurStartDate: "2027-01-09",
    chauffeurEndDate: "2027-01-21",
  });
  assert.equal(issues.length, 2);
});

test("requires at least one adult", () => {
  assert.deepEqual(
    validatePackageRequestParty({
      ...DEFAULT_PACKAGE_REQUEST,
      adults: 0,
    }),
    ["At least one adult is required."],
  );
});
