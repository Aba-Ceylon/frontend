"use client";

import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

const STEPS = [
  {
    number: "01",
    title: "Share your idea",
    description:
      "Send your dates, group size, and preferred pace. Heritage, hill country, safari, coast, or a balance of all four.",
    cta: { label: "Message us on WhatsApp", href: "whatsapp" },
  },
  {
    number: "02",
    title: "We shape the route",
    description:
      "We build the itinerary, recommend stays, align the vehicle, and refine the rhythm of the trip around how you actually want to travel.",
    cta: null,
  },
  {
    number: "03",
    title: "You travel with support",
    description:
      "Once confirmed, your journey runs with one direct local contact and the flexibility to adjust details while you are already on the road.",
    cta: { label: "Use the trip planner", href: "/planner" },
  },
];

export default function HowItWorks() {
  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello Aba Ceylon, I would like to start planning my Sri Lanka trip.",
  );

  return (
    <section className="cream-grid py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#C99A2B]">
              How it works
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-tight text-[#182231] sm:text-5xl lg:text-[3.5rem]">
              Built like a private travel conversation, not a checkout flow.
            </h2>
            <p
              className="mt-5 max-w-xl text-base leading-8 text-[#182231]/66"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              The process is designed to feel personal from the first message,
              with the same team shaping the route, recommending the stays, and
              supporting you once the journey begins.
            </p>
          </div>

          <div className="space-y-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="luxury-card grid gap-5 border border-[#182231]/10 p-6 sm:grid-cols-[92px_minmax(0,1fr)] sm:p-8"
                data-reveal
              >
                <div>
                  <span className="font-cinzel text-5xl text-[#C99A2B]/45">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-cinzel text-2xl text-[#182231]">
                    {step.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-7 text-[#182231]/66"
                    style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                  >
                    {step.description}
                  </p>
                  {step.cta ? (
                    <Link
                      href={step.cta.href === "whatsapp" ? waLink : step.cta.href}
                      target={step.cta.href === "whatsapp" ? "_blank" : undefined}
                      rel={step.cta.href === "whatsapp" ? "noreferrer" : undefined}
                      className="editorial-link mt-5 text-[#182231]"
                    >
                      {step.cta.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
