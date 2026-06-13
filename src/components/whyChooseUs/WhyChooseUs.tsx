"use client";

import Image from "next/image";
import Link from "next/link";

const REASONS = [
  {
    step: "01",
    title: "We Know Every Road",
    body: "Our routes aren't pulled from a database. Every road, every stop, and every shortcut has been personally driven by our team. We know which stretch of the A9 is best at dawn and which coastal road is worth the extra hour.",
  },
  {
    step: "02",
    title: "One Person, Start to Finish",
    body: "From the moment you message us to the moment we drop you at the airport, you deal with one person. No hand-offs, no surprises, no 'let me check with my colleague'. The person who plans your trip is the person you call.",
  },
  {
    step: "03",
    title: "Built Around You, Not a Brochure",
    body: "We don't have fixed packages you slot into. We start from your dates, your pace, your interests, and build outward. Want two days with nothing planned? Done. Want every hour filled? Also done.",
  },
  {
    step: "04",
    title: "Honest Advice, Always",
    body: "If a destination isn't worth visiting during your travel window, we'll tell you. If a stay isn't right for your group, we'll say so. We would rather lose a booking than send you somewhere disappointing.",
  },
  {
    step: "05",
    title: "Reachable When It Matters",
    body: "Things change on the road — weather, plans, energy levels. When they do, you have a real number to call. Not a helpdesk. Not a chatbot. The person who built your trip, available throughout.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F5F2ED] py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section label */}
        <div className="mb-14 flex items-center gap-3">
          <div className="h-px w-8 bg-amber-500/50" />
          <p className="font-cinzel text-[11px] uppercase tracking-[0.45em] text-amber-700/80">
            Why Choose Us
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">

          {/* ── Left: Roadmap ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-0">

            {/* Heading above the roadmap */}
            <div className="mb-10">
              <h2 className="font-cinzel text-4xl sm:text-5xl text-[#0F172A] leading-[1.15]">
                The Aba Ceylon<br className="hidden sm:block" /> Difference
              </h2>
              <p
                className="mt-4 max-w-md text-base leading-7 text-neutral-500"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                Five things that set us apart from every other Sri Lanka tour operator — and why they matter for your trip.
              </p>
            </div>

            {/* Roadmap items */}
            <div className="relative flex flex-col">

              {/* Vertical spine line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/80 via-amber-400/30 to-transparent" />

              {REASONS.map((r, i) => (
                <div key={r.step} className="relative flex gap-6 pb-10 last:pb-0">

                  {/* Node */}
                  <div className="relative flex flex-col items-center shrink-0">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-[#F5F2ED] z-10 shrink-0"
                      style={{ boxShadow: "0 0 0 4px #F5F2ED" }}
                    >
                      <span className="font-cinzel text-[11px] font-medium text-amber-600">
                        {r.step}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col gap-2 pt-1.5 ${i === REASONS.length - 1 ? "" : ""}`}>
                    <h3 className="font-cinzel text-lg text-[#0F172A]">
                      {r.title}
                    </h3>
                    <p
                      className="text-sm leading-7 text-neutral-500 max-w-md"
                      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                    >
                      {r.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA below roadmap */}
            <div className="mt-10 flex items-center gap-6">
              <Link
                href="/planner"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#0F172A] px-6 py-3.5 font-cinzel text-xs uppercase tracking-[0.22em] text-amber-400 transition hover:bg-[#1E2D44] active:scale-95"
              >
                Start Planning
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="font-cinzel text-xs uppercase tracking-[0.22em] text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* ── Right: Image ──────────────────────────────────────────── */}
          <div className="relative lg:sticky lg:top-24">

            {/* Main image */}
            <div className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden">
              <Image
                src="/images/heritage/sl-image.webp"
                alt="Aba Ceylon Tours — chauffeur and traveller on a scenic Sri Lanka road journey through lush landscape"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 via-transparent to-transparent" />

              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl border border-white/20 bg-[#0F172A]/80 px-6 py-5 backdrop-blur-md">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { value: "100%", label: "Personal Service" },
                      { value: "0", label: "Middlemen" },
                      { value: "24h", label: "Response Time" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="font-cinzel text-xl text-amber-400">{stat.value}</p>
                        <p
                          className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50"
                          style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                        >
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative offset block */}
            <div className="absolute -bottom-4 -right-4 h-48 w-48 rounded-[1.5rem] border border-amber-400/20 bg-amber-400/5 -z-10" />
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-2xl border border-amber-400/10 bg-amber-400/5 -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
