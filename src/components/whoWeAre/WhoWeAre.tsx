"use client";

import Image from "next/image";
import Link from "next/link";

export default function WhoWeAre() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-20 lg:px-10 lg:py-28">
        <div data-reveal>
          <h2 className="font-cinzel text-4xl leading-[1.1] text-[#182231] sm:text-5xl">
            Sri Lanka, planned by people who live here.
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-8 text-[#182231]/68">
            We are a local team that designs private routes, picks the stays,
            and stays with you on the road.
          </p>
          <Link href="/about" className="editorial-link mt-8 text-[#C99A2B]">
            Our story
          </Link>
        </div>

        <div
          className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5]"
          data-reveal
        >
          <Image
            src="/whychoose.webp"
            alt="A road journey through the Sri Lankan countryside"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
