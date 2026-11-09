"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Briefcase, Check, Users } from "lucide-react";
import VehicleRequestButton from "@/features/fleet/VehicleRequestButton";
import { fetchVehicleById } from "@/services/fleetService";
import type { FleetVehicle } from "@/types/vehicle";
import { routes } from "@/constants/routes";
import {
  BookingPanel,
  DetailBody,
  DetailHero,
  DetailSection,
  FactPill,
  GalleryGrid,
} from "@/components/ui/DetailLayout";

function StatusScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--ivory)] px-6 text-center">
      {children}
    </div>
  );
}

export default function VehiclePage() {
  const params = useParams();
  const id = params?.id as string;
  const [vehicle, setVehicle] = useState<FleetVehicle | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchVehicleById(id).then((v) => {
      if (!v) setNotFound(true);
      else setVehicle(v);
    });
  }, [id]);

  if (notFound) {
    return (
      <StatusScreen>
        <p className="font-cinzel text-3xl text-[#182231]">Vehicle not found.</p>
        <Link href={routes.fleet} className="editorial-link text-[#9b7422]">
          Back to the fleet
        </Link>
      </StatusScreen>
    );
  }

  if (!vehicle) {
    return (
      <StatusScreen>
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#c99a2b] border-t-transparent" aria-hidden="true" />
        <p className="font-cinzel text-sm uppercase tracking-[0.24em] text-[#182231]/60">Loading vehicle</p>
      </StatusScreen>
    );
  }

  const images = vehicle.images?.length ? vehicle.images : [vehicle.imageUrl];
  const subtitle = [vehicle.brandName, vehicle.type].filter(Boolean).join(" · ") || "Private fleet";

  return (
    <div className="min-h-screen">
      <DetailHero
        images={images}
        title={vehicle.name}
        eyebrow={subtitle}
        backHref={routes.fleet}
        backLabel="All vehicles"
        entityLabel="vehicle"
      >
        <div className="flex flex-wrap gap-3">
          <FactPill icon={<Users className="h-4 w-4" />}>{vehicle.passengerCapacity} seats</FactPill>
          <FactPill icon={<Briefcase className="h-4 w-4" />}>{vehicle.luggageCapacity} bags</FactPill>
        </div>
      </DetailHero>

      <DetailBody
        aside={
          <BookingPanel kicker="Chauffeur-driven" title="Request this vehicle.">
            <p className="text-sm leading-6 text-white/70">
              Our team will confirm availability and arrange your driver.
            </p>
            <VehicleRequestButton
              vehicle={vehicle}
              className="mt-6 inline-flex w-full items-center justify-center bg-[#e2c27a] px-5 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-[#0d141e] transition hover:bg-white"
            />
          </BookingPanel>
        }
      >
        <DetailSection kicker="Overview" title="About this vehicle">
          {vehicle.shortDescription ? (
            <p className="max-w-3xl text-base leading-8 text-[#182231]/72 sm:text-lg sm:leading-9">
              {vehicle.shortDescription}
            </p>
          ) : null}
          {vehicle.models.length ? (
            <p className="mt-5 text-sm text-[#182231]/60">
              <span className="font-cinzel uppercase tracking-[0.16em] text-[#9b7422]">Models</span>{" "}
              {vehicle.models.join(", ")}
            </p>
          ) : null}
        </DetailSection>

        {vehicle.features.length ? (
          <DetailSection kicker="Comfort" title="Features">
            <ul className="grid gap-3 sm:grid-cols-2">
              {vehicle.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 border border-[#182231]/8 bg-white px-5 py-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c99a2b]/15 text-[#9b7422]">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] leading-6 text-[#182231]/80">{feature}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        ) : null}

        {images.length > 1 ? (
          <DetailSection kicker="Gallery" title="Inside and out">
            <GalleryGrid images={images} title={vehicle.name} />
          </DetailSection>
        ) : null}
      </DetailBody>
    </div>
  );
}
