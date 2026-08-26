import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <article className="group relative border-b border-[#182231]/14 pb-7">
      <Link
        href={`${routes.destinations}/${destination.slug}`}
        className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C99A2B]"
        aria-label={`Explore ${destination.name}`}
      />
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e3d9]">
        <PackageImageCarousel images={images} title={destination.name} variant="card" entityLabel="destination" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/36 via-transparent to-transparent" />
        <p className="pointer-events-none absolute bottom-4 left-4 bg-[#182231]/82 px-3 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          {destination.category}
        </p>
      </div>

      <div className="pointer-events-none pt-5">
        <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#9b7422]">
          {destination.region}
        </p>
        <div className="mt-2 flex items-start justify-between gap-5">
          <h3 className="font-cinzel text-2xl leading-tight text-[#182231] sm:text-[1.7rem]">
            {destination.name}
          </h3>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#182231] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#9b7422]" />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#182231]/64">
          {destination.summary}
        </p>
        <span className="mt-5 inline-block font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#182231] underline decoration-[#C99A2B] decoration-1 underline-offset-4">
          Explore destination
        </span>
      </div>
    </article>
  );
}
