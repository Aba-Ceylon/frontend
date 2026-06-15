"use client";

import { useState } from "react";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  label: string;
  summary: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    label: "Booking",
    summary:
      "Payments, lead time, and what to expect before you confirm the trip.",
    items: [
      {
        q: "How do I book a tour with Aba Ceylon?",
        a: "Fill out the enquiry form, send a WhatsApp message, or email us with your dates, group size, and the kind of trip you want. We reply with a personalised plan before any payment is requested.",
      },
      {
        q: "Is there a booking fee or deposit required upfront?",
        a: "No booking fee is charged while your itinerary is being planned. A deposit is requested only once you review the plan and decide to confirm it.",
      },
      {
        q: "How far in advance should I book?",
        a: "For peak season, four to six weeks is a safe window if you want specific stays. Outside peak periods, two weeks is often workable, but it is still best to message as early as possible.",
      },
    ],
  },
  {
    label: "Experience",
    summary:
      "What is included, how flexible it is, and whether it works for your group.",
    items: [
      {
        q: "What is included in the tour packages?",
        a: "Core planning usually includes a private chauffeur-driver, vehicle coordination, and a curated route. Accommodation, meals, and entry fees depend on the plan you confirm, and we make that explicit before booking.",
      },
      {
        q: "Can I customise my tour itinerary?",
        a: "Yes. The whole point is to shape the route around your pace, interests, and travel window rather than asking you to fit into a fixed package.",
      },
      {
        q: "Are the tours suitable for families with children?",
        a: "Yes. We adjust pacing, stay selection, and activity balance for families, including mixed-age groups and longer rest windows when needed.",
      },
      {
        q: "Do you offer solo traveller tours?",
        a: "Yes. Solo travellers often value the direct local support, flexible pacing, and reliable point of contact throughout the journey.",
      },
    ],
  },
  {
    label: "Sri Lanka",
    summary:
      "Seasonality, timing, and practical advice on seeing the island well.",
    items: [
      {
        q: "What is the best time of year to visit Sri Lanka?",
        a: "It depends on the route. The southwest and hill country are generally strongest from December to April, while the northeast is strongest from May to September. We advise based on the exact route you want, not a generic island-wide answer.",
      },
      {
        q: "How many days do I need to see Sri Lanka properly?",
        a: "Ten to fourteen days gives enough room for a well-paced route. Seven days works for a more focused journey with fewer regions done properly.",
      },
      {
        q: "Is Sri Lanka safe to travel in?",
        a: "Sri Lanka is a welcoming destination for international travellers. We still advise normal travel awareness and we keep an eye on practical local conditions during your travel window.",
      },
    ],
  },
  {
    label: "Logistics",
    summary:
      "Vehicles, English-speaking drivers, and what happens when plans change.",
    items: [
      {
        q: "Do your drivers speak English?",
        a: "Yes. Drivers are experienced with international travellers and help with both logistics and practical local guidance on the road.",
      },
      {
        q: "What type of vehicles do you use?",
        a: "We match the vehicle to the route and group size, from sedans for couples to larger vans and SUVs for families and groups.",
      },
      {
        q: "What happens if something changes during my trip?",
        a: "You have one direct contact throughout the journey. If weather, energy levels, or timing changes, we adjust the route directly instead of handing you to a help desk.",
      },
    ],
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#182231]/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-cinzel text-sm leading-relaxed text-[#182231] transition-colors group-hover:text-[#C99A2B] sm:text-base">
          {item.q}
        </span>
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border transition-all duration-300 ${
            isOpen
              ? "border-[#C99A2B] bg-[#C99A2B]/12 text-[#182231]"
              : "border-[#182231]/14 bg-white text-[#182231]"
          }`}
        >
          <svg
            className={`h-3 w-3 transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p
          className="pb-5 pr-10 text-sm leading-7 text-[#182231]/66"
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

  const currentCategory = FAQ_CATEGORIES[activeCategory];

  return (
    <section className="bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#C99A2B]">
              Frequently asked questions
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl lg:text-[3.3rem]">
              Clear answers before the trip begins.
            </h2>
          </div>
          <p
            className="text-base leading-8 text-[#182231]/66"
            style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            data-reveal
          >
            The aim is to reduce uncertainty, not decorate it. If your question
            is not covered here, message the team directly.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2" data-reveal>
          {FAQ_CATEGORIES.map((category, index) => (
            <button
              key={category.label}
              type="button"
              onClick={() => {
                setActiveCategory(index);
                setOpenIndex(0);
              }}
              className={`border px-5 py-3 font-cinzel text-xs uppercase tracking-[0.14em] transition-colors ${
                activeCategory === index
                  ? "border-[#182231] bg-[#182231] text-white"
                  : "border-[#182231]/12 bg-white text-[#182231]/72 hover:border-[#C99A2B] hover:text-[#182231]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6 lg:sticky lg:top-28" data-reveal>
            <div className="border border-[#182231]/10 bg-white p-7">
              <p className="font-cinzel text-sm uppercase tracking-[0.14em] text-[#C99A2B]">
                {currentCategory.label}
              </p>
              <p
                className="mt-4 text-sm leading-7 text-[#182231]/66"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                {currentCategory.summary}
              </p>
              <div className="mt-6 border-t border-[#182231]/10 pt-5">
                <p
                  className="text-xs uppercase tracking-[0.14em] text-[#182231]/48"
                  style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                >
                  {currentCategory.items.length} questions in this section
                </p>
              </div>
            </div>

            <div className="border border-[#182231] bg-[#182231] p-7 text-white">
              <p className="font-cinzel text-sm uppercase tracking-[0.14em] text-[#C99A2B]">
                Still need help?
              </p>
              <p
                className="mt-4 text-sm leading-7 text-white/72"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                Contact the team directly if you want a fast answer about dates,
                route pacing, stays, or transport.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#C99A2B] bg-[#C99A2B] px-5 py-3 text-center font-cinzel text-xs uppercase tracking-[0.14em] text-[#182231] transition hover:brightness-105"
                >
                  WhatsApp us
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/12 px-5 py-3 text-center font-cinzel text-xs uppercase tracking-[0.14em] text-white transition hover:border-[#C99A2B] hover:text-[#C99A2B]"
                >
                  Contact form
                </Link>
              </div>
            </div>
          </div>

          <div className="border border-[#182231]/10 bg-white px-7 py-2" data-reveal>
            {currentCategory.items.map((item, index) => (
              <AccordionItem
                key={`${currentCategory.label}-${index}`}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
