import type { FleetVehicle } from "@/types/vehicle";

interface VehicleRequestContext {
  bookingDate: string;
  travelerName?: string;
  travelerEmail?: string;
}

export function buildVehicleRequestMessage(
  vehicle: FleetVehicle,
  context: VehicleRequestContext,
) {
  return [
    "Hello ABA Ceylon,",
    "",
    "I would like to request this vehicle.",
    "",
    `Vehicle: ${vehicle.name}`,
    `Type: ${vehicle.type}`,
    `Passenger Capacity: ${vehicle.passengerCapacity}`,
    `Luggage Capacity: ${vehicle.luggageCapacity}`,
    `Availability: ${vehicle.availabilityStatus}`,
    `Vehicle Number: ${vehicle.vehicleNumber}`,
    `Owner: ${vehicle.ownerName}`,
    `Preferred Booking Date: ${context.bookingDate}`,
    context.travelerName ? `Traveler Name: ${context.travelerName}` : null,
    context.travelerEmail ? `Traveler Email: ${context.travelerEmail}` : null,
    "",
    "Please share the availability and booking details.",
  ]
    .filter(Boolean)
    .join("\n");
}
