import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Destination } from "@/types/destination";
import { routes } from "@/constants/routes";
import { getGalleryImages } from "@/lib/packages/packageImages";
import PackageImageCarousel from "@/features/packages/PackageImageCarousel";

const FALLBACK_IMAGE = "/images/heritage/sl-image.webp";

export default function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  const images = getGalleryImages({
    image: destination.images?.[0] || FALLBACK_IMAGE,
    images: destination.images,
  });

  return (
    <article className="card-lift card-zoom group relative flex h-full flex-col overflow-hidden border border-[#182231]/10 bg-white hover:border-[#c99a2b]/50" data-spotlight>
      {/* Whole-card link sits underneath; carousel buttons stay clickable above it. */}
      <Link
        href={`${routes.destinations}/${destination.slug}`}
        className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c99a2b]"
        aria-label={`Explore ${destination.name}`}
      />

      <div className="pointer-events-none relative aspect-[5/4] overflow-hidden bg-[#182231]">
        <PackageImageCarousel images={images} title={destination.name} variant="card" entityLabel="destination" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d141e]/80 via-transparent to-transparent" />
        <p className="absolute left-5 top-5 z-10 rounded-full border border-white/25 bg-[#0d141e]/45 px-3.5 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
          {destination.category}
        </p>
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
          <p className="inline-flex items-center gap-1.5 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#e2c27a]">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {destination.region}
          </p>
          <h3 className="mt-2 font-cinzel text-3xl leading-tight text-white sm:text-4xl">
            {destination.name}
          </h3>
        </div>
      </div>

      <div className="pointer-events-none flex flex-1 items-end justify-between gap-6 p-6 sm:p-8">
        <p className="line-clamp-2 text-[15px] leading-7 text-[#182231]/68">
          {destination.summary}
        </p>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#182231]/15 text-[#182231] transition-colors duration-300 group-hover:border-[#182231] group-hover:bg-[#182231] group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
