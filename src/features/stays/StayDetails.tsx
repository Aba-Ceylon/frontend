"use client";

import Image from "next/image";
import { CheckCircle, MapPin, Phone, Tag, User } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Stay } from "@/types/stay";
import StayLocationMap from "./StayLocationMap";

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card variant="white" className="flex items-center gap-3 p-4">
      {icon}
      <div>
        <p className="text-xs text-[#1A2238] font-cinzel">{label}</p>
        <p className="text-sm text-[#1A2238] font-medium font-cinzel">{value}</p>
      </div>
    </Card>
  );
}

export default function StayDetails({ stay }: { stay: Stay }) {
  const mapsHref = stay.coordinates
    ? `https://www.google.com/maps?q=${stay.coordinates.latitude},${stay.coordinates.longitude}`
    : null;
  const whatsappDigits = stay.ownerWhatsAppNumber?.replace(/[^\d+]/g, "") ?? "";
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits.replace(/^\+/, "")}`
    : null;

  return (
    <div className="bg-[#F8F4ED] min-h-screen">
      <div className="relative h-72 sm:h-96 w-full">
        <Image src={stay.image} alt={stay.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-5xl mx-auto">
          <Badge variant="amber" className="mb-2 w-fit">{stay.category}</Badge>
          <h1 className="font-cinzel text-3xl sm:text-5xl text-white font-medium">{stay.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={<Tag size={18} className="text-amber-700" />} label="Category" value={stay.category} />
          <StatCard icon={<User size={18} className="text-amber-700" />} label="Owner" value={stay.ownerName || "Available on request"} />
        </div>

        <StayLocationMap stay={stay} />

        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">About This Stay</h2>
          <p className="text-neutral-700 leading-7">{stay.description}</p>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">Amenities</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {stay.amenities.map((amenity) => (
              <Card key={amenity} variant="white" className="flex items-start gap-3 p-3">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700">{amenity}</span>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Card variant="white" className="p-5 min-w-[220px]">
            <p className="font-cinzel text-xs text-neutral-500 mb-1">WhatsApp Contact</p>
            <p className="font-cinzel text-xl text-neutral-900 font-medium break-all">
              {stay.ownerWhatsAppNumber || "Available on request"}
            </p>
          </Card>
          <div className="flex flex-col sm:flex-row gap-3">
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-cinzel text-sm rounded bg-neutral-900 text-white hover:bg-amber-700 transition">
                <Phone size={16} />
                Contact on WhatsApp
              </a>
            ) : null}
            {mapsHref ? (
              <a href={mapsHref} target="_blank" rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-cinzel text-sm rounded border border-neutral-300 text-neutral-900 hover:bg-white transition">
                <MapPin size={16} />
                View on Map
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
