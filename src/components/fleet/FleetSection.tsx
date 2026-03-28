"use client";

import Container from "@/components/layout/Container";
import vehicles from "@/data/vehicles";
import Image from "next/image";
import { Users, Briefcase } from "lucide-react";

export default function FleetSection() {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-amber-400 font-cinzel text-sm">Premium Fleet</p>
          <h2 className="font-cinzel text-3xl text-[#0b2545] font-semibold mt-2">Chauffeured Vehicles</h2>
          <p className="text-slate-500 mt-3">High-end vehicles for seamless travel across Sri Lanka.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <article key={v.id} className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="relative h-48 w-full bg-gray-100">
                {/* use next/image when possible; fallback to img if remote */}
                <Image
                  src={v.imageUrl}
                  alt={v.name}
                  fill
                  className="object-cover"
                  placeholder="empty"
                />
              </div>

              <div className="p-5">
                <h3 className="font-cinzel text-xl text-[#0b2545] mb-2">{v.name}</h3>
                <p className="text-neutral-700 text-sm mb-4">{v.shortDescription}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Users size={18} className="text-[#0b2545]" />
                    <span className="text-sm">{v.passengerCapacity} pax</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-700">
                    <Briefcase size={18} className="text-[#0b2545]" />
                    <span className="text-sm">{v.luggageCapacity} bags</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {v.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-xs text-neutral-600 bg-gray-50 px-2 py-1 rounded">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <button className="px-5 py-2 rounded-full font-cinzel text-sm bg-amber-400 text-[#0b2545] hover:opacity-95 transition">
                    Plan Your Journey
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
