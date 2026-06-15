"use client";

import Link from "next/link";
import Image from "next/image";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

const PROMISES = [
  "Reply within a few hours, often much faster on WhatsApp.",
  "No payment upfront while your route is being designed.",
  "One direct contact before arrival and throughout the journey.",
  "Routes shaped by on-the-ground local knowledge, not generic booking flows.",
];

export default function TrustBar() {
  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello, I would like to enquire about planning my Sri Lanka trip with Aba Ceylon.",
  );

  return (
    <section className="section-wash bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div
            className="grid gap-6 border border-[#182231]/10 bg-white p-6 shadow-[0_18px_44px_rgba(17,24,39,0.04)] sm:p-8 lg:grid-cols-[120px_minmax(0,1fr)] lg:p-10"
            data-reveal
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#182231]/10 bg-[#182231] sm:aspect-[5/4] lg:h-full lg:min-h-[220px] lg:aspect-auto">
              <Image
                src="/Founder.png"
                alt="Founder of Aba Ceylon Tours"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 120px"
              />
            </div>

            <div className="min-w-0">
              <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#C99A2B]">
                A word from the founder
              </p>
              <h2 className="mt-3 font-cinzel text-3xl leading-tight text-[#182231] sm:text-4xl">
                You speak to the person who knows the roads.
              </h2>
              <p
                className="mt-4 max-w-2xl text-base leading-8 text-[#182231]/68"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                Aba Ceylon exists because I wanted travelers to reach the real
                island through direct local guidance, not through a booking
                engine. When you write to us, you are speaking to the team that
                actually plans and runs the route.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-cinzel text-sm tracking-[0.08em] text-[#182231]">
                  Founder, Aba Ceylon Tours &amp; Travels
                </p>
                <Link
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center border border-[#182231] bg-[#182231] px-5 py-3 font-cinzel text-[11px] uppercase tracking-[0.18em] text-white transition hover:bg-[#243142]"
                >
                  Let&apos;s talk on WhatsApp
                </Link>
              </div>
            </div>
          </div>

          <div
            className="border border-[#182231]/10 bg-[#182231] p-6 text-white sm:p-8 lg:p-10"
            data-reveal
          >
            <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#C99A2B]">
              Why travelers trust us
            </p>
            <div className="mt-6 space-y-5">
              {PROMISES.map((promise) => (
                <div
                  key={promise}
                  className="border border-white/10 px-5 py-5"
                >
                  <div className="mb-3 h-px w-10 bg-[#C99A2B]/70" />
                  <p
                    className="text-sm leading-7 text-white/74"
                    style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                  >
                    {promise}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
