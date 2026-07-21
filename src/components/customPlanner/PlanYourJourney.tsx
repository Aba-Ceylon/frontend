import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Map, Route, Send } from "lucide-react";
import { routes } from "@/constants/routes";

const steps = [
  { icon: Map, number: "01", title: "Choose your places", text: "Pick the Sri Lankan destinations and experiences that matter to you." },
  { icon: Route, number: "02", title: "Set your travel style", text: "Add dates, pace, accommodation preferences, and the right vehicle." },
  { icon: Send, number: "03", title: "Send it to our team", text: "Review your route and share one clear request with our local planners." },
];

export default function PlanYourJourney() {
  return (
    <section className="overflow-hidden bg-[#f6f0e6] py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)] lg:items-center lg:px-10">
        <div data-reveal>
          <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#9b7422]">Plan your journey</p>
          <h2 className="mt-4 max-w-xl font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl lg:text-6xl">
            Your island route, built around the way you travel.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#182231]/68">
            Start with your ideas—not a fixed itinerary. Our guided planner helps you turn them into a practical request for the Aba Ceylon team.
          </p>
          <Link href={routes.customizeJourneys} className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#182231] px-6 py-3 font-cinzel text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-[#283548]">
            Learn how to customize <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative" data-reveal>
          <div className="relative aspect-[16/11] overflow-hidden">
            <Image src="/plannerBakcground.jpg" alt="A scenic Sri Lankan route for a custom journey" fill className="object-cover transition duration-700 hover:scale-[1.025]" sizes="(max-width: 1024px) 100vw, 55vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070A]/55 via-transparent to-transparent" />
          </div>
          <div className="relative -mt-12 ml-5 grid bg-white shadow-[0_24px_70px_rgba(24,34,49,0.12)] sm:ml-12 sm:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, text }) => (
              <div key={number} className="group border-b border-[#182231]/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <div className="flex items-center justify-between text-[#9b7422]"><Icon className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" /><span className="font-cinzel text-[10px] tracking-[0.18em]">{number}</span></div>
                <h3 className="mt-5 font-cinzel text-lg text-[#182231]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#182231]/62">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
