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
  vehicleTypes,
  onComfortChange,
  onVehicleSelect,
  onVehicleTypeChange,
}: VehicleSelectorProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
          Step 3
        </p>
        <h2 className="font-cinzel text-3xl text-[#0F172A]">
          Select Vehicle Type & Comfort
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500 mb-4">
            Vehicle Type
          </p>
          <div className="flex flex-wrap gap-3">
            {vehicleTypes.map((vehicleType) => (
              <button
                key={vehicleType}
                type="button"
                onClick={() => onVehicleTypeChange(vehicleType)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedVehicleType === vehicleType
                    ? "bg-[#0F172A] text-amber-300"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {vehicleType}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500 mb-4">
            Comfort Level
          </p>
          <div className="grid gap-3">
            {comfortLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => onComfortChange(level.value)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedComfortLevel === level.value
                    ? "border-amber-500 bg-amber-50"
                    : "border-neutral-200 hover:border-amber-200"
                }`}
              >
                <p className="font-cinzel text-lg text-[#0F172A]">
                  {level.title}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {level.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-neutral-500">
              Matching Vehicles
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Choose from the existing fleet that matches your type and comfort
              preference.
            </p>
          </div>
          <span className="rounded-full bg-white border border-neutral-200 px-4 py-2 text-sm text-neutral-700">
            {filteredVehicles.length} option
            {filteredVehicles.length === 1 ? "" : "s"}
          </span>
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
                  className={`rounded-3xl border overflow-hidden bg-white text-left transition ${
                    isSelected
                      ? "border-amber-500 shadow-[0_20px_50px_rgba(201,154,43,0.16)]"
                      : "border-neutral-200 hover:border-amber-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div
                      className="w-full md:w-48 h-48 md:h-auto bg-cover bg-center"
                      style={{ backgroundImage: `url('${vehicle.imageUrl}')` }}
                    />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
                            {vehicle.brandName}
                          </p>
                          <h3 className="font-cinzel text-2xl text-[#0F172A] mt-2">
                            {vehicle.name}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-cinzel uppercase tracking-[0.22em] ${
                            isSelected
                              ? "bg-[#0F172A] text-amber-300"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {isSelected ? "Chosen" : "Select"}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-600 leading-6 mb-4">
                        {vehicle.shortDescription}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm text-neutral-700 mb-4">
                        <div className="rounded-2xl bg-neutral-50 p-3">
                          <span className="block text-xs text-neutral-500 uppercase tracking-[0.2em] mb-1">
                            Seats
                          </span>
                          {vehicle.passengerCapacity} passengers
                        </div>
                        <div className="rounded-2xl bg-neutral-50 p-3">
                          <span className="block text-xs text-neutral-500 uppercase tracking-[0.2em] mb-1">
                            Luggage
                          </span>
                          {vehicle.luggageCapacity} bags
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.slice(0, 4).map((feature) => (
                          <span
                            key={feature}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-600">
            Select a vehicle type and comfort level that have matching vehicles
            in the system.
          </div>
        )}
      </div>
    </div>
  );
}
