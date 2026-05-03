"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { FleetVehicle } from "@/types/vehicle";

export default function VehicleCard({ vehicle }: { vehicle: FleetVehicle }) {
  return (
    <Link href={`/fleet/${vehicle.id}`} className="group block h-full" data-fleet-card>
      <Card variant="white" className="h-full min-h-75 md:min-h-105 rounded-xl overflow-hidden flex flex-col border-[#0b2545]/10">
        <div className="relative h-44 md:h-52 w-full bg-gray-100 overflow-hidden">
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="fleet-card-image object-cover transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-cinzel text-lg md:text-xl text-[#0b2545] mb-2">{vehicle.name}</h3>
          <p className="text-neutral-700 text-sm mb-4 line-clamp-2">{vehicle.shortDescription}</p>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge variant="light" className="bg-slate-100 text-slate-700 border-slate-200 gap-1.5">
              <Users size={13} />
              {vehicle.passengerCapacity} pax
            </Badge>
            <Badge variant="light" className="bg-slate-100 text-slate-700 border-slate-200 gap-1.5">
              <Briefcase size={13} />
              {vehicle.luggageCapacity} bags
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {vehicle.features.slice(0, 3).map((feature) => (
              <span key={feature} className="text-xs text-neutral-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
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
      </Card>
    </Link>
  );
}
