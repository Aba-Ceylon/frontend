"use client";

import Image from "next/image";
import Link from "next/link";
import { Briefcase, Users } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { FleetVehicle } from "@/types/vehicle";

export default function VehicleCard({ vehicle }: { vehicle: FleetVehicle }) {
  return (
    <Link href={`/fleet/${vehicle.id}`} className="group block h-full" data-fleet-card>
      <Card
        variant="white"
        className="flex h-full min-h-75 flex-col overflow-hidden border-[#0b2545]/10 bg-[#fffdf8] md:min-h-105"
      >
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 md:h-56">
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="fleet-card-image object-cover transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/28 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 font-cinzel text-xl text-[#0b2545] md:text-2xl">
            {vehicle.name}
          </h3>
          <p className="mb-5 text-sm leading-7 text-neutral-700">
            {vehicle.shortDescription}
          </p>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Badge
              variant="light"
              className="gap-1.5 border-slate-200 bg-slate-100 text-slate-700"
            >
              <Users size={13} />
              {vehicle.passengerCapacity} pax
            </Badge>
            <Badge
              variant="light"
              className="gap-1.5 border-slate-200 bg-slate-100 text-slate-700"
            >
              <Briefcase size={13} />
              {vehicle.luggageCapacity} bags
            </Badge>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {vehicle.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="border border-[#0b2545]/10 bg-[#F4ECDF] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#3B4654]"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-auto flex justify-center border-t border-[#0b2545]/10 pt-5">
            <span className="inline-flex w-full max-w-full justify-center bg-[#C99A2B] px-6 py-3 font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#0b2545] transition-colors duration-300 group-hover:bg-[#0b2545] group-hover:text-white md:max-w-xs">
              View vehicle details
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
