import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase } from "lucide-react";
import type { FleetVehicle } from "@/types/vehicle";

type VehicleCardProps = {
  vehicle: FleetVehicle;
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link
      href={`/fleet/${vehicle.id}`}
      className="group block h-full"
      data-fleet-card
    >
      <article className="h-full min-h-75 md:min-h-105 bg-white rounded-xl shadow-sm overflow-hidden border border-[#0b2545]/10 flex flex-col">
        <div className="relative h-44 md:h-52 w-full bg-gray-100 overflow-hidden">
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.name}
            fill
            className="fleet-card-image object-cover transition-transform duration-500"
            placeholder="empty"
          />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-cinzel text-lg md:text-xl text-[#0b2545] mb-2">
            {vehicle.name}
          </h3>
          <p className="text-neutral-700 text-sm mb-4 line-clamp-2">
            {vehicle.shortDescription}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-neutral-700">
              <Users size={18} className="text-[#0b2545]" />
              <span className="text-sm">{vehicle.passengerCapacity} pax</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700">
              <Briefcase size={18} className="text-[#0b2545]" />
              <span className="text-sm">{vehicle.luggageCapacity} bags</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {vehicle.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-xs text-neutral-600 bg-gray-50 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-4 flex justify-center">
            <span className="inline-flex w-full max-w-full md:max-w-xs justify-center px-6 py-3 rounded-full font-cinzel text-sm bg-amber-400 text-[#0b2545] transition-colors duration-300 group-hover:bg-[#0b2545] group-hover:text-white">
              View More Details
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
