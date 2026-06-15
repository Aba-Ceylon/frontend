"use client";

import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  {
    label: "Local routes",
    description: "Every road we recommend has been driven by our own team.",
  },
  {
    label: "Direct access",
    description: "You speak to the people who plan and coordinate the journey.",
  },
  {
    label: "No pressure",
    description: "We design first and let you decide when the route feels right.",
  },
];

export default function WhoWeAre() {
  return (
    <section className="section-wash overflow-hidden bg-white">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16 lg:py-24">
          <div
            className="relative min-h-[380px] overflow-hidden border border-[#182231]/10 lg:min-h-[620px]"
            data-reveal
          >
            <Image
              src="/LOGO.jpeg"
              alt="Aba Ceylon Tours landscape"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#182231]/74 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 border border-[#C99A2B]/40 bg-[#182231] px-4 py-2">
              <span className="font-cinzel text-[11px] uppercase tracking-[0.18em] text-white">
                Sri Lanka, planned from within
              </span>
            </div>
          </div>

          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#C99A2B]">
              Aba Ceylon Tours
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.1] text-[#182231] sm:text-5xl lg:text-[3.8rem]">
              We design journeys with a local eye and a quieter kind of luxury.
            </h2>
            <p
              className="mt-6 max-w-2xl text-base leading-8 text-[#182231]/68"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              We are a Sri Lanka-based travel company built around direct
              planning, thoughtful pacing, and routes shaped by real local
              knowledge rather than reseller templates. Every itinerary is
              crafted to feel more personal, more grounded, and easier to trust.
            </p>
            <p
              className="mt-4 max-w-2xl text-base leading-8 text-[#182231]/62"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              That means knowing when Sigiriya is worth the early start, which
              road to take when the coast gets busy, and where to stay if you
              care more about atmosphere than brand logos.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.label}
                  className="border border-[#182231]/10 bg-white px-5 py-5"
                >
                  <div className="mb-3 h-px w-8 bg-[#C99A2B]/70" />
                  <p className="font-cinzel text-lg text-[#182231]">{pillar.label}</p>
                  <p
                    className="mt-2 text-sm leading-6 text-[#182231]/62"
                    style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                  >
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/about" className="editorial-link text-[#C99A2B]">
                Our full story
              </Link>
              <Link
                href="/contact"
                className="font-cinzel text-[12px] uppercase tracking-[0.14em] text-[#182231]/72 transition-colors hover:text-[#182231]"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
