"use client";

import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  {
    label: "Local Routes",
    description: "Every road we recommend has been personally driven by our team.",
  },
  {
    label: "Direct Access",
    description: "You speak to the person building your trip — not a call centre.",
  },
  {
    label: "Zero Pressure",
    description: "We plan your journey for free. You decide when you're ready.",
  },
];

export default function WhoWeAre() {
  return (
    <section className="bg-[#0F172A] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 min-h-[620px]">

          {/* ── Left: Image ───────────────────────────────────────────── */}
          <div className="relative order-2 lg:order-1 min-h-[340px] lg:min-h-full">
            {/* Decorative amber border strip */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent z-10" />

            <Image
              src="/Who.png"
              alt="Aba Ceylon Tours — Sri Lanka heritage landscape with ancient rock fortress and lush greenery"
              fill
              className="object-cover"
              //sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Overlay gradient so text on right side stays readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0F172A]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent lg:hidden" />

            {/* Floating caption badge */}
            <div className="absolute bottom-6 left-8 z-10">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-[#0F172A]/80 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span
                  className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-amber-300/90"
                >
                  Sri Lanka &middot; Since Day One
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Content ────────────────────────────────────────── */}
          <div className="order-1 lg:order-2 flex flex-col justify-center gap-8 py-16 lg:py-20 lg:pl-16">

            {/* Label */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-amber-400/50" />
              <p className="font-cinzel text-[11px] uppercase tracking-[0.45em] text-amber-400/80">
                Aba Ceylon Tours
              </p>
            </div>

            {/* Heading */}
            <div>
              <h2 className="font-cinzel text-4xl sm:text-5xl text-white leading-[1.15]">
                Who We Are
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px w-12 bg-amber-400/40" />
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
                <div className="h-px w-4 bg-amber-400/20" />
              </div>
            </div>

            {/* Body */}
            <div
              className="flex flex-col gap-5 text-[15px] leading-8 text-white/65 max-w-lg"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              <p>
                We are a Sri Lanka&ndash;based travel company built on one idea — that the
                best way to experience this island is through someone who actually lives here.
                Not a booking platform. Not an overseas agency reselling packages. Us.
              </p>
              <p>
                Every itinerary we create is shaped by real local knowledge — the right time
                to arrive at Sigiriya before the crowds, the coastal road that no GPS
                recommends, the family guesthouse in Ella that changes how you see the hill
                country. We pair that knowledge with a completely personal service, from
                first message to final drop-off.
              </p>
              <p>
                We are small deliberately. Because when you are small, every traveller
                matters — and every trip gets the attention it deserves.
              </p>
            </div>

            {/* Pillars */}
            <div className="grid gap-4 sm:grid-cols-3">
              {PILLARS.map((p) => (
                <div
                  key={p.label}
                  className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/4 px-5 py-5"
                >
                  <div className="h-0.5 w-6 rounded-full bg-amber-400" />
                  <p className="font-cinzel text-sm text-white">{p.label}</p>
                  <p
                    className="text-xs leading-5 text-white/50"
                    style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                  >
                    {p.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.25em] text-amber-400 hover:text-amber-300 transition-colors"
              >
                Our Full Story
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <div className="h-4 w-px bg-white/15" />
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white/80 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
