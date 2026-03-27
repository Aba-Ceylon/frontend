"use client";

import Image from "next/image";
import { Stay } from "@/types/stay";
import { MapPin, Tag, Star, CheckCircle } from "lucide-react";

export default function StayDetails({ stay }: { stay: Stay }) {
  return (
    <div className="bg-[#F8F4ED] min-h-screen">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 w-full">
        <Image src={stay.image} alt={stay.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-5xl mx-auto">
          <p className="font-cinzel text-amber-400 text-sm mb-1">{stay.category}</p>
          <h1 className="font-cinzel text-3xl sm:text-5xl text-white font-medium">{stay.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white rounded p-4 shadow-sm">
            <MapPin size={18} className="text-amber-700" />
            <div>
              <p className="text-xs text-[#1A2238] font-cinzel">Location</p>
              <p className="text-sm text-[#1A2238] font-medium font-cinzel">{stay.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded p-4 shadow-sm">
            <Tag size={18} className="text-amber-700" />
            <div>
              <p className="text-xs text-[#1A2238] font-cinzel">Category</p>
              <p className="text-sm text-[#1A2238] font-medium font-cinzel">{stay.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded p-4 shadow-sm col-span-2 sm:col-span-1">
            <Star size={18} className="text-amber-700" />
            <div>
              <p className="text-xs text-[#1A2238] font-cinzel">Rating</p>
              <p className="text-sm text-[#1A2238] font-medium font-cinzel">{stay.rating} / 5.0</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">About This Stay</h2>
          <p className="text-neutral-700 leading-7">{stay.description}</p>
        </section>

        {/* Amenities */}
        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">Amenities</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {stay.amenities.map((amenity) => (
              <div key={amenity} className="flex items-start gap-3 bg-white rounded p-3 shadow-sm">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700">{amenity}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Price + CTA */}
        <section className="flex items-center gap-6">
          <div className="bg-white rounded p-5 shadow-sm">
            <p className="font-cinzel text-xs text-neutral-500 mb-1">Starting from</p>
            <p className="font-cinzel text-3xl text-neutral-900 font-medium">
              ${stay.pricePerNight}
              <span className="text-sm text-neutral-500 font-normal"> / night</span>
            </p>
          </div>
          <button className="px-6 py-3 font-cinzel text-sm rounded bg-neutral-900 text-white hover:bg-amber-700 transition cursor-pointer">
            Enquire Now
          </button>
        </section>
      </div>
    </div>
  );
}
