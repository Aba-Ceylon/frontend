import assert from "node:assert/strict";
import test from "node:test";
import { buildGoogleMapsRouteUrl } from "./buildRouteUrl";

test("returns null for fewer than two stops", () => {
  assert.equal(buildGoogleMapsRouteUrl([]), null);
  assert.equal(buildGoogleMapsRouteUrl(["Colombo"]), null);
});

test("builds a direct route with no waypoints for two stops", () => {
  const url = buildGoogleMapsRouteUrl(["Colombo", "Kandy"]);
  const parsed = new URL(url!);

  assert.equal(parsed.origin + parsed.pathname, "https://www.google.com/maps/dir/");
  assert.equal(parsed.searchParams.get("origin"), "Colombo, Sri Lanka");
  assert.equal(parsed.searchParams.get("destination"), "Kandy, Sri Lanka");
  assert.equal(parsed.searchParams.get("waypoints"), null);
  assert.equal(parsed.searchParams.get("travelmode"), "driving");
});

test("puts middle stops in waypoints, in order", () => {
  const url = buildGoogleMapsRouteUrl([
    "Mirissa",
    "Galle",
    "Weligama Bay",
    "Ella",
    "Negombo",
  ]);
  const parsed = new URL(url!);

  assert.equal(parsed.searchParams.get("origin"), "Mirissa, Sri Lanka");
  assert.equal(parsed.searchParams.get("destination"), "Negombo, Sri Lanka");
  assert.equal(
    parsed.searchParams.get("waypoints"),
    "Galle, Sri Lanka|Weligama Bay, Sri Lanka|Ella, Sri Lanka",
  );
});

test("does not double up a country hint that is already present", () => {
  const url = buildGoogleMapsRouteUrl(["Colombo, Sri Lanka", "Kandy"]);
  const parsed = new URL(url!);

  assert.equal(parsed.searchParams.get("origin"), "Colombo, Sri Lanka");
});

test("allows a round trip where origin equals destination", () => {
  const url = buildGoogleMapsRouteUrl(["Colombo", "Sigiriya", "Colombo"]);
  const parsed = new URL(url!);

  assert.equal(parsed.searchParams.get("origin"), "Colombo, Sri Lanka");
  assert.equal(parsed.searchParams.get("destination"), "Colombo, Sri Lanka");
  assert.equal(parsed.searchParams.get("waypoints"), "Sigiriya, Sri Lanka");
});

test("samples down routes longer than 10 stops instead of dropping the end", () => {
  const stops = Array.from({ length: 14 }, (_, i) => `Stop${i + 1}`);
  const url = buildGoogleMapsRouteUrl(stops);
  const parsed = new URL(url!);

  assert.equal(parsed.searchParams.get("origin"), "Stop1, Sri Lanka");
  assert.equal(parsed.searchParams.get("destination"), "Stop14, Sri Lanka");
  // 10 total stops max => origin + 8 waypoints + destination
  const waypoints = parsed.searchParams.get("waypoints")!.split("|");
  assert.equal(waypoints.length, 8);
});

test("ignores blank stops", () => {
  const url = buildGoogleMapsRouteUrl(["Colombo", "  ", "Kandy"]);
  const parsed = new URL(url!);

  assert.equal(parsed.searchParams.get("origin"), "Colombo, Sri Lanka");
  assert.equal(parsed.searchParams.get("destination"), "Kandy, Sri Lanka");
  assert.equal(parsed.searchParams.get("waypoints"), null);
});
