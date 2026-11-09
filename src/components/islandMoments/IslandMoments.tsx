"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { routes } from "@/constants/routes";
import { SectionKicker } from "@/components/ui/Teardrop";

type Moment = {
  title: string;
  region: string;
  image: string;
  alt: string;
  href: string;
};

const destination = (slug: string) => `${routes.destinations}/${slug}`;

const MOMENTS: Moment[] = [
  {
    title: "Sigiriya",
    region: "Cultural Triangle",
    image: "/images/island/sigiriya.jpg",
    alt: "Sigiriya Lion Rock rising above the royal water gardens",
    href: destination("sigiriya"),
  },
  {
    title: "Nine Arch Bridge",
    region: "Ella · Hill Country",
    image: "/images/island/nine-arch-bridge.jpg",
    alt: "A blue train crossing the Nine Arch Bridge through the jungle near Ella",
    href: destination("nine-arch-bridge"),
  },
  {
    title: "Tea Country",
    region: "Central Highlands",
    image: "/images/island/tea-country.jpg",
    alt: "A tea plucker at work among the green tea bushes",
    href: destination("tea-plantations"),
  },
  {
    title: "Misty Highlands",
    region: "Hill Country",
    image: "/images/island/hill-country-mist.jpg",
    alt: "Layers of misty mountains and valleys in the Sri Lankan hill country",
    href: routes.destinations,
  },
  {
    title: "Ruwanwelisaya",
    region: "Anuradhapura",
    image: "/images/island/ruwanwelisaya.jpg",
    alt: "The white Ruwanwelisaya stupa at dusk over the lawns of Anuradhapura",
    href: destination("anuradhapura"),
  },
  {
    title: "Gentle Giants",
    region: "Pinnawala · Kegalle",
    image: "/images/island/elephants.jpg",
    alt: "Elephants bathing in a river while visitors watch from the rocks",
    href: destination("kegalle"),
  },
  {
    title: "Stilt Fishermen",
    region: "Southern Coast",
    image: "/images/island/stilt-fishermen.jpg",
    alt: "Stilt fishermen perched above the surf on the southern coast",
    href: destination("galle"),
  },
  {
    title: "Coconut Tree Hill",
    region: "Mirissa",
    image: "/images/island/coconut-tree-hill.jpg",
    alt: "Palm trees leaning over the turquoise sea at Coconut Tree Hill",
    href: destination("mirissa"),
  },
  {
    title: "Surf Coasts",
    region: "South & East",
    image: "/images/island/surf-coast.jpg",
    alt: "A surfer walking out over the rocks into a sunlit sea",
    href: destination("arugam-bay"),
  },
  {
    title: "Colonial Grandeur",
    region: "Heritage Stays",
    image: "/images/island/colonial-heritage.jpg",
    alt: "A white colonial-era hotel facade under a bright sky",
    href: routes.stays,
  },
  {
    title: "Colombo",
    region: "The Capital",
    image: "/images/island/colombo-skyline.jpg",
    alt: "The Colombo skyline at sunset over Beira Lake",
    href: destination("colombo"),
  },
];

export default function IslandMoments() {
  const railRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollPrev(rail.scrollLeft > 4);
    setCanScrollNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    updateEdges();
    rail.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      rail.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.querySelector("li");
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({ left: direction * (card.clientWidth + gap), behavior: "smooth" });
  };

  return (
    <section
      id="island"
      aria-labelledby="island-heading"
      className="scroll-mt-20 overflow-hidden bg-[#0d141e] py-20 text-white lg:py-28"
    >
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div>
            <SectionKicker tone="dark">One island · Eleven postcards</SectionKicker>
            <h2
              id="island-heading"
              className="mt-4 max-w-[18ch] font-cinzel text-4xl leading-[1.1] sm:text-5xl"
            >
              A small teardrop holding a whole world.
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:max-w-[26rem] lg:items-end lg:text-right">
            <p className="text-base leading-8 text-white/70">
              Ancient citadels, cloud-wrapped tea estates, wild elephants and
              palm-fringed bays, often less than a day&rsquo;s drive apart.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canScrollPrev}
                aria-label="Previous postcards"
                className="round-btn round-btn-dark"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canScrollNext}
                aria-label="Next postcards"
                className="round-btn round-btn-dark"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul
        ref={railRef}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] sm:gap-6 lg:px-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
        aria-label="Sri Lanka highlights"
      >
        {MOMENTS.map((moment, index) => (
          <li
            key={moment.title}
            className="w-[80vw] max-w-[420px] shrink-0 snap-start sm:w-[380px] lg:w-[420px]"
          >
            <Link
              href={moment.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-t-full bg-[#182231] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2c27a]"
             data-spotlight>
              <Image
                src={moment.image}
                alt={moment.alt}
                fill
                sizes="(max-width: 640px) 80vw, 420px"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(10,15,24,0.85)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <p className="font-cinzel text-xs tracking-[0.2em] text-[#e2c27a]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-cinzel text-xl leading-tight sm:text-2xl">
                    {moment.title}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/70">
                    {moment.region}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-white/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e2c27a]"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
