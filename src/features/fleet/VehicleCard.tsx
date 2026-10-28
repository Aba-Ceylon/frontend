"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Users } from "lucide-react";
import type { FleetVehicle } from "@/types/vehicle";

const BODY = { fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif' };

export default function VehicleCard({ vehicle }: { vehicle: FleetVehicle }) {
  const isAvailable = vehicle.availabilityStatus?.toLowerCase() === "available";
  const subtitle = [vehicle.brandName, vehicle.type].filter(Boolean).join(" ");

  return (
    <Link
      href={`/fleet/${vehicle.id}`}
      className="group flex h-full flex-col overflow-hidden border border-[#182231]/10 bg-white transition-[border-color,box-shadow] duration-300 hover:border-[#C99A2B]/50 hover:shadow-[0_20px_40px_rgba(24,34,49,0.1)]"
      data-fleet-card
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f6f0e6]">
        <Image
          src={vehicle.imageUrl}
          alt={vehicle.name}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="fleet-card-image object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col p-6" style={BODY}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9b7422]">{subtitle}</p>
          <p
            className={`text-[11px] uppercase tracking-[0.16em] ${
              isAvailable ? "text-emerald-700" : "text-[#182231]/45"
            }`}
          >
            {isAvailable ? "Available" : vehicle.availabilityStatus}
          </p>
        </div>

        <h3 className="mt-3 font-cinzel text-2xl leading-tight text-[#182231]">
          {vehicle.name}
        </h3>

        <div className="mb-6 mt-4 flex items-center gap-5 text-sm text-[#182231]/70">
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-[#9b7422]" aria-hidden="true" />
            {vehicle.passengerCapacity} seats
          </span>
          <span className="inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#9b7422]" aria-hidden="true" />
            {vehicle.luggageCapacity} bags
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#182231]/10 pt-5">
          <span className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#182231]">
            View details
          </span>
          <span className="flex h-9 w-9 items-center justify-center border border-[#182231]/15 text-[#182231] transition-colors duration-300 group-hover:border-[#182231] group-hover:bg-[#182231] group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
