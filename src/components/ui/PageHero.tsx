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
  height = "min-h-[460px] h-[62svh] sm:h-[66vh]",
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
    <div className={`relative overflow-hidden bg-[#f4ecdf] ${height}`}>
      <div ref={heroImgRef} className="absolute inset-0 scale-105" data-parallax-root>
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,240,230,0.92)_0%,rgba(246,240,230,0.72)_42%,rgba(246,240,230,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(191,146,48,0.18),transparent_24%)]" />
      <div
        ref={heroTextRef}
        className="absolute inset-x-0 bottom-0 top-0 mx-auto flex max-w-[1360px] items-end px-6 pb-10 sm:px-8 sm:pb-14 lg:px-10 lg:pb-16"
      >
        <div className="max-w-3xl" data-reveal>
          <p className="font-cinzel text-[11px] uppercase tracking-[0.36em] text-[#8b6b1f]">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-cinzel text-4xl leading-[1.02] text-[#182231] sm:text-6xl lg:text-[4.5rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#445062] sm:text-base sm:leading-8">
            {subtitle}
          </p>
          <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#6e7684]">
            <span className="h-px w-14 bg-[#C99A2B]" data-draw-line />
            Private curation
          </div>
        </div>
      </div>
    </div>
  );
}
