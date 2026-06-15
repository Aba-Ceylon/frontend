import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aba Ceylon Tours & Travels is a Sri Lanka-based travel company founded by a local who knows every road on the island.",
};

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";
const SWITZER = { fontFamily: "Switzer, system-ui, sans-serif" };

const VALUES = [
  {
    title: "Transparent planning",
    description:
      "You know who is planning the trip, what is included, and where the route is heading before you commit.",
  },
  {
    title: "Local route knowledge",
    description:
      "Every road, stop, and stay recommendation is grounded in on-the-ground familiarity with the island.",
  },
  {
    title: "One accountable team",
    description:
      "The same people who shape the itinerary remain reachable while the trip is actually happening.",
  },
  {
    title: "No pressure",
    description:
      "The goal is to build the right journey, not to force a fast booking decision.",
  },
];

const PROMISES = [
  "A tailored itinerary shaped around your pace and interests",
  "Clear advice on timing, routing, and what is worth the drive",
  "Direct communication from first enquiry to final departure",
  "Flexible adjustments when plans shift on the road",
];

export default function AboutPage() {
  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello, I'd like to learn more about Aba Ceylon and plan my Sri Lanka trip.",
  );

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        imageSrc="/beach.jpg"
        imageAlt="About Aba Ceylon Tours"
        eyebrow="Our story"
        title="A local team built around trust, taste, and practical care."
        subtitle="Aba Ceylon exists as a direct alternative to reseller-style itineraries, with routes, stays, and support handled by people who know the island firsthand."
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center lg:px-10">
          <div className="relative aspect-[4/5] overflow-hidden border border-[#182231]/10" data-reveal>
            <Image
              src="/Founder.png"
              alt="Founder of Aba Ceylon Tours and Travels"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070A]/68 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 border border-white/12 bg-[#182231] px-4 py-3 text-white">
              <p className="font-cinzel text-sm">Founder</p>
              <p className="mt-1 font-cinzel text-[11px] uppercase tracking-[0.16em] text-[#C99A2B]">
                Aba Ceylon
              </p>
            </div>
          </div>

          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#C99A2B]">
              The person behind your trip
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">
              Every itinerary is shaped with a local memory of the island.
            </h2>
            <div className="mt-6 space-y-5 text-[15px] leading-8 text-[#182231]/68" style={SWITZER}>
              <p>
                Aba Ceylon was built to offer a more thoughtful alternative to
                generic route selling. The focus is not volume. It is judgment,
                pacing, and direct local care.
              </p>
              <p>
                That means knowing which heritage site deserves the early start,
                which road is calmer in high season, and which stay suits the
                route even if it is less famous than the obvious hotel brand.
              </p>
              <p>
                When you contact the team, you are speaking to the people who
                actually shape the trip. That is a structural choice, not a line
                of marketing copy.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="border border-[#182231] bg-[#182231] px-6 py-3 font-cinzel text-xs uppercase tracking-[0.14em] text-white transition hover:bg-[#243142]"
              >
                Write to us directly
              </Link>
              <Link href="/planner" className="editorial-link text-[#182231]">
                Open the planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#182231]/10 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="mb-12 max-w-2xl" data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#C99A2B]">
              What we stand for
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">
              The way the company is built.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.title} className="border border-[#182231]/10 bg-white p-7" data-reveal>
                <div className="h-px w-10 bg-[#C99A2B]" />
                <h3 className="mt-5 font-cinzel text-xl text-[#182231]">{value.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#182231]/66" style={SWITZER}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#05070A] py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#C99A2B]">
              Our commitment
            </p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.08] text-white sm:text-5xl">
              What should always feel true on the road.
            </h2>
          </div>
          <div className="grid gap-4">
            {PROMISES.map((promise) => (
              <div key={promise} className="border border-white/10 px-6 py-5 text-white" data-reveal>
                <p className="font-cinzel text-lg text-[#C99A2B]">Aba Ceylon promise</p>
                <p className="mt-3 text-sm leading-7 text-white/74" style={SWITZER}>
                  {promise}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
