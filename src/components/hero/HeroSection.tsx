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

const HERO_IMAGES = Array.from(
  { length: 11 },
  (_, index) => `/images/HeroMain/${index + 1}.jpg`,
);

const CAROUSEL_INTERVAL_MS = 8000;

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-headline-line", {
          y: 60,
          opacity: 0,
          duration: 1.1,
          stagger: 0.15,
        })
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[100dvh] min-h-[600px] overflow-hidden bg-[#182231]"
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
            className={`object-cover transition-[opacity,transform] duration-[1800ms] ease-out ${
              index === activeImage
                ? "z-10 scale-100 opacity-100"
                : "z-0 scale-[1.045] opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(10,15,24,0.45)_0%,rgba(10,15,24,0.25)_45%,rgba(10,15,24,0.6)_100%)]" />

      <div
        ref={contentRef}
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center text-white"
      >
        <h1 className="font-cinzel">
          <span className="hero-headline-line block text-2xl font-normal tracking-[0.08em] sm:text-3xl">
            Discover
          </span>
          <span className="hero-headline-line mt-2 block text-5xl leading-[1.05] sm:text-7xl lg:text-8xl">
            Timeless Ceylon
          </span>
        </h1>

        <p className="hero-sub mt-6 text-[11px] uppercase tracking-[0.3em] text-white/80 sm:text-xs">
          Tailor-made journeys across Sri Lanka
        </p>

        <Link
          href={routes.customizeJourneys}
          className="hero-cta mt-10 inline-flex min-h-12 items-center justify-center border border-white/70 px-8 py-3 font-cinzel text-xs uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:bg-white hover:text-[#182231]"
        >
          Customize Your Journey
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setIsPlaying((current) => !current)}
        className="absolute bottom-6 right-5 z-20 flex h-9 w-9 items-center justify-center border border-white/30 text-white/80 transition hover:bg-white/10 hover:text-white sm:right-8"
        aria-label={isPlaying ? "Pause image carousel" : "Play image carousel"}
      >
        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
    </section>
  );
}
