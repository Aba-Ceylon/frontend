"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getGalleryImages } from "@/lib/packages/packageImages";
import { Stay } from "@/types/stay";
import PackageImageCarousel from "@/features/packages/PackageImageCarousel";

export default function StayCard({ stay }: { stay: Stay }) {
  const stayLabel = stay.accommodationId
    ? `Stay ${String(stay.accommodationId).padStart(2, "0")}`
    : stay.category;
  const images = getGalleryImages(stay);

  return (
    <div className="group relative aspect-[4/5] overflow-hidden border border-white/8 sm:aspect-[3/4]">
      <Link
        href={`/stays/${stay.id}`}
        aria-label={`View details for ${stay.name}`}
        className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#F8EBC7]"
      />
      <PackageImageCarousel images={images} title={stay.name} variant="card" entityLabel="stay" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#05070A]/88 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <Badge variant="amber" className="w-fit text-[10px]">
          {stayLabel}
        </Badge>
        <p className="mt-3 font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#F8EBC7]/82">
          {stay.category}
        </p>
        <h3 className="mt-2 font-cinzel text-[1.75rem] leading-tight text-white sm:text-3xl">
          {stay.name}
        </h3>
        <p className="mt-2 text-sm leading-7 text-white/68">{stay.location}</p>
        <span className="mt-5 inline-flex items-center gap-3 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#F8EBC7]">
          View stay
          <span className="h-px w-10 bg-[#C99A2B]/70 transition-all duration-300 group-hover:w-14" />
        </span>
      </div>
    </div>
  );
}
