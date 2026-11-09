"use client";

import Image from "next/image";
import Link from "next/link";
import { routes } from "@/constants/routes";
import { SectionKicker, TeardropWatermark } from "@/components/ui/Teardrop";

const PROMISES = [
  {
    title: "Planned on the island",
    copy: "Routes drawn by a Colombo team that knows the roads, the seasons and the quiet corners.",
  },
  {
    title: "Your own chauffeur",
    copy: "One English-speaking driver for the whole journey, in a vehicle matched to your group.",
  },
  {
    title: "With you on the road",
    copy: "A direct line to the people who planned your trip, from arrival to departure.",
  },
];

export default function WhoWeAre() {
  return (
    <section className="relative overflow-hidden bg-[var(--ivory)]">
      <TeardropWatermark className="absolute -left-24 top-10 hidden w-[340px] text-[#9b7422]/10 lg:block" />

      <div className="relative mx-auto grid max-w-[1360px] gap-14 px-6 py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-20 lg:px-10 lg:py-28">
        <div data-reveal>
          <SectionKicker>Who we are</SectionKicker>
          <h2 className="mt-5 max-w-[16ch] font-cinzel text-4xl leading-[1.1] text-[#182231] sm:text-5xl">
            Sri Lanka, planned by people who live here.
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-8 text-[#182231]/70">
            Aba Ceylon is a small local team. We design private routes, choose
            the stays ourselves, and stay with you from the first message to
            the last mile.
          </p>

          <ol className="mt-10 grid gap-6 border-t border-[#182231]/12 pt-8 sm:grid-cols-3 sm:gap-8">
            {PROMISES.map((promise, index) => (
              <li key={promise.title}>
                <p className="font-cinzel text-xs tracking-[0.2em] text-[#9b7422]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-cinzel text-lg leading-snug text-[#182231]">
                  {promise.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#182231]/62">{promise.copy}</p>
              </li>
            ))}
          </ol>

          <Link href={routes.about} className="editorial-link mt-10 text-[#9b7422] hover:text-[#182231]">
            Our story
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[480px]" data-reveal>
          {/* Thin gold arch offset behind the photo. */}
          <div
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full border border-[#c99a2b]/50 sm:translate-x-6 sm:translate-y-6"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[#182231]">
            <Image
              src="/whychoose.webp"
              alt="A traveller leaning out of a blue train in the Sri Lankan hill country"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 480px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
