import type { PackageItem } from "@/types/package";
import type { PackageRequestDetails } from "@/types/packageRequest";

interface PackageRequestContext {
  details: PackageRequestDetails;
  travelerName?: string;
  travelerEmail?: string;
}

function buildPackageLabel(pkg: PackageItem) {
  return pkg.packageId
    ? `Package ${String(pkg.packageId).padStart(2, "0")}`
    : "Curated Package";
}

export function buildPackageRequestMessage(
  pkg: PackageItem,
  context: PackageRequestContext,
) {
  const { details } = context;
  const accommodationLabels = {
    recommend: `Please recommend (${details.accommodationStyle})`,
    "already-arranged": "Already arranged by traveller",
    "not-needed": "Not required",
  } as const;
  const vehicleLabels = {
    recommend: "Please recommend based on party and luggage",
    sedan: "Sedan preferred",
    suv: "SUV preferred",
    van: "Van preferred",
    premium: "Premium vehicle preferred",
  } as const;

  const messageLines = [
    "Hello ABA Ceylon,",
    "",
    "I would like to request this travel package.",
    "",
    `Package: ${buildPackageLabel(pkg)}`,
    `Title: ${pkg.title}`,
    `Duration: ${pkg.duration}`,
    `Distance: ${pkg.km} KM`,
    `Route: ${pkg.route.join(" -> ")}`,
    "",
    "TRAVEL DATES",
    `Arrival in Sri Lanka: ${details.arrivalDate}`,
    `Departure from Sri Lanka: ${details.departureDate}`,
    `Chauffeur service: ${details.chauffeurStartDate} to ${details.chauffeurEndDate}`,
    `Airport pickup: ${details.arrivalTransfer ? "Requested" : "Not required"}`,
    `Airport drop-off: ${details.departureTransfer ? "Requested" : "Not required"}`,
    "",
    "TRAVELLERS & SERVICES",
    `Party: ${details.adults} adult${details.adults === 1 ? "" : "s"}, ${details.children} child${details.children === 1 ? "" : "ren"}`,
    `Luggage: ${details.luggage} bag${details.luggage === 1 ? "" : "s"}`,
    `Accommodation: ${accommodationLabels[details.accommodation]}`,
    `Vehicle: ${vehicleLabels[details.vehicle]}`,
  ];

  if (context.travelerName) {
    messageLines.push(`Traveler Name: ${context.travelerName}`);
  }

  if (context.travelerEmail) {
    messageLines.push(`Traveler Email: ${context.travelerEmail}`);
  }

  if (details.arrivalReference.trim())
    messageLines.push(`Arrival flight / location: ${details.arrivalReference.trim()}`);
  if (details.departureReference.trim())
    messageLines.push(`Departure flight / location: ${details.departureReference.trim()}`);
  if (details.notes.trim())
    messageLines.push(`Additional notes: ${details.notes.trim()}`);

  messageLines.push(
    "",
    "The package route is already selected. Please recommend and confirm the remaining arrangements, availability, and next steps.",
  );

  return messageLines.join("\n");
}
