"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { routes } from "@/constants/routes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TRUST_POINTS = [
  "Private itinerary planning shaped by local knowledge.",
  "Stays, drivers, and route timing curated together.",
  "One direct contact before arrival and on the road.",
];

const HERO_IMAGES = Array.from(
  { length: 11 },
  (_, index) => `/images/HeroMain/${index + 1}.jpg`,
);

const CAROUSEL_INTERVAL_MS = 6500;

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setIsPlaying(false);
    };
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % HERO_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, prefersReducedMotion]);

  useEffect(() => {
    if (!heroRef.current || !backgroundRef.current || !contentRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(backgroundRef.current, {
        scale: 1.04,
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from(".hero-kicker", { opacity: 0, y: 20, duration: 0.8 })
        .from(
          ".hero-headline-line",
          { y: 90, opacity: 0, duration: 1, stagger: 0.12 },
          "-=0.45",
        )
        .from(".hero-copy", { y: 32, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(actionsRef.current, { x: 36, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(
          trustRef.current?.children ?? [],
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.4",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden bg-white pt-24 sm:pt-28"
    >
      <div ref={backgroundRef} className="absolute inset-0 scale-[1.01]">
        {HERO_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            quality={82}
            aria-hidden="true"
            className={`object-cover transition-[opacity,transform] duration-[1600ms] ease-out ${
              index === activeImage
                ? "z-10 scale-100 opacity-100"
                : "z-0 scale-[1.045] opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.72)_32%,rgba(255,255,255,0.38)_56%,rgba(255,255,255,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,34,49,0.05)_0%,rgba(24,34,49,0.02)_42%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(191,146,48,0.08),transparent_22%)]" />

      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 sm:bottom-7 sm:right-8" aria-label="Hero image carousel controls">
        <div className="flex items-center gap-1.5 border border-white/30 bg-[#182231]/45 px-3 py-2 backdrop-blur-md">
          {HERO_IMAGES.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveImage(index)}
              className={`h-1.5 transition-all duration-500 ${index === activeImage ? "w-7 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"}`}
              aria-label={`Show image ${index + 1} of ${HERO_IMAGES.length}`}
              aria-current={index === activeImage ? "true" : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsPlaying((current) => !current)}
          className="flex h-9 w-9 items-center justify-center border border-white/30 bg-[#182231]/45 text-white backdrop-blur-md transition hover:bg-[#182231]/70"
          aria-label={isPlaying ? "Pause image carousel" : "Play image carousel"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-6rem)] w-full max-w-[1360px] gap-10 px-6 pb-12 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_320px] lg:px-10 lg:pb-16">
        <div ref={contentRef} className="flex flex-col justify-end">
          <p className="hero-kicker font-cinzel text-[11px] uppercase tracking-[0.38em] text-[#8b6b1f]">
            BUILT FOR AN ULTIMATE HERITAGE EXPERIENCE
          </p>

          <div className="mt-6 overflow-hidden">
            <h1 className="font-cinzel text-[2.9rem] leading-[0.95] text-[#182231] sm:text-[4.35rem] lg:text-[5.8rem] xl:text-[6.7rem]">
              <span className="hero-headline-line block">Journeys with</span>
              <span className="hero-headline-line block">depth, calm,</span>
              <span className="hero-headline-line block">and local care.</span>
            </h1>
          </div>

          <p className="hero-copy mt-6 max-w-2xl text-base leading-8 text-[#3c495b] sm:text-lg">
            Aba Ceylon plans tailor-made routes across heritage cities, hill
            country, wildlife, and coastlines with a more personal, image-led,
            concierge-style approach to Sri Lanka travel.
          </p>

          <div ref={trustRef} className="mt-10 grid gap-4 sm:grid-cols-3">
            {TRUST_POINTS.map((point) => (
              <div
                key={point}
                className="border border-[#182231]/8 bg-[rgba(255,253,248,0.82)] px-5 py-5 backdrop-blur-sm"
              >
                <div className="mb-3 h-px w-10 bg-[#bf9230]" />
                <p className="text-sm leading-7 text-[#445062]">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:hidden">
            <Link
              href={routes.customizeJourneys}
              className="inline-flex min-h-13 items-center justify-center bg-[#182231] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-white transition hover:bg-[#243142]"
            >
              Customize Your Journey
            </Link>
            <Link
              href={routes.customizeJourneys}
              className="inline-flex min-h-13 items-center justify-center border border-[#182231]/16 bg-[rgba(255,253,248,0.78)] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-[#182231] transition hover:bg-white"
            >
              See How It Works
            </Link>
          </div>
        </div>

        <div
          ref={actionsRef}
          className="hidden self-end lg:flex lg:flex-col lg:items-stretch lg:justify-end lg:gap-4"
        >
          <div className="border border-[#182231]/8 bg-[rgba(255,253,248,0.84)] p-5 backdrop-blur-sm">
            <p className="font-cinzel text-[11px] uppercase tracking-[0.3em] text-[#8b6b1f]">
              Start here
            </p>
            <p className="mt-3 text-sm leading-7 text-[#445062]">
              Learn how to shape your route, then open the planner when you are
              ready.
            </p>
          </div>
          <Link
            href={routes.customizeJourneys}
            className="inline-flex min-h-14 items-center justify-center bg-[#182231] px-8 py-4 text-center font-cinzel text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#243142]"
          >
            Customize Your Journey
          </Link>
          <Link
            href={routes.customizeJourneys}
            className="inline-flex min-h-14 items-center justify-center border border-[#182231]/16 bg-[rgba(255,253,248,0.84)] px-8 py-4 text-center font-cinzel text-xs uppercase tracking-[0.24em] text-[#182231] transition hover:bg-white"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
