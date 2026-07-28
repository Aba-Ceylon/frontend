import type { PackageRequestDetails } from "@/types/packageRequest";

export const DEFAULT_PACKAGE_REQUEST: PackageRequestDetails = {
  arrivalDate: "",
  departureDate: "",
  chauffeurStartDate: "",
  chauffeurEndDate: "",
  adults: 2,
  children: 0,
  luggage: 2,
  arrivalTransfer: true,
  departureTransfer: true,
  accommodation: "recommend",
  accommodationStyle: "flexible",
  vehicle: "recommend",
  arrivalReference: "",
  departureReference: "",
  notes: "",
};

export function validatePackageRequestDates(
  details: PackageRequestDetails,
): string[] {
  const issues: string[] = [];

  if (!details.arrivalDate || !details.departureDate) {
    issues.push("Add your arrival and departure dates.");
  } else if (details.departureDate < details.arrivalDate) {
    issues.push("Departure must be after arrival.");
  }

  if (!details.chauffeurStartDate || !details.chauffeurEndDate) {
    issues.push("Add the dates you need the chauffeur and vehicle.");
  } else {
    if (details.chauffeurEndDate < details.chauffeurStartDate) {
      issues.push("Chauffeur service must end after it starts.");
    }
    if (
      details.arrivalDate &&
      details.chauffeurStartDate < details.arrivalDate
    ) {
      issues.push("Chauffeur service cannot start before arrival.");
    }
    if (
      details.departureDate &&
      details.chauffeurEndDate > details.departureDate
    ) {
      issues.push("Chauffeur service cannot end after departure.");
    }
  }

  return issues;
}

export function validatePackageRequestParty(
  details: PackageRequestDetails,
): string[] {
  const issues: string[] = [];
  if (details.adults < 1) issues.push("At least one adult is required.");
  if (details.children < 0) issues.push("Children cannot be negative.");
  if (details.luggage < 0) issues.push("Luggage cannot be negative.");
  return issues;
}
