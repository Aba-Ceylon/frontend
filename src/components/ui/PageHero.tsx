"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TeardropMark } from "@/components/ui/Teardrop";

gsap.registerPlugin(ScrollTrigger);

interface PageHeroProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  height?: string;
  children?: ReactNode;
}

export default function PageHero({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  eyebrow,
  height = "h-[82svh] min-h-[560px]",
  children,
}: PageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll depth: photo drifts down, copy lifts and fades as you leave the hero.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      };
      gsap.fromTo(
        heroImgRef.current,
        { yPercent: 0, scale: 1.05 },
        { yPercent: 10, scale: 1.12, ease: "none", scrollTrigger },
      );
      gsap.to(contentRef.current, {
        yPercent: -12,
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...scrollTrigger, end: "75% top" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <header ref={rootRef} className={`relative overflow-hidden bg-[var(--navy-deep)] ${height}`}>
      <div ref={heroImgRef} className="absolute inset-0 will-change-transform">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="100vw" priority />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,24,0.62)_0%,rgba(10,15,24,0.22)_38%,rgba(10,15,24,0.3)_62%,rgba(10,15,24,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_46%_at_50%_54%,rgba(10,15,24,0.38)_0%,transparent_78%)]" />

      <div
        ref={contentRef}
        className="relative flex h-full flex-col items-center justify-center px-6 pb-14 pt-24 text-center text-white"
      >
        <div className="hero-rise flex items-center gap-4 text-[#e2c27a]" style={{ animationDelay: "0.05s" }}>
          <span className="h-px w-8 bg-current opacity-60 sm:w-12" />
          <TeardropMark className="h-6 w-[18px]" />
          <span className="h-px w-8 bg-current opacity-60 sm:w-12" />
        </div>

        {eyebrow ? (
          <p
            className="hero-rise mt-5 font-cinzel text-[11px] uppercase tracking-[0.32em] text-[#e2c27a]"
            style={{ animationDelay: "0.15s" }}
          >
            {eyebrow}
          </p>
        ) : null}

        <h1
          className="hero-rise mt-5 max-w-5xl font-cinzel text-[2.75rem] leading-[1.04] [text-shadow:0_2px_30px_rgba(10,15,24,0.35)] [text-wrap:balance] sm:text-6xl lg:text-8xl"
          style={{ animationDelay: "0.25s" }}
        >
          {title}
        </h1>

        {subtitle ? (
          <p
            className="hero-rise mt-6 max-w-xl text-base leading-7 text-white/85 [text-shadow:0_1px_12px_rgba(10,15,24,0.55)] sm:text-lg"
            style={{ animationDelay: "0.4s" }}
          >
            {subtitle}
          </p>
        ) : null}

        {children ? (
          <div className="hero-rise mt-10" style={{ animationDelay: "0.55s" }}>
            {children}
          </div>
        ) : null}
      </div>

      <ArrowDown
        className="hero-scroll-cue absolute bottom-7 left-1/2 h-4 w-4 -translate-x-1/2 text-white/70"
        aria-hidden="true"
      />
    </header>
  );
}
