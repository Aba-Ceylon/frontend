"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/components/i18n/I18nProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CustomPlannerSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !backgroundRef.current || !cardRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 42, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 84%",
          },
        },
      );

      gsap.fromTo(
        backgroundRef.current,
        { scale: 1.02 },
        {
          scale: 1.1,
          transformOrigin: "50% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );

      gsap.to(cardRef.current, {
        y: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="custom-planner"
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 bg-[#0B1220] scroll-mt-28"
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: "url('/plannerBakcground.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,18,0.86),rgba(10,15,26,0.64),rgba(5,10,18,0.82))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,154,43,0.2),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />

      <div className="relative max-w-7xl mx-auto px-6 min-h-[260px] flex items-center justify-center">
        <div
          ref={cardRef}
          className="w-full rounded-[2rem] border border-white/14 bg-white/10 backdrop-blur-xl shadow-[0_28px_100px_rgba(0,0,0,0.28)]"
        >
          <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300" />
                <span className="font-cinzel text-[11px] uppercase tracking-[0.34em] text-amber-300">
                  {t("home.customPlanner.eyebrow")}
                </span>
              </div>
              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {t("home.customPlanner.title")}
              </h2>
              <p className="mt-4 max-w-2xl text-white/78 text-sm sm:text-base leading-7">
                {t("home.customPlanner.description")}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/78">
                  {t("home.customPlanner.routePlanning")}
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/78">
                  {t("home.customPlanner.chauffeurMatching")}
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/78">
                  {t("home.customPlanner.whatsappReady")}
                </span>
              </div>
            </div>

            <div className="flex w-full lg:w-auto lg:justify-end">
              <Link
                href="/planner"
                className="inline-flex min-w-[220px] items-center justify-center rounded-sm border border-amber-300/60 bg-[linear-gradient(135deg,rgba(251,191,36,0.88),rgba(217,119,6,0.9))] px-7 py-4 font-cinzel text-sm uppercase tracking-[0.26em] text-[#0F172A] shadow-[0_0_30px_rgba(245,158,11,0.28)] transition hover:scale-[1.02] hover:shadow-[0_0_42px_rgba(245,158,11,0.36)]"
              >
                {t("home.customPlanner.startPlanning")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
