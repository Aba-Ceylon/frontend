"use client";

import Image from "next/image";
import { CheckCircle, MapPin, Phone, Tag, User } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  formatSriLankanPhoneNumber,
  normalizeSriLankanPhoneNumber,
} from "@/lib/phone/sriLankanPhoneNumber";
import { getGalleryImages } from "@/lib/packages/packageImages";
import { Stay } from "@/types/stay";
import PackageImageCarousel from "@/features/packages/PackageImageCarousel";
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
  const whatsappDigits = stay.ownerWhatsAppNumber
    ? normalizeSriLankanPhoneNumber(stay.ownerWhatsAppNumber)
    : "";
  const images = getGalleryImages(stay);
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits.replace(/^\+/, "")}`
    : null;

  return (
    <div className="bg-[#F8F4ED] min-h-screen">
      <div className="relative h-72 sm:h-96 w-full">
        <PackageImageCarousel images={images} title={stay.name} variant="hero" entityLabel="stay" />
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
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

        <section aria-labelledby="stay-gallery-title">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#A97B17]">Stay images</p>
              <h2 id="stay-gallery-title" className="mt-1 font-cinzel text-2xl text-neutral-900">Stay gallery</h2>
            </div>
            <p className="text-sm text-neutral-600">
              {images.length} {images.length === 1 ? "image" : "images"} in database order
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <figure key={`${image}-${index}`} className="group relative aspect-[4/3] overflow-hidden bg-[#101A28]">
                <Image
                  src={image}
                  alt={`${stay.name} — gallery image ${index + 1} of ${images.length}`}
                  fill
                  sizes="(max-width: 639px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-12 font-cinzel text-[11px] uppercase tracking-[0.2em] text-white">
                  Image {String(index + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
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
              {stay.ownerWhatsAppNumber
                ? formatSriLankanPhoneNumber(stay.ownerWhatsAppNumber)
                : "Available on request"}
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
