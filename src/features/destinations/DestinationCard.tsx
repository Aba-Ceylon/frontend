import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/types/destination";
import { routes } from "@/constants/routes";

const FALLBACK_IMAGE = "/images/heritage/sl-image.webp";

export default function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  const image = destination.images?.[0] || FALLBACK_IMAGE;

  return (
    <article className="group overflow-hidden border border-[#182231]/10 bg-white shadow-[0_16px_42px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={destination.name}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-amber-200">
            {destination.category}
          </p>
          <h3 className="mt-2 font-cinzel text-2xl text-white">
            {destination.name}
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <span className="border border-[#C99A2B]/35 px-3 py-1 font-cinzel text-[11px] uppercase tracking-[0.14em] text-[#182231]">
            {destination.region}
          </span>
          <span className="border border-[#182231]/10 px-3 py-1 text-xs text-[#182231]/72">
            {destination.bestTimeToVisit}
          </span>
        </div>

        <p className="text-sm leading-7 text-[#182231]/68">
          {destination.summary}
        </p>

        <ul className="space-y-2 text-sm text-[#182231]/62">
          {destination.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-2 h-px w-5 shrink-0 bg-[#C99A2B]" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`${routes.destinations}/${destination.slug}`}
          className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.14em] text-[#182231] transition-colors hover:text-[#C99A2B]"
        >
          View destination
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </article>
  );
}
