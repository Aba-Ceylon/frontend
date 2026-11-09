import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { routes } from "@/constants/routes";
import { SectionKicker } from "@/components/ui/Teardrop";

const steps = [
  { title: "Pick your places", copy: "Tap the corners of the island you want to see." },
  { title: "Set dates and pace", copy: "Slow mornings or full days, it is your call." },
  { title: "Send it to us", copy: "We send back a private plan to review before you pay anything." },
];

export default function PlanYourJourney() {
  return (
    <section className="overflow-hidden bg-[var(--ivory)] py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1360px] gap-14 px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20 lg:px-10">
        <div data-reveal>
          <SectionKicker>Tailor-made</SectionKicker>
          <h2 className="mt-5 max-w-xl font-cinzel text-4xl leading-[1.1] text-[#182231] sm:text-5xl">
            Build your own route.
          </h2>
          <p className="mt-6 max-w-[48ch] text-base leading-8 text-[#182231]/70">
            Choose what you want to see. We shape it into a journey that flows,
            with the right stays and a chauffeur for every mile.
          </p>

          <ol className="mt-10 space-y-6 border-l border-[#c99a2b]/40 pl-6">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border border-[#c99a2b] bg-[var(--ivory)]"
                  aria-hidden="true"
                />
                <p className="font-cinzel text-xs tracking-[0.2em] text-[#9b7422]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-cinzel text-lg text-[#182231]">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#182231]/62">{step.copy}</p>
              </li>
            ))}
          </ol>

          <Link
            href={routes.customizeJourneys}
            className="mt-10 inline-flex min-h-12 items-center gap-3 border border-[#182231] px-8 py-3 font-cinzel text-xs uppercase tracking-[0.24em] text-[#182231] transition-colors duration-300 hover:bg-[#182231] hover:text-white"
          >
            Start planning <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[620px]" data-reveal>
          <div
            className="absolute inset-0 -translate-x-4 translate-y-4 rounded-t-full border border-[#c99a2b]/50 sm:-translate-x-6 sm:translate-y-6"
            aria-hidden="true"
          />
          <div className="relative aspect-[5/6] overflow-hidden rounded-t-full bg-[#182231] sm:aspect-[1/1]">
            <Image
              src="/plannerBakcground.jpg"
              alt="A scenic Sri Lankan route for a custom journey"
              fill
              className="object-cover transition duration-1000 hover:scale-[1.03]"
              sizes="(max-width: 1024px) 90vw, 620px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d141e]/50 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
