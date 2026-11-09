"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getGalleryImages } from "@/lib/packages/packageImages";
import { Stay } from "@/types/stay";
import PackageImageCarousel from "@/features/packages/PackageImageCarousel";

export default function StayCard({ stay }: { stay: Stay }) {
  const images = getGalleryImages(stay);

  return (
    <div
      className="card-lift card-zoom group relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#182231] hover:border-[#e2c27a]/40"
      data-spotlight
    >
      <Link
        href={`/stays/${stay.id}`}
        aria-label={`View details for ${stay.name}`}
        className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#F8EBC7]"
      />
      <PackageImageCarousel images={images} title={stay.name} variant="card" entityLabel="stay" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0d141e]/92 via-[#0d141e]/20 to-transparent" />

      <p className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-white/25 bg-[#0d141e]/45 px-3.5 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
        {stay.category}
      </p>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
        <h3 className="font-cinzel text-[1.75rem] leading-tight text-white [text-wrap:balance] sm:text-3xl">
          {stay.name}
        </h3>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="inline-flex items-start gap-2 text-sm leading-6 text-white/75">
            <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-[#e2c27a]" aria-hidden="true" />
            {stay.location}
          </p>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-300 group-hover:border-[#e2c27a] group-hover:bg-[#e2c27a] group-hover:text-[#0d141e]">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
