import type { PackageItem } from "@/types/package";

interface PackageRequestContext {
  bookingDate: string | null;
  dateUnknown: boolean;
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
    `Preferred Travel Date: ${
      context.dateUnknown
        ? "I don't have a date yet"
        : context.bookingDate || "Not provided"
    }`,
  ];

  if (context.travelerName) {
    messageLines.push(`Traveler Name: ${context.travelerName}`);
  }

  if (context.travelerEmail) {
    messageLines.push(`Traveler Email: ${context.travelerEmail}`);
  }

  if (pkg.recommendedVehicle?.type) {
    messageLines.push(`Recommended Vehicle: ${pkg.recommendedVehicle.type}`);
  }

  messageLines.push("", "Please share the booking details and next steps.");

  return messageLines.join("\n");
}
