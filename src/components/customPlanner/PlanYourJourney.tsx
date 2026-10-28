import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Map, Route, Send } from "lucide-react";
import { routes } from "@/constants/routes";

const steps = [
  { icon: Map, title: "Pick your places" },
  { icon: Route, title: "Set dates and pace" },
  { icon: Send, title: "Send it to us" },
];

export default function PlanYourJourney() {
  return (
    <section className="overflow-hidden bg-[#f6f0e6] py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)] lg:items-center lg:px-10">
        <div data-reveal>
          <h2 className="max-w-xl font-cinzel text-4xl leading-[1.08] text-[#182231] sm:text-5xl">
            Build your own route.
          </h2>
          <p className="mt-6 max-w-[48ch] text-base leading-8 text-[#182231]/68">
            Choose what you want to see. We turn it into a trip that works.
          </p>
          <Link href={routes.customizeJourneys} className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#182231] px-6 py-3 font-cinzel text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-[#283548]">
            Start planning <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative" data-reveal>
          <div className="relative aspect-[16/11] overflow-hidden">
            <Image src="/plannerBakcground.jpg" alt="A scenic Sri Lankan route for a custom journey" fill className="object-cover transition duration-700 hover:scale-[1.025]" sizes="(max-width: 1024px) 100vw, 55vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070A]/55 via-transparent to-transparent" />
          </div>
          <div className="relative -mt-12 ml-5 grid bg-white shadow-[0_24px_70px_rgba(24,34,49,0.12)] sm:ml-12 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-center gap-4 border-b border-[#182231]/10 p-5 last:border-b-0 sm:flex-col sm:items-start sm:border-b-0 sm:border-r sm:last:border-r-0">
                <Icon className="h-5 w-5 shrink-0 text-[#9b7422]" />
                <h3 className="font-cinzel text-base text-[#182231] sm:text-lg">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
