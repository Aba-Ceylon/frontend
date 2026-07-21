import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, Check, Hotel, MapPinned, MessageCircle } from "lucide-react";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Customize Journeys",
  description: "Learn how to build a personalized Sri Lanka itinerary, then use the Aba Ceylon Custom Journey Planner.",
};

const steps = [
  { number: "01", icon: CalendarDays, title: "Set the trip basics", text: "Tell us your travel dates, group size, preferred pace, and the kind of experience you have in mind." },
  { number: "02", icon: MapPinned, title: "Build your route", text: "Choose destinations from the interactive map. Mix heritage, wildlife, hill country, and coast in your own way." },
  { number: "03", icon: Hotel, title: "Choose how you stay", text: "Select accommodation yourself or ask Aba Ceylon to recommend stays that suit your route and budget." },
  { number: "04", icon: CarFront, title: "Match your vehicle", text: "Choose a chauffeur-driven vehicle based on group size, luggage, comfort, and the roads on your itinerary." },
  { number: "05", icon: MessageCircle, title: "Review and send", text: "Check the complete summary, then send the pre-filled request to our local team through WhatsApp." },
];

const prepare = ["Approximate arrival and departure dates", "Number of adults and children", "Places or experiences you do not want to miss", "Preferred accommodation style", "Comfort level and transport needs"];

export default function CustomizeJourneysPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative flex min-h-[calc(100svh-0px)] items-end overflow-hidden bg-[#05070A] px-6 pb-14 pt-36 text-white sm:pb-20 lg:px-10">
        <Image src="/plannerBakcground.jpg" alt="A scenic road through Sri Lanka" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.92)_0%,rgba(5,7,10,0.58)_52%,rgba(5,7,10,0.18)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1360px]" data-reveal>
          <p className="font-cinzel text-[11px] uppercase tracking-[0.28em] text-[#e2b84f]">Aba Ceylon · Custom Journey Planner</p>
          <h1 className="mt-5 max-w-4xl font-cinzel text-5xl leading-[0.98] sm:text-7xl lg:text-[6.5rem]">Build a Sri Lanka journey that feels like yours.</h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/76 sm:text-lg">Follow five simple steps to shape your route. You stay in control; our local team turns your choices into a workable tour.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={routes.planner} className="inline-flex min-h-13 items-center gap-3 bg-[#C99A2B] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.2em] text-[#182231] transition hover:bg-[#ddb044]">Open the planner <ArrowRight className="h-4 w-4" /></Link>
            <a href="#how-it-works" className="inline-flex min-h-13 items-center border border-white/32 px-7 py-4 font-cinzel text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#182231]">See the steps</a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 bg-[#f6f0e6] py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="grid gap-8 border-b border-[#182231]/12 pb-12 lg:grid-cols-[0.7fr_1fr]" data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#9b7422]">How it works</p>
            <h2 className="font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">From a rough idea to one clear tour request.</h2>
          </div>
          <div className="divide-y divide-[#182231]/12">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <div key={number} className="group grid gap-5 py-9 sm:grid-cols-[80px_64px_0.7fr_1fr] sm:items-center" data-reveal>
                <span className="font-cinzel text-sm tracking-[0.18em] text-[#9b7422]">{number}</span>
                <Icon className="h-7 w-7 text-[#182231] transition-transform duration-300 group-hover:translate-x-1" />
                <h3 className="font-cinzel text-2xl text-[#182231]">{title}</h3>
                <p className="max-w-xl text-sm leading-7 text-[#182231]/66">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10">
          <div className="relative aspect-[4/3] overflow-hidden" data-reveal><Image src="/planner.png" alt="Aba Ceylon custom journey planning experience" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" /></div>
          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#9b7422]">Before you begin</p>
            <h2 className="mt-4 font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">A few ideas are enough to get started.</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#182231]/68">You do not need a finished itinerary. Bring what you know, skip what you do not, and our team can help refine the rest.</p>
            <ul className="mt-8 divide-y divide-[#182231]/10 border-y border-[#182231]/10">
              {prepare.map((item) => <li key={item} className="flex items-center gap-4 py-4 text-sm text-[#182231]/78"><Check className="h-4 w-4 shrink-0 text-[#9b7422]" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#182231] px-6 py-20 text-white sm:py-24 lg:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end" data-reveal>
          <div><p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#C99A2B]">Ready when you are</p><h2 className="mt-4 max-w-2xl font-cinzel text-4xl leading-[1.08] sm:text-5xl">Start with your dates. We will help with the road between them.</h2></div>
          <Link href={routes.planner} className="inline-flex min-h-14 shrink-0 items-center gap-3 bg-[#C99A2B] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.2em] text-[#182231] transition hover:bg-[#ddb044]">Start customizing <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
