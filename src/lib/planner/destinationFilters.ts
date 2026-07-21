import type { Destination } from "@/types/destination";

export const ALL_DISTRICTS = "all";

export function getDestinationDistricts(destinations: Destination[]) {
  return Array.from(
    new Set(destinations.map((destination) => destination.district.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
}

export function filterPlannerDestinations(
  destinations: Destination[],
  district: string,
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return destinations.filter((destination) => {
    const matchesDistrict =
      district === ALL_DISTRICTS || destination.district === district;

    if (!matchesDistrict) return false;
    if (!normalizedQuery) return true;

    return [
      destination.name,
      destination.district,
      destination.province,
      destination.region,
    ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  });
}
