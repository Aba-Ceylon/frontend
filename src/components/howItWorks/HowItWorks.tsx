"use client";

import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

const STEPS = [
  {
    number: "01",
    title: "Share Your Idea",
    description:
      "Tell us your travel dates, group size, and what kind of experience you're after — heritage, hills, coast, or all three. A WhatsApp message or a quick note is all it takes. No forms, no commitment.",
    cta: { label: "Message Us on WhatsApp", href: "whatsapp" },
  },
  {
    number: "02",
    title: "We Build Your Plan",
    description:
      "Within a few hours we send you a personalised itinerary — route, stays, vehicle, and daily outline — built around your pace and budget. Completely free, with no obligation to book.",
    cta: null,
  },
  {
    number: "03",
    title: "You Travel, We Handle Everything",
    description:
      "Once you confirm, we lock every detail. Your driver meets you on arrival. We stay reachable throughout your trip — one number, one team, zero middlemen.",
    cta: { label: "Start Planning", href: "/planner" },
  },
];

export default function HowItWorks() {
  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello Aba Ceylon, I would like to start planning my Sri Lanka trip.",
  );

  return (
    <section className="bg-[#F5F2ED] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="font-cinzel text-[11px] uppercase tracking-[0.4em] text-amber-700/80 mb-4">
            How It Works
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl text-[#0F172A] leading-snug">
            From first message to<br className="hidden sm:block" /> first day on the road
          </h2>
          <p
            className="mt-4 text-base leading-7 text-neutral-600"
            style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
          >
            No call centres, no booking portals. You talk directly to the person
            who builds and drives your itinerary.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-3 gap-px bg-neutral-200 rounded-[2rem] overflow-hidden">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative flex flex-col gap-5 px-8 py-10 ${
                i % 2 === 0 ? "bg-white" : "bg-[#F5F2ED]"
              }`}
            >
              <span className="font-cinzel text-5xl font-medium text-amber-400/25 leading-none select-none">
                {step.number}
              </span>

              <div className="flex flex-col gap-3 flex-1">
                <h3 className="font-cinzel text-xl text-[#0F172A]">{step.title}</h3>
                <p
                  className="text-sm leading-7 text-neutral-600 flex-1"
                  style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                >
                  {step.description}
                </p>
              </div>

              {step.cta && (
                <Link
                  href={step.cta.href === "whatsapp" ? waLink : step.cta.href}
                  target={step.cta.href === "whatsapp" ? "_blank" : undefined}
                  rel={step.cta.href === "whatsapp" ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.2em] text-amber-700 hover:text-amber-900 transition-colors"
                >
                  {step.cta.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Bottom reassurances */}
        <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-10">
          {[
            "No payment until you confirm",
            "Free itinerary within a few hours",
            "One direct contact throughout",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span
                className="text-sm text-neutral-500"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
