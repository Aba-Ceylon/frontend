"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const SESSION_KEY = "aba-home-loader-seen";
const MIN_VISIBLE_MS = 5000;
const MAX_VISIBLE_MS = 6000;

export default function HomeEntryLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const progressGlowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      prefersReducedMotion ||
      sessionStorage.getItem(SESSION_KEY) === "true"
    ) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const overlay = overlayRef.current;
    const content = contentRef.current;
    const logo = logoRef.current;
    const accent = accentRef.current;
    const progress = progressRef.current;
    const progressGlow = progressGlowRef.current;

    if (
      !overlay ||
      !content ||
      !logo ||
      !accent ||
      !progress ||
      !progressGlow
    ) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let hasCompleted = false;
    let readyTimeoutId: number | null = null;
    let maxTimeoutId: number | null = null;
    const startTime = performance.now();

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(content, { autoAlpha: 0, y: 18 });
    gsap.set(logo, { autoAlpha: 0, scale: 0.82, rotate: -4 });
    gsap.set(accent, { autoAlpha: 0, scaleX: 0.3 });
    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(progressGlow, { xPercent: -115 });

    const introTimeline = gsap.timeline();
    introTimeline
      .to(content, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" })
      .to(
        logo,
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.25",
      )
      .to(
        accent,
        { autoAlpha: 1, scaleX: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )
      .to(
        progress,
        { scaleX: 0.72, duration: 1.05, ease: "power2.inOut" },
        "-=0.45",
      );

    const shimmerTween = gsap.to(progressGlow, {
      xPercent: 115,
      duration: 1.15,
      ease: "none",
      repeat: -1,
    });

    const pulseTween = gsap.to(logo, {
      scale: 1.035,
      duration: 1.25,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const completeLoader = () => {
      if (hasCompleted) {
        return;
      }

      hasCompleted = true;
      shimmerTween.kill();
      pulseTween.kill();
      introTimeline.kill();

      gsap
        .timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            sessionStorage.setItem(SESSION_KEY, "true");
            document.body.style.overflow = previousOverflow;
            setIsVisible(false);
          },
        })
        .to(progress, { scaleX: 1, duration: 0.3 })
        .to(content, { autoAlpha: 0, y: -16, duration: 0.42 }, "-=0.02")
        .to(overlay, { autoAlpha: 0, duration: 0.48 }, "-=0.12");
    };

    const markReady = () => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

      if (readyTimeoutId) {
        window.clearTimeout(readyTimeoutId);
      }

      readyTimeoutId = window.setTimeout(completeLoader, remaining);
    };

    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", markReady, { once: true });
    }

    maxTimeoutId = window.setTimeout(completeLoader, MAX_VISIBLE_MS);

    return () => {
      if (readyTimeoutId) {
        window.clearTimeout(readyTimeoutId);
      }

      if (maxTimeoutId) {
        window.clearTimeout(maxTimeoutId);
      }

      window.removeEventListener("load", markReady);
      introTimeline.kill();
      shimmerTween.kill();
      pulseTween.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] overflow-hidden bg-[#040608]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,154,43,0.2),transparent_42%),linear-gradient(135deg,#05070a_0%,#0b1118_46%,#05070a_100%)]" />
      <div className="absolute inset-0 bg-noise opacity-70" />
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/10 bg-[radial-gradient(circle,rgba(201,154,43,0.12),transparent_62%)] blur-3xl" />

      <div
        ref={contentRef}
        className="relative z-[1] flex min-h-screen items-center justify-center px-6 py-16"
      >
        <div className="w-full max-w-xl text-center">
          <div
            ref={logoRef}
            className="mx-auto flex w-full max-w-[18rem] flex-col items-center"
          >
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-amber-300/25 bg-white/5 shadow-[0_0_80px_rgba(201,154,43,0.12)] backdrop-blur-sm sm:h-48 sm:w-48">
              <div className="absolute inset-3 rounded-full border border-amber-200/20" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(201,154,43,0.18),transparent_72%)]" />
              <Image
                src="/LOGO.jpeg"
                alt="ABA Ceylon logo"
                width={160}
                height={160}
                priority
                sizes="160px"
                className="relative h-28 w-28 rounded-full object-cover ring-2 ring-amber-200/35 sm:h-32 sm:w-32"
              />
            </div>
          </div>

          <div
            ref={accentRef}
            className="mx-auto mt-8 h-px w-28 bg-gradient-to-r from-transparent via-amber-300/90 to-transparent"
          />

          <p className="mt-8 font-cinzel text-[0.68rem] uppercase tracking-[0.55em] text-amber-200/85 sm:text-xs">
            The Ultimate Heritage Experience
          </p>
          <h1 className="mt-5 font-cinzel text-4xl text-white sm:text-5xl">
            ABA Ceylon
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/72 sm:text-base">
            Preparing immersive journeys, curated stays, and signature routes
            across the island.
          </p>

          <div className="mx-auto mt-10 w-full max-w-sm">
            <div className="relative h-[3px] overflow-hidden rounded-full bg-white/12">
              <div
                ref={progressRef}
                className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-500"
              />
              <div
                ref={progressGlowRef}
                className="absolute inset-y-[-5px] left-0 w-24 rounded-full bg-white/75 blur-md"
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-amber-100/70 sm:text-[0.72rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
              Entering the island story
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
