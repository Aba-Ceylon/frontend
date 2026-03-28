import Image from "next/image";
import { notFound } from "next/navigation";
import vehicles from "@/data/vehicles";
import { Users, Briefcase } from "lucide-react";
import Container from "@/components/layout/Container";

export default function VehiclePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) return notFound();

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
              <p className="text-neutral-700 mb-4">Models: {vehicle.models.join(", ")}</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Users size={18} className="text-[#0b2545]" />
                  <span className="text-sm">{vehicle.passengerCapacity} passengers</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Briefcase size={18} className="text-[#0b2545]" />
                  <span className="text-sm">{vehicle.luggageCapacity} luggage</span>
                </div>
              </div>

              <h3 className="font-cinzel text-lg text-[#0b2545] mb-3">Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {vehicle.features.map((f) => (
                  <li key={f} className="text-neutral-700 bg-gray-50 px-3 py-2 rounded">{f}</li>
                ))}
              </ul>

              <div>
                <h3 className="font-cinzel text-lg text-[#0b2545] mb-2">About this vehicle</h3>
                <p className="text-neutral-700 leading-7">{vehicle.shortDescription}</p>
              </div>
            </div>

            <aside className="lg:w-1/3">
              <div className="bg-white rounded p-6 shadow-sm">
                <h4 className="font-cinzel text-lg text-[#0b2545] mb-4">Request Vehicle</h4>
                <p className="text-neutral-700 mb-4">Complete a quick request and our concierge will contact you to confirm availability and pricing.</p>

                <button className="w-full px-5 py-3 rounded-full font-cinzel text-sm bg-amber-400 text-[#0b2545] hover:opacity-95 transition">
                  Request Vehicle
                </button>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}
