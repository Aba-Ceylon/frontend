"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { routes } from "@/constants/routes";
import { isHomeMediaPreloaded } from "@/components/home/homePreload";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function getInitialVideoEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const videoProbe = document.createElement("video");
  const canPlayMp4 =
    typeof videoProbe.canPlayType === "function" &&
    videoProbe.canPlayType("video/mp4").replace(/no/i, "") !== "";

  return canPlayMp4 && !prefersReducedMotion;
}

const TRUST_POINTS = [
  "Private itinerary planning shaped by local knowledge.",
  "Stays, drivers, and route timing curated together.",
  "One direct contact before arrival and on the road.",
];

const HERO_VIDEO_SRC = "/videos/SriLanka.mp4";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const [videoEnabled] = useState(getInitialVideoEnabled);
  const [videoReady, setVideoReady] = useState(() =>
    isHomeMediaPreloaded(HERO_VIDEO_SRC),
  );

  useEffect(() => {
    const video = heroVideoRef.current;

    if (!videoEnabled || !video) {
      return;
    }

    const syncVideoState = () => {
      if (video.readyState >= 2) {
        setVideoReady(true);
      }
    };

    const ensurePlayback = () => {
      syncVideoState();
      void video.play().catch(() => {});
    };

    const handleError = () => {
      setVideoReady(false);
    };

    syncVideoState();

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    if (video.readyState < 2) {
      video.load();
    }

    ensurePlayback();

    video.addEventListener("loadeddata", ensurePlayback);
    video.addEventListener("canplay", ensurePlayback);
    video.addEventListener("playing", syncVideoState);
    video.addEventListener("error", handleError);

    const handleVisibilityRestore = () => {
      if (document.hidden) {
        return;
      }

      if (video.readyState < 2) {
        video.load();
      }

      ensurePlayback();
    };

    document.addEventListener("visibilitychange", handleVisibilityRestore);
    window.addEventListener("pageshow", handleVisibilityRestore);

    return () => {
      video.removeEventListener("loadeddata", ensurePlayback);
      video.removeEventListener("canplay", ensurePlayback);
      video.removeEventListener("playing", syncVideoState);
      video.removeEventListener("error", handleError);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityRestore,
      );
      window.removeEventListener("pageshow", handleVisibilityRestore);
    };
  }, [videoEnabled]);

  useEffect(() => {
    if (!heroRef.current || !backgroundRef.current || !contentRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      if (videoEnabled && heroVideoRef.current) {
        void heroVideoRef.current.play().catch(() => {});
      }

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

      gsap.to(contentRef.current, {
        opacity: 0,
        y: -90,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
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
  }, [videoEnabled]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden bg-white pt-24 sm:pt-28"
    >
      <div ref={backgroundRef} className="absolute inset-0 scale-[1.01]">
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: "url('/images/heritage/Hero1.jpg')" }}
        />
        {videoEnabled ? (
          <video
            ref={heroVideoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/heritage/Hero1.jpg"
            aria-hidden="true"
            disablePictureInPicture
            onLoadedData={() => {
              setVideoReady(true);
              void heroVideoRef.current?.play().catch(() => {});
            }}
            onError={() => {
              setVideoReady(false);
            }}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : null}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.72)_32%,rgba(255,255,255,0.38)_56%,rgba(255,255,255,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,34,49,0.05)_0%,rgba(24,34,49,0.02)_42%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(191,146,48,0.08),transparent_22%)]" />

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
              href={routes.packages}
              className="inline-flex min-h-13 items-center justify-center bg-[#182231] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-white transition hover:bg-[#243142]"
            >
              Explore Curated Packages
            </Link>
            <Link
              href={routes.planner}
              className="inline-flex min-h-13 items-center justify-center border border-[#182231]/16 bg-[rgba(255,253,248,0.78)] px-7 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-[#182231] transition hover:bg-white"
            >
              Plan With Us
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
              Explore ready-made routes or begin a fully custom journey with the
              planner.
            </p>
          </div>
          <Link
            href={routes.packages}
            className="inline-flex min-h-14 items-center justify-center bg-[#182231] px-8 py-4 text-center font-cinzel text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#243142]"
          >
            Explore Curated Packages
          </Link>
          <Link
            href={routes.planner}
            className="inline-flex min-h-14 items-center justify-center border border-[#182231]/16 bg-[rgba(255,253,248,0.84)] px-8 py-4 text-center font-cinzel text-xs uppercase tracking-[0.24em] text-[#182231] transition hover:bg-white"
          >
            Plan With Us
          </Link>
        </div>
      </div>
    </section>
  );
}
