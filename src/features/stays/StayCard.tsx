"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Stay } from "@/types/stay";

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
        <span className="font-cinzel text-neutral-500 text-sm">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
      onError={() => setErrored(true)}
    />
  );
}

export default function StayCard({ stay }: { stay: Stay }) {
  return (
    <div className="animate-card group relative rounded-sm overflow-hidden aspect-[3/4]">
      {/* Layer 1: Image */}
      <ImageWithFallback src={stay.image} alt={stay.name} />

      {/* Layer 2: Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Layer 3: Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 gap-1">
        <p className="font-cinzel text-amber-400 text-xs tracking-widest uppercase">
          {stay.location}
        </p>
        <h3 className="font-cinzel text-2xl text-white leading-snug mb-3">
          {stay.name}
        </h3>
        <Link
          href={`/stays/${stay.id}`}
          className="self-start font-cinzel rounded-md text-sm px-4 py-2 border border-amber-400/60 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors duration-300"
        >
          View Stay
        </Link>
      </div>
    </div>
  );
}
