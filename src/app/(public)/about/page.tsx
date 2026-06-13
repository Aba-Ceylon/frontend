import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aba Ceylon Tours & Travels is a Sri Lanka-based travel company founded by a local who knows every road on the island. Learn our story, our values, and the person behind your journey.",
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";
const SWITZER = { fontFamily: "Switzer, system-ui, sans-serif" };

const VALUES = [
  {
    title: "Radical Transparency",
    description:
      "You know exactly who you're speaking to, what's included, and what things cost before you commit to anything.",
  },
  {
    title: "Local Knowledge, Not Google Maps",
    description:
      "Every route we recommend has been driven. Every stay we suggest has been visited. We don't sell what we haven't seen.",
  },
  {
    title: "One Point of Contact",
    description:
      "No hand-offs to third parties. The person who plans your trip is reachable on WhatsApp from arrival to departure.",
  },
  {
    title: "No Pressure, Ever",
    description:
      "We send you a plan for free. You decide if it feels right. We'd rather you travel with someone else than have a bad experience with us.",
  },
];

const PROMISES = [
  "Free itinerary within a few hours of your first message",
  "No payment taken until you confirm the plan",
  "English-speaking drivers on every journey",
  "Direct WhatsApp access throughout your trip",
  "Full flexibility to change plans on the road",
  "Honest advice — including when not to visit somewhere",
];

export default function AboutPage() {
  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello, I'd like to learn more about Aba Ceylon and plan my Sri Lanka trip.",
  );

  return (
    <main className="bg-[#F5F2ED] min-h-screen">

      {/* Hero */}
      <section className="relative bg-[#0F172A] pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/images/heritage/Hero1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/20 to-[#0F172A]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
          <p className="font-cinzel text-[11px] uppercase tracking-[0.4em] text-amber-400/70 mb-5">
            Our Story
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            A local guide who<br className="hidden sm:block" /> became a travel company
          </h1>
          <p
            className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-white/70"
            style={SWITZER}
          >
            Aba Ceylon was built on a simple frustration — watching visitors
            overpay middlemen for routes we know by heart. We started small,
            deliberately, because trust is built one trip at a time.
          </p>
        </div>
      </section>

      {/* Founder section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Photo */}
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto lg:mx-0 rounded-[2rem] overflow-hidden bg-slate-200">
              <Image
                src="/Founder.png"
                alt="Founder of Aba Ceylon Tours & Travels"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-cinzel text-white text-lg">Founder</p>
                <p className="font-cinzel text-amber-400 text-sm tracking-widest uppercase mt-1">
                  Aba Ceylon Tours &amp; Travels
                </p>
              </div>
            </div>

            {/* Story */}
            <div className="flex flex-col gap-6">
              <p className="font-cinzel text-[11px] uppercase tracking-[0.4em] text-amber-700/80">
                The Person Behind Your Trip
              </p>
              <h2 className="font-cinzel text-3xl sm:text-4xl text-[#0F172A] leading-snug">
                Every itinerary I build,<br className="hidden sm:block" /> I&apos;ve driven myself
              </h2>

              <div className="flex flex-col gap-5 text-neutral-600 text-[15px] leading-8" style={SWITZER}>
                <p>
                  I grew up watching tourists arrive in Sri Lanka full of excitement and
                  leave feeling like they missed the real island — because the routes they
                  were sold were designed for volume, not experience.
                </p>
                <p>
                  Aba Ceylon was my answer to that. A small, personal operation where every
                  traveller gets a plan built around what they actually want, by someone who
                  knows the roads, the guesthouses, the best time to reach Sigiriya before
                  the crowds, and the small village restaurant that no itinerary ever mentions.
                </p>
                <p>
                  When you send us a message, it comes to me. When you arrive at the airport,
                  our driver knows your name. When something changes mid-trip, you have one
                  number to call. That&apos;s not a marketing promise — it&apos;s just how
                  we&apos;re built.
                </p>
              </div>

              <Link
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="self-start inline-flex items-center gap-3 rounded-full bg-[#25d366] px-6 py-3.5 font-cinzel text-xs uppercase tracking-[0.2em] text-white transition hover:brightness-110 active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Write to me directly
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 max-w-xl">
            <p className="font-cinzel text-[11px] uppercase tracking-[0.4em] text-amber-700/80 mb-4">
              What We Stand For
            </p>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#0F172A] leading-snug">
              The way we work
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-neutral-100 bg-[#F5F2ED] px-7 py-8"
              >
                <div className="h-1 w-8 rounded-full bg-amber-400" />
                <h3 className="font-cinzel text-lg text-[#0F172A]">{v.title}</h3>
                <p className="text-sm leading-7 text-neutral-500" style={SWITZER}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our promises */}
      <section className="bg-[#0F172A] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.4em] text-amber-400/70 mb-4">
                Our Commitment
              </p>
              <h2 className="font-cinzel text-3xl sm:text-4xl text-white leading-snug">
                What you can always<br className="hidden sm:block" /> expect from us
              </h2>
              <p className="mt-5 text-base leading-8 text-white/60" style={SWITZER}>
                These aren&apos;t policies written by a legal team. They&apos;re the
                standards we hold ourselves to on every single trip.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {PROMISES.map((promise) => (
                <li
                  key={promise}
                  className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/4 px-6 py-4"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm leading-7 text-white/80" style={SWITZER}>
                    {promise}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5F2ED] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-cinzel text-3xl sm:text-4xl text-[#0F172A] leading-snug">
            Ready to plan your trip?
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-600" style={SWITZER}>
            Send us your dates and we&apos;ll have a personalised itinerary ready
            for you within a few hours — free, no obligation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#25d366] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.2em] text-white transition hover:brightness-110 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message Us on WhatsApp
            </Link>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.2em] text-neutral-700 hover:text-amber-700 transition-colors"
            >
              Or use the trip planner
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
