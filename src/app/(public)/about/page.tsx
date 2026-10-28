import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
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
    <main className="min-h-screen bg-white">
      <PageHero
        imageSrc="/beach.jpg"
        imageAlt="About Aba Ceylon Tours"
        title="About Us"
        subtitle="A local team, start to finish"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-center lg:gap-20 lg:px-10">
          <div className="relative aspect-[4/5] overflow-hidden" data-reveal>
            <Image
              src="/Founder.png"
              alt="Founder of Aba Ceylon Tours and Travels"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 400px"
            />
          </div>

          <div data-reveal>
            <h2 className="font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">
              Planned by someone who knows the roads.
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-8 text-[#182231]/68" style={SWITZER}>
              Aba Ceylon was started to give travellers a direct line to local
              knowledge. When you write to us, you speak to the people who plan
              and run your trip.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="border border-[#182231] bg-[#182231] px-6 py-3 font-cinzel text-xs uppercase tracking-[0.14em] text-white transition hover:bg-[#243142]"
              >
                Message us
              </Link>
              <Link href="/planner" className="editorial-link text-[#182231]">
                Open the planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#182231] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <h2 className="font-cinzel text-4xl leading-[1.08] sm:text-5xl" data-reveal>
            What we stand for
          </h2>
          <div className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="border-t border-white/15 pt-6" data-reveal>
                <h3 className="font-cinzel text-xl text-[#e2c27a]">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72" style={SWITZER}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
