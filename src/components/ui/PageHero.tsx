"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  height = "h-[72svh] min-h-[480px]",
  children,
}: PageHeroProps) {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroTextRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.05 },
      );
      gsap.to(heroImgRef.current, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: heroImgRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={`relative overflow-hidden bg-[#182231] ${height}`}>
      <div ref={heroImgRef} className="absolute inset-0 scale-105" data-parallax-root>
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="100vw" priority />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,24,0.5)_0%,rgba(10,15,24,0.3)_45%,rgba(10,15,24,0.65)_100%)]" />
      <div
        ref={heroTextRef}
        className="relative flex h-full flex-col items-center justify-center px-6 pt-20 text-center text-white"
      >
        {eyebrow ? (
          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/75">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl font-cinzel text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-xl text-sm uppercase tracking-[0.24em] text-white/80 sm:text-[13px]">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </div>
  );
}
