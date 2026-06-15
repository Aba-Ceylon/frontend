"use client";

import Image from "next/image";
import Link from "next/link";

const REASONS = [
  {
    step: "01",
    title: "We know the roads",
    body: "Our routes are shaped from lived local experience, not reseller templates or copied package logic.",
  },
  {
    step: "02",
    title: "One person, start to finish",
    body: "The person who plans the trip is the same person you can reach while it is happening.",
  },
  {
    step: "03",
    title: "Built around your pace",
    body: "We adjust for quiet mornings, longer coast stays, family needs, or a tighter highland route when that suits the trip better.",
  },
  {
    step: "04",
    title: "Honest advice",
    body: "If a stop is weak in your season or not worth the drive, we say so before it wastes your time.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#C99A2B]">
              Why choose us
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl lg:text-[3.5rem]">
              The difference is not luxury styling. It is local judgment.
            </h2>
            <p
              className="mt-5 max-w-xl text-base leading-8 text-[#182231]/66"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              The site is designed to feel calm and premium, but the real value
              is practical: better timing, stronger pacing, and one accountable
              local team behind the whole route.
            </p>

            <div className="mt-10 border-t border-[#182231]/10">
              {REASONS.map((reason) => (
                <div
                  key={reason.step}
                  className="grid gap-4 border-b border-[#182231]/10 py-6 sm:grid-cols-[84px_minmax(0,1fr)]"
                  data-reveal
                >
                  <div className="font-cinzel text-3xl text-[#C99A2B]/58">
                    {reason.step}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-2xl text-[#182231]">
                      {reason.title}
                    </h3>
                    <p
                      className="mt-3 max-w-xl text-sm leading-7 text-[#182231]/66"
                      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                    >
                      {reason.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/planner" className="editorial-link text-[#182231]">
                Start planning
              </Link>
              <Link
                href="/about"
                className="font-cinzel text-[12px] uppercase tracking-[0.14em] text-[#182231]/68 transition-colors hover:text-[#182231]"
              >
                Our story
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-24" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden border border-[#182231]/10">
              <Image
                src="/whychoose.webp"
                alt="Aba Ceylon road journey through Sri Lanka"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070A]/72 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
