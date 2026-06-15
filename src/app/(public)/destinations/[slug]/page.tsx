import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/constants/routes";
import { fetchDestinationBySlug } from "@/services/destinationService";

const BASE_URL = "https://www.abaceylontours.com";
const FALLBACK_IMAGE = "/images/heritage/sl-image.webp";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await fetchDestinationBySlug(slug);

  if (!destination) {
    return {
      title: "Destination Not Found",
      description: "The requested Sri Lanka destination could not be found.",
    };
  }

  return {
    title: `${destination.name} | Sri Lanka Destination Guide`,
    description: destination.description.slice(0, 160),
    alternates: {
      canonical: `${BASE_URL}${routes.destinations}/${destination.slug}`,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await fetchDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const image = destination.images?.[0] || FALLBACK_IMAGE;

  return (
    <main className="min-h-screen bg-[#F5F2ED]">
      <section className="relative overflow-hidden bg-[#0F172A] pb-16 pt-28 sm:pb-20 sm:pt-36">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={image}
            alt={destination.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/55 via-[#0F172A]/75 to-[#0F172A]" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-amber-300/35 bg-white/8 px-4 py-1.5 font-cinzel text-xs uppercase tracking-[0.2em] text-amber-200">
              {destination.category}
            </span>
            <span className="rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-xs text-white/85">
              {destination.region}
            </span>
            <span className="rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-xs text-white/85">
              Best time: {destination.bestTimeToVisit}
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-cinzel text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            {destination.name}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/82 sm:text-lg">
            {destination.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href={routes.planner}
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-3.5 font-cinzel text-xs uppercase tracking-[0.2em] text-[#0F172A] transition hover:bg-amber-300"
            >
              Plan around this destination
            </Link>
            <Link
              href={routes.contact}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-7 py-3.5 font-cinzel text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            >
              Talk to Aba Ceylon
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-18">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#0F172A]/10 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
              Why visit
            </p>
            <h2 className="mt-3 font-cinzel text-3xl text-[#0F172A]">
              What makes {destination.name} worth the route
            </h2>
            <p className="mt-5 text-base leading-8 text-neutral-700">
              {destination.whyVisit}
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-[#0F172A]/8 bg-[#F8F4ED] p-6">
              <p className="font-cinzel text-sm uppercase tracking-[0.2em] text-[#0F172A]/75">
                Local context
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-700">
                Province: {destination.province}
                <br />
                District: {destination.district}
                <br />
                Region: {destination.region}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[#0F172A]/10 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-700">
                Highlights
              </p>
              <ul className="mt-5 space-y-3">
                {destination.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm leading-7 text-neutral-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-[#0F172A]/10 bg-[#0F172A] p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
              <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-amber-300">
                Route planning note
              </p>
              <p className="mt-4 text-sm leading-7 text-white/82">
                The best version of {destination.name} depends on what surrounds
                it. We use this stop as part of a paced private route, not as an
                isolated checklist item.
              </p>
              <Link
                href={routes.destinations}
                className="mt-6 inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.2em] text-amber-300 transition hover:text-amber-200"
              >
                Back to all destinations
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
