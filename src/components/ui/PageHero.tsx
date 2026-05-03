"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PageHeroProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  height?: string;
}

export default function PageHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  height = "h-[60vh]",
}: PageHeroProps) {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroTextRef.current,
        { y: 50, opacity: 0 },
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
    <div className={`relative ${height} overflow-hidden`}>
      <div ref={heroImgRef} className="absolute inset-0 scale-110">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/60" />
      <div
        ref={heroTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <p className="font-cinzel text-amber-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">
          {eyebrow}
        </p>
        <h1 className="font-cinzel text-4xl sm:text-6xl font-medium text-white mb-5 leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="font-cinzel text-sm sm:text-base text-white/80 max-w-lg">{subtitle}</p>
        <div className="mt-6 w-16 h-px bg-amber-400" />
      </div>
    </div>
  );
}
