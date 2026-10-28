import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, Hotel, MapPinned, MessageCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { routes } from "@/constants/routes";

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
    <main className="min-h-screen bg-white">
      <PageHero
        imageSrc="/plannerBakcground.jpg"
        imageAlt="A scenic road through Sri Lanka"
        title="Your route, your way."
        subtitle="Five steps. Our local team does the rest."
        height="h-[100dvh] min-h-[600px]"
      >
        <Link
          href={routes.planner}
          className="inline-flex min-h-12 items-center gap-3 border border-white/70 px-8 py-3 font-cinzel text-xs uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:bg-white hover:text-[#182231]"
        >
          Open the planner <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <section className="bg-[#f6f0e6] py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <h2 className="max-w-2xl font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl" data-reveal>
            How it works
          </h2>
          <ol className="mt-12 grid gap-px bg-[#182231]/10 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(({ icon: Icon, title, text }) => (
              <li key={title} className="bg-[#f6f0e6] p-6 lg:py-8" data-reveal>
                <Icon className="h-6 w-6 text-[#9b7422]" />
                <h3 className="mt-6 font-cinzel text-xl text-[#182231]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#182231]/66">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#182231] px-6 py-20 text-white sm:py-24 lg:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-center" data-reveal>
          <h2 className="max-w-2xl font-cinzel text-4xl leading-[1.08] sm:text-5xl">Start with your dates.</h2>
          <Link href={routes.planner} className="inline-flex min-h-14 shrink-0 items-center gap-3 bg-[#C99A2B] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.2em] text-[#182231] transition hover:bg-[#ddb044]">
            Open the planner <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
