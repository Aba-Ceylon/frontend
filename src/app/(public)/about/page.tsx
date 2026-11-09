import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { SectionKicker, TeardropWatermark } from "@/components/ui/Teardrop";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aba Ceylon Tours & Travels is a Sri Lanka-based travel company founded by a local who knows every road on the island.",
  alternates: {
    canonical: "https://www.abaceylontours.com/about",
  },
};

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";
const SWITZER = { fontFamily: "Switzer, system-ui, sans-serif" };

const VALUES = [
  { title: "Local knowledge", description: "Every road and stay we suggest, we know first-hand." },
  { title: "One team", description: "The people who plan your trip are the ones you reach on the road." },
  { title: "Clear planning", description: "You see the route and what is included before you commit." },
  { title: "No pressure", description: "We help you get the right trip, not a fast booking." },
];

export default function AboutPage() {
  const waLink = generateWhatsAppLink(
    WHATSAPP_NUMBER,
    "Hello, I'd like to learn more about Aba Ceylon and plan my Sri Lanka trip.",
  );

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <PageHero
        imageSrc="/beach.jpg"
        imageAlt="About Aba Ceylon Tours"
        eyebrow="Our story"
        title="About Us"
        subtitle="A local team that plans, drives and stays with you, start to finish."
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center lg:gap-24 lg:px-10">
          <div className="relative mx-auto w-full max-w-[420px]" data-reveal>
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full border border-[#c99a2b]/50 sm:translate-x-6 sm:translate-y-6"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[#182231]">
            <Image
              src="/Founder.png"
              alt="Founder of Aba Ceylon Tours and Travels"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
            </div>
          </div>

          <div data-reveal>
            <SectionKicker>A word from the founder</SectionKicker>
            <h2 className="mt-5 font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">
              You speak to the person who knows the roads.
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-8 text-[#182231]/68" style={SWITZER}>
              Aba Ceylon exists because I wanted travelers to reach the real
              island through direct local guidance, not through a booking
              engine. When you write to us, you are speaking to the team that
              actually plans and runs the route.
            </p>
            <p className="mt-6 font-cinzel text-sm tracking-[0.06em] text-[#182231]">
              Founder, Aba Ceylon Tours &amp; Travels
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="border border-[#182231] bg-[#182231] px-7 py-3.5 font-cinzel text-xs uppercase tracking-[0.2em] text-white transition hover:border-[#9b7422] hover:bg-[#9b7422]"
              >
                Message us
              </Link>
              <Link href="/planner" className="editorial-link text-[#9b7422] hover:text-[#182231]">
                Open the planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--navy-deep)] py-20 text-white sm:py-28">
        <TeardropWatermark className="absolute -right-16 top-10 w-[320px] text-[#e2c27a]/[0.07] sm:w-[400px]" />
        <div className="relative mx-auto max-w-[1360px] px-6 lg:px-10">
          <div data-reveal>
            <SectionKicker tone="dark">Our values</SectionKicker>
            <h2 className="mt-5 font-cinzel text-4xl leading-[1.1] sm:text-5xl">
              What we stand for
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2" data-reveal-stagger>
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                className="card-lift relative overflow-hidden border border-white/10 bg-white/[0.03] p-8 hover:border-[#e2c27a]/40 sm:p-10"
                data-spotlight
              >
                <p className="font-cinzel text-sm tracking-[0.2em] text-[#e2c27a]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-cinzel text-2xl text-white">{value.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-white/70" style={SWITZER}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
