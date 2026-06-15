"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Stay } from "@/types/stay";

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-800">
        <span className="font-cinzel text-sm text-neutral-500">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export default function StayCard({ stay }: { stay: Stay }) {
  const stayLabel = stay.accommodationId
    ? `Stay ${String(stay.accommodationId).padStart(2, "0")}`
    : stay.category;

  return (
    <div className="group relative aspect-[4/5] overflow-hidden border border-white/8 sm:aspect-[3/4]">
      <ImageWithFallback src={stay.image} alt={stay.name} />
      <div className="absolute inset-0 bg-linear-to-t from-[#05070A]/88 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
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
        <Link
          href={`/stays/${stay.id}`}
          className="mt-5 inline-flex items-center gap-3 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#F8EBC7]"
        >
          View stay
          <span className="h-px w-10 bg-[#C99A2B]/70 transition-all duration-300 group-hover:w-14" />
        </Link>
      </div>
    </div>
  );
}
