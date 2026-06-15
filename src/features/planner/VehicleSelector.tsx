import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StepHeader from "@/components/ui/StepHeader";
import ValidationErrors from "@/components/ui/ValidationErrors";
import type { ComfortLevel } from "@/types/planner";
import type { FleetVehicle } from "@/types/vehicle";

interface VehicleSelectorProps {
  comfortLevels: Array<{
    value: ComfortLevel;
    title: string;
    description: string;
  }>;
  filteredVehicles: FleetVehicle[];
  selectedComfortLevel: ComfortLevel | "";
  selectedVehicleId: string;
  selectedVehicleType: string;
  validationIssues: string[];
  vehicleTypes: string[];
  onComfortChange: (comfortLevel: ComfortLevel) => void;
  onVehicleSelect: (vehicleId: string) => void;
  onVehicleTypeChange: (vehicleType: string) => void;
}

export default function VehicleSelector({
  comfortLevels,
  filteredVehicles,
  selectedComfortLevel,
  selectedVehicleId,
  selectedVehicleType,
  validationIssues,
  vehicleTypes,
  onComfortChange,
  onVehicleSelect,
  onVehicleTypeChange,
}: VehicleSelectorProps) {
  return (
    <div className="space-y-8">
      <StepHeader
        eyebrow="Step 3"
        title="Select your preferred vehicle type and comfort level"
      />

      <ValidationErrors issues={validationIssues} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="white" className="p-6">
          <p className="mb-4 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500">
            Vehicle Type
          </p>
          <div className="flex flex-wrap gap-3">
            {vehicleTypes.map((vehicleType) => (
              <Button
                key={vehicleType}
                type="button"
                size="sm"
                variant={
                  selectedVehicleType === vehicleType ? "primary" : "outline"
                }
                onClick={() => onVehicleTypeChange(vehicleType)}
                className={`${
                  selectedVehicleType === vehicleType
                    ? "bg-[#0F172A] text-amber-300"
                    : "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {vehicleType}
              </Button>
            ))}
          </div>
        </Card>

        <Card variant="white" className="p-6">
          <p className="mb-4 font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500">
            Comfort Level
          </p>
          <div className="grid gap-3">
            {comfortLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => onComfortChange(level.value)}
                className={`border p-4 text-left transition ${
                  selectedComfortLevel === level.value
                    ? "border-amber-500 bg-amber-50"
                    : "border-neutral-200 hover:border-amber-200"
                }`}
              >
                <p className="font-cinzel text-lg text-[#0F172A]">
                  {level.title}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {level.description}
                </p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500">
              Matching Vehicles
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Choose from the existing fleet that matches your type and comfort
              preference.
            </p>
          </div>
          <Badge
            variant="light"
            className="border-neutral-200 bg-white text-neutral-700"
          >
            {filteredVehicles.length} option
            {filteredVehicles.length === 1 ? "" : "s"}
          </Badge>
        </div>

        {filteredVehicles.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredVehicles.map((vehicle) => {
              const isSelected = selectedVehicleId === vehicle.id;

              return (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => onVehicleSelect(vehicle.id)}
                  className={`overflow-hidden border bg-white text-left transition ${
                    isSelected
                      ? "border-amber-500 shadow-[0_20px_50px_rgba(201,154,43,0.16)]"
                      : "border-neutral-200 hover:border-amber-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div
                      className="h-48 w-full bg-cover bg-center md:h-auto md:w-48"
                      style={{ backgroundImage: `url('${vehicle.imageUrl}')` }}
                    />
                    <div className="flex-1 p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
                            {vehicle.brandName}
                          </p>
                          <h3 className="mt-2 font-cinzel text-2xl text-[#0F172A]">
                            {vehicle.name}
                          </h3>
                        </div>
                        <Badge
                          variant={isSelected ? "dark" : "light"}
                          className={
                            isSelected
                              ? "border-transparent bg-[#0F172A] text-amber-300"
                              : "border-neutral-200 bg-neutral-100 text-neutral-500"
                          }
                        >
                          {isSelected ? "Chosen" : "Select"}
                        </Badge>
                      </div>

                      <p className="mb-4 text-sm leading-6 text-neutral-600">
                        {vehicle.shortDescription}
                      </p>

                      <div className="mb-4 grid grid-cols-2 gap-3 text-sm text-neutral-700">
                        <Card
                          variant="white"
                          className="bg-neutral-50 p-3 shadow-none"
                        >
                          <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Seats
                          </span>
                          {vehicle.passengerCapacity} Passengers
                        </Card>
                        <Card
                          variant="white"
                          className="bg-neutral-50 p-3 shadow-none"
                        >
                          <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Luggage
                          </span>
                          {vehicle.luggageCapacity} Bags
                        </Card>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.slice(0, 4).map((feature) => (
                          <Badge
                            key={feature}
                            variant="light"
                            className="border-neutral-200 bg-neutral-100 text-neutral-700"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <Card
            variant="white"
            className="border-dashed p-8 text-center text-neutral-600"
          >
            Please select both a vehicle type and comfort level to continue
          </Card>
        )}
      </div>
    </div>
  );
}
