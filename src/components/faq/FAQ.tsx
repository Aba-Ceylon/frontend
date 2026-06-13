"use client";

import { useState } from "react";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  label: string;
  icon: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    label: "Booking",
    icon: "📋",
    items: [
      {
        q: "How do I book a tour with Aba Ceylon?",
        a: "It's straightforward — fill out our enquiry form, send us a WhatsApp message on +94 72 255 4488, or email abaceylon@gmail.com. Tell us your dates, group size, and the kind of trip you have in mind. We'll come back to you within a few hours with a personalised plan. No payment is taken until you confirm.",
      },
      {
        q: "Is there a booking fee or deposit required upfront?",
        a: "No booking fee, ever. We plan your itinerary for free with no obligation. A deposit is only requested once you've reviewed your plan and are happy to confirm. We'll walk you through the payment process clearly before anything is charged.",
      },
      {
        q: "How far in advance should I book?",
        a: "For peak season (December to April) we recommend booking at least 4–6 weeks ahead, especially if you have specific stays in mind. For quieter periods, 2 weeks is usually enough. That said — reach out whenever you're ready and we'll see what we can do.",
      },
    ],
  },
  {
    label: "The Experience",
    icon: "🌿",
    items: [
      {
        q: "What is included in the tour packages?",
        a: "Every package includes a private English-speaking chauffeur-driver, a comfortable air-conditioned vehicle, and a curated daily route. Accommodation and meals are either included or guided by us based on your preference — we'll make this clear in your personalised plan. Entrance fees to sites are not included unless specified.",
      },
      {
        q: "Can I customise my tour itinerary?",
        a: "Absolutely — and that's the point. Every itinerary we build starts from scratch based on what you want. You can slow it down, speed it up, add a wildlife day, drop a heritage site, or swap a resort stay for a boutique guesthouse. Tell us what matters and we build around it.",
      },
      {
        q: "Are the tours suitable for families with children?",
        a: "Very much so. We've taken families with toddlers, families with teenagers, and multi-generational groups across Sri Lanka. We adjust the pace, choose child-friendly stays, and recommend activities that work for mixed ages. Just let us know your group makeup and we plan accordingly.",
      },
      {
        q: "Do you offer solo traveller tours?",
        a: "Yes, and solo travellers are some of our most rewarding clients. You get complete flexibility over pace and decisions. Our drivers are experienced with solo travellers and understand when company is welcome and when space is needed. Safety and comfort are always our first consideration.",
      },
    ],
  },
  {
    label: "Sri Lanka",
    icon: "🗺️",
    items: [
      {
        q: "What is the best time of year to visit Sri Lanka?",
        a: "Sri Lanka has two monsoon seasons that affect different parts of the island. The southwest (Colombo, Galle, hill country) is best from December to April. The northeast (Trincomalee, Arugam Bay, Jaffna) peaks from May to September. The cultural triangle in the centre is good year-round. We'll always advise the right timing for your specific route.",
      },
      {
        q: "How many days do I need to see Sri Lanka properly?",
        a: "Ten to fourteen days gives you a well-rounded experience covering the highlights. Seven days is enough for a focused trip — one region done properly. If you have more time, we can take you into the quieter corners of the island that most visitors never reach. We'll match the itinerary to your available days.",
      },
      {
        q: "Is Sri Lanka safe to travel in?",
        a: "Sri Lanka is a safe and welcoming destination for international travellers. The island is known for its warm hospitality. Standard travel precautions apply as they do anywhere. We monitor local conditions and will proactively advise you of anything relevant to your travel dates.",
      },
    ],
  },
  {
    label: "Logistics",
    icon: "🚗",
    items: [
      {
        q: "Do your drivers speak English?",
        a: "Yes. All our drivers are English-speaking and experienced with international travellers. Beyond navigation, they act as local guides — sharing context about sites, recommending where to eat, and answering questions about Sri Lankan culture and history along the way.",
      },
      {
        q: "What type of vehicles do you use?",
        a: "We offer a range of vehicles from comfortable sedans for couples to spacious SUVs and vans for larger groups. All vehicles are air-conditioned, regularly maintained, and appropriate for Sri Lanka's road conditions including highland and rural routes. You can view our full fleet on the Fleet page.",
      },
      {
        q: "What happens if something changes during my trip?",
        a: "You have one direct number to call throughout your trip — the person who built your itinerary. If weather, health, or plans change on the road, we adjust. No helpdesk, no waiting. We've rerouted trips mid-journey more than once and that flexibility is something we're proud of.",
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-neutral-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-cinzel text-sm sm:text-base text-[#0F172A] leading-relaxed group-hover:text-amber-700 transition-colors">
          {item.q}
        </span>
        <span
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300"
          style={{
            background: isOpen ? "rgba(201,154,43,0.15)" : "rgba(15,23,42,0.05)",
            borderColor: isOpen ? "rgba(201,154,43,0.6)" : "rgba(15,23,42,0.15)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            color: isOpen ? "#92600a" : "#0F172A",
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p
          className="pb-5 text-sm leading-7 text-neutral-500 pr-10"
          style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello Aba Ceylon, I have a question about booking a tour.",
  );

  const currentItems = FAQ_CATEGORIES[activeCategory].items;

  return (
    <section className="bg-[#F5F2ED] py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* ── Top header ───────────────────────────────────────────────── */}
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-amber-400/50" />
              <p className="font-cinzel text-[11px] uppercase tracking-[0.45em] text-amber-700/80">
                Frequently Asked Questions
              </p>
            </div>
            <h2 className="font-cinzel text-4xl sm:text-5xl text-[#0F172A] leading-[1.15]">
              Do you have<br className="hidden sm:block" /> a question?
            </h2>
          </div>
          <p
            className="text-base leading-7 text-neutral-500 lg:text-right lg:max-w-sm lg:ml-auto"
            style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
          >
            Can&apos;t find the answer you&apos;re looking for? Write to us directly
            on WhatsApp and we&apos;ll get back to you within a few hours.
          </p>
        </div>

        {/* ── Category tabs ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FAQ_CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => { setActiveCategory(i); setOpenIndex(0); }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-cinzel text-xs uppercase tracking-[0.2em] transition-all duration-200"
              style={{
                background: activeCategory === i ? "rgba(201,154,43,0.15)" : "rgba(15,23,42,0.05)",
                border: activeCategory === i ? "1px solid rgba(201,154,43,0.6)" : "1px solid rgba(15,23,42,0.12)",
                color: activeCategory === i ? "#92600a" : "rgba(15,23,42,0.45)",
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:items-start">

          {/* Left: active category info + CTA */}
          <div className="lg:sticky lg:top-28 flex flex-col gap-8">
            <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-7 shadow-sm">
              <span className="text-3xl">{FAQ_CATEGORIES[activeCategory].icon}</span>
              <h3 className="font-cinzel text-xl text-[#0F172A] mt-4 mb-3">
                {FAQ_CATEGORIES[activeCategory].label}
              </h3>
              <p
                className="text-sm leading-7 text-neutral-500"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                {activeCategory === 0 && "Everything you need to know before making contact — payments, timing, and what to expect from the process."}
                {activeCategory === 1 && "What's included, how flexible it is, and whether it works for your group — answered honestly."}
                {activeCategory === 2 && "The practical side of Sri Lanka — when to go, how long you need, and what to expect on the ground."}
                {activeCategory === 3 && "Vehicles, drivers, language, and what happens when plans change mid-trip."}
              </p>
              <div className="mt-5 h-px w-full bg-neutral-100" />
              <p
                className="mt-5 text-xs text-neutral-400"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                {currentItems.length} questions in this section
              </p>
            </div>

            {/* Still have questions CTA */}
            <div className="rounded-[1.75rem] border border-amber-300/40 bg-amber-50 p-7">
              <p className="font-cinzel text-sm text-amber-700 mb-2">Still have a question?</p>
              <p
                className="text-sm leading-6 text-neutral-500 mb-5"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                We reply to every message within a few hours — WhatsApp, email, or the contact form.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25d366] px-5 py-3 font-cinzel text-xs uppercase tracking-[0.2em] text-white transition hover:brightness-110 active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-3 font-cinzel text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="rounded-[1.75rem] border border-neutral-200 bg-white px-7 py-2 shadow-sm">
            {currentItems.map((item, i) => (
              <AccordionItem
                key={`${activeCategory}-${i}`}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
