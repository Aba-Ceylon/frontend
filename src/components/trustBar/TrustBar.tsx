"use client";

import Link from "next/link";
import Image from "next/image";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

const PROMISES = [
  {
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    label: "Reply within 4 hours",
    sub: "WhatsApp or email, every day",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "No payment upfront",
    sub: "Pay only when you confirm",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Zero middlemen",
    sub: "You talk to us, not a call centre",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: "Built by a local",
    sub: "Every route personally known",
  },
];

export default function TrustBar() {
  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello, I would like to enquire about planning my Sri Lanka trip with Aba Ceylon.",
  );

  return (
    <section className="bg-[#0F172A] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Founder strip */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-[1.75rem] border border-white/8 bg-white/4 px-7 py-7 sm:px-10 sm:py-8">
          {/* Avatar */}
          <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-amber-400/40 bg-slate-700">
            <Image
              src="/abaceylon avatar.jpeg"
              alt="Founder of Aba Ceylon Tours"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-400/70 mb-2">
              A word from the founder
            </p>
            <p
              className="text-sm sm:text-base leading-7 text-white/80 max-w-2xl"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              &ldquo;I started Aba Ceylon because I know every road on this island personally.
              When you message us, you&rsquo;re writing directly to me — not a booking engine.
              Your trip is planned by someone who has been there.&rdquo;
            </p>
            <p className="mt-2 font-cinzel text-sm text-amber-300/80">
              Founder &mdash; Aba Ceylon Tours &amp; Travels
            </p>
          </div>

          {/* CTA */}
          <Link
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 rounded-full bg-[#25d366] px-5 py-3 font-cinzel text-xs uppercase tracking-[0.2em] text-white transition hover:brightness-110 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Let&apos;s Talk
          </Link>
        </div>

        {/* Promise pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PROMISES.map((p) => (
            <div
              key={p.label}
              className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/4 px-5 py-5"
            >
              {p.icon}
              <div>
                <p className="font-cinzel text-sm text-white">{p.label}</p>
                <p
                  className="mt-1 text-xs text-white/50"
                  style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
                >
                  {p.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
