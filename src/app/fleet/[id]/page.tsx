"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Users, Briefcase } from "lucide-react";
import Container from "@/components/layout/Container";
import VehicleRequestButton from "@/features/fleet/VehicleRequestButton";
import { fetchVehicleById } from "@/services/fleetService";
import type { FleetVehicle } from "@/types/vehicle";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-cinzel text-2xl text-neutral-700">Vehicle not found.</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-cinzel text-neutral-500">Loading vehicle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-96 w-full bg-gray-100">
        <Image src={vehicle.imageUrl} alt={vehicle.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end p-8">
          <div>
            <p className="text-amber-400 font-cinzel">Premium Fleet</p>
            <h1 className="text-4xl text-white font-cinzel font-semibold">{vehicle.name}</h1>
            <p className="text-white/90 mt-2">{vehicle.shortDescription}</p>
          </div>
        </div>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 bg-white rounded p-6 shadow-sm">
              <h2 className="font-cinzel text-2xl text-[#0b2545] mb-4">Overview</h2>
              <p className="text-neutral-700 mb-4">
                Models: {vehicle.models.join(", ")}
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Users size={18} className="text-[#0b2545]" />
                  <span className="text-sm">{vehicle.passengerCapacity} Passengers</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Briefcase size={18} className="text-[#0b2545]" />
                  <span className="text-sm">{vehicle.luggageCapacity} Bags</span>
                </div>
              </div>

              <h3 className="font-cinzel text-lg text-[#0b2545] mb-3">Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {vehicle.features.map((f) => (
                  <li key={f} className="text-neutral-700 bg-gray-50 px-3 py-2 rounded">{f}</li>
                ))}
              </ul>

              <div>
                <h3 className="font-cinzel text-lg text-[#0b2545] mb-2">About This Vehicle</h3>
                <p className="text-neutral-700 leading-7">{vehicle.shortDescription}</p>
              </div>
            </div>

            <aside className="lg:w-1/3">
              <div className="bg-white rounded p-6 shadow-sm">
                <h4 className="font-cinzel text-lg text-[#0b2545] mb-4">Request This Vehicle</h4>
                <p className="text-neutral-700 mb-4">Our concierge team will contact you to confirm availability and arrange your booking</p>
                <VehicleRequestButton
                  vehicle={vehicle}
                  className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-5 py-3 font-cinzel text-sm text-[#0b2545] transition hover:opacity-95"
                />
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}
