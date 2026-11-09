"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Users } from "lucide-react";
import type { FleetVehicle } from "@/types/vehicle";

export default function VehicleCard({ vehicle }: { vehicle: FleetVehicle }) {
  const isAvailable = vehicle.availabilityStatus?.toLowerCase() === "available";
  const subtitle = [vehicle.brandName, vehicle.type].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/fleet/${vehicle.id}`}
      className="card-lift card-zoom group flex h-full flex-col overflow-hidden border border-[#182231]/10 bg-white hover:border-[#c99a2b]/50"
      data-fleet-card
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efe8dc]" data-spotlight>
        <Image
          src={vehicle.imageUrl}
          alt={vehicle.name}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover"
          loading="lazy"
        />
        {vehicle.availabilityStatus ? (
          <p
            className={`absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] backdrop-blur-md ${
              isAvailable ? "bg-white/85 text-emerald-800" : "bg-[#0d141e]/60 text-white"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-600" : "bg-white/60"}`}
              aria-hidden="true"
            />
            {isAvailable ? "Available" : vehicle.availabilityStatus}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#9b7422]">{subtitle}</p>
        <h3 className="mt-2 font-cinzel text-2xl leading-tight text-[#182231] sm:text-3xl">
          {vehicle.name}
        </h3>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#182231]/75">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--ivory)] px-3.5 py-1.5">
            <Users className="h-4 w-4 text-[#9b7422]" aria-hidden="true" />
            {vehicle.passengerCapacity} seats
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--ivory)] px-3.5 py-1.5">
            <Briefcase className="h-4 w-4 text-[#9b7422]" aria-hidden="true" />
            {vehicle.luggageCapacity} bags
          </span>
        </div>

        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between border-t border-[#182231]/10 pt-5">
            <span className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#182231]">
              View details
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#182231]/15 text-[#182231] transition-colors duration-300 group-hover:border-[#182231] group-hover:bg-[#182231] group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
