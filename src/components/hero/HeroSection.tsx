"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/components/i18n/I18nProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const ornamentLeftRef = useRef<HTMLDivElement>(null);
  const ornamentRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !backgroundRef.current || !contentRef.current)
      return;

    const ctx = gsap.context(() => {
      // Parallax background - slower movement
      gsap.to(backgroundRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Overlay darkens on scroll
      gsap.to(overlayRef.current, {
        opacity: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Content fades and moves up
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -150,
        scale: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Ornaments parallax
      if (ornamentLeftRef.current) {
        gsap.to(ornamentLeftRef.current, {
          y: 200,
          x: -50,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      if (ornamentRightRef.current) {
        gsap.to(ornamentRightRef.current, {
          y: 200,
          x: 50,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      // Scroll indicator animation
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });

        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "20% top",
            scrub: true,
          },
        });
      }

      // Initial entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-headline", {
        y: 120,
        opacity: 0,
        duration: 1.4,
        delay: 0.3,
      })
        .from(
          ".hero-subheadline",
          {
            y: 60,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.9",
        )
        .from(
          ".ornament",
          {
            scale: 0,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
          },
          "-=1",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Parallax Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{
          backgroundImage: `url('/images/heritage/Hero1.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Gradient Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70"
        style={{ opacity: 0.5 }}
      />

      {/* Royal Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ornamental Left */}
      <div
        ref={ornamentLeftRef}
        className="ornament absolute top-1/4 left-8 lg:left-16 hidden lg:block"
      >
        <div className="w-20 h-20 border-2 border-amber-400/30 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
        </div>
        <div className="w-px h-24 bg-linear-to-b from-amber-400/50 to-transparent mx-auto mt-4"></div>
      </div>

      {/* Ornamental Right */}
      <div
        ref={ornamentRightRef}
        className="ornament absolute bottom-1/4 right-8 lg:right-16 hidden lg:block"
      >
        <div className="w-px h-24 bg-linear-to-t from-amber-400/50 to-transparent mx-auto mb-4"></div>
        <div className="w-20 h-20 border-2 border-amber-400/30 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto"
      >
        {/* Decorative Top Border */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className="w-16 h-px bg-linear-to-r from-transparent to-amber-400"></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          <div className="w-16 h-px bg-linear-to-l from-transparent to-amber-400"></div>
        </div>

        {/* Main Headline */}
        <h1 className="hero-headline font-cinzel text-5xl md:text-7xl lg:text-8xl font-medium mb-6 tracking-wider leading-tight drop-shadow-2xl">
          <span className="text-[#C99A2B] drop-shadow-[0_0_30px_rgba(201,154,43,0.38)]">
            {t("home.hero.titleLine1")}
          </span>
          <br />
          {t("home.hero.titleLine2")}
        </h1>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center my-6 gap-3">
          <div className="w-12 h-px bg-amber-400/50"></div>
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
          <div className="w-12 h-px bg-amber-400/50"></div>
        </div>

        {/* Subheadline */}
        <p className="hero-subheadline text-lg md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide text-amber-50/90">
          {t("home.hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/packages"
            className="relative overflow-hidden group bg-amber-400/60 drop-shadow-[0_0_30px_rgba(201,154,43,0.5)] backdrop-blur-2xl text-white px-12 py-4 text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10 font-cinzel tracking-wide">
              {t("home.hero.viewPackages")}
            </span>
          </Link>

          <Link
            href="/planner"
            className="relative overflow-hidden group border-2 border-amber-400/60 text-white px-12 py-4 text-lg backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <span className="relative z-10 font-cinzel tracking-wide">
              {t("home.hero.planJourney")}
            </span>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-amber-100 md:flex flex-col items-center cursor-pointer z-20 hidden"
      >
        <div className="w-7 h-12 border-2  rounded-full flex justify-center mb-2 backdrop-blur-sm bg-black/20">
          <div className="w-1.5 h-4 bg-amber-400 rounded-full mt-2 animate-pulse shadow-lg shadow-amber-400/50"></div>
        </div>
        <span className="text-xs font-cinzel font-semibold tracking-[0.3em] text-white">
          {t("home.hero.scroll")}
        </span>
      </div>
    </section>
  );
}
