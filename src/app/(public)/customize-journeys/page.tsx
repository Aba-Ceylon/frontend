import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, Hotel, MapPinned, MessageCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { routes } from "@/constants/routes";
import { SectionKicker, TeardropWatermark } from "@/components/ui/Teardrop";

export const metadata: Metadata = {
  title: "Customize Journeys",
  description: "Learn how to build a personalized Sri Lanka itinerary, then use the Aba Ceylon Custom Journey Planner.",
};

const steps = [
  { icon: CalendarDays, title: "Set your dates", text: "Travel dates, group size and pace." },
  { icon: MapPinned, title: "Pick your places", text: "Choose destinations on the map." },
  { icon: Hotel, title: "Choose your stays", text: "Pick them yourself or let us suggest." },
  { icon: CarFront, title: "Match a vehicle", text: "Sized for your group and luggage." },
  { icon: MessageCircle, title: "Send it to us", text: "We reply on WhatsApp with your route." },
];

export default function CustomizeJourneysPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        imageSrc="/plannerBakcground.jpg"
        imageAlt="A scenic road through Sri Lanka"
        eyebrow="Tailor-made"
        title="Your route, your way."
        subtitle="Five steps. Our local team does the rest."
        height="h-[100dvh] min-h-[600px]"
      >
        <Link
          href={routes.planner}
          className="nudge-arrow inline-flex min-h-12 items-center gap-3 border border-white/70 px-8 py-3 font-cinzel text-xs uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:bg-white hover:text-[#182231]"
        >
          Open the planner <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <section className="bg-[var(--ivory)] py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div data-reveal>
            <SectionKicker>The planner</SectionKicker>
            <h2 className="mt-5 max-w-2xl font-cinzel text-4xl leading-[1.1] text-[#182231] sm:text-5xl">
              How it works
            </h2>
          </div>
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5" data-reveal-stagger>
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                className="card-lift group relative flex flex-col overflow-hidden border border-[#182231]/10 bg-white p-7 hover:border-[#c99a2b]/50"
                data-spotlight
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ivory)] text-[#9b7422] transition-colors duration-300 group-hover:bg-[#182231] group-hover:text-[#e2c27a]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-cinzel text-3xl text-[#182231]/12">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 font-cinzel text-xl text-[#182231]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#182231]/66">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--navy-deep)] px-6 py-20 text-white sm:py-28 lg:px-10">
        <TeardropWatermark className="absolute -left-16 -top-10 w-[300px] text-[#e2c27a]/[0.07]" />
        <div className="relative mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end" data-reveal>
          <div>
            <SectionKicker tone="dark">Ready when you are</SectionKicker>
            <h2 className="mt-5 max-w-2xl font-cinzel text-4xl leading-[1.1] sm:text-6xl">Start with your dates.</h2>
          </div>
          <Link href={routes.planner} className="nudge-arrow inline-flex min-h-14 shrink-0 items-center gap-3 bg-[#e2c27a] px-8 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-[#0d141e] transition hover:bg-white">
            Open the planner <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
