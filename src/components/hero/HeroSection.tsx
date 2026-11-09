"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, Pause, Play } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { routes } from "@/constants/routes";
import { cloudinaryVideos } from "@/config/media";
import { TeardropMark } from "@/components/ui/Teardrop";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_VIDEO = cloudinaryVideos.hero;

type NetworkInformationLike = { saveData?: boolean };

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Remembers a manual pause so scrolling back into view doesn't override it.
  const userPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  // Video playback: muted autoplay, paused off-screen, skipped for reduced motion / data saver.
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    // React doesn't reliably write the `muted` attribute, which iOS needs for autoplay.
    video.muted = true;
    video.defaultMuted = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: NetworkInformationLike })
        .connection?.saveData,
    );
    if (reduceMotion || saveData) {
      userPausedRef.current = true;
      return;
    }

    const tryPlay = () => {
      if (userPausedRef.current) return;
      video.play().catch(() => {
        // Autoplay blocked (e.g. low-power mode): the poster stays up.
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    // Loop inside a window that skips the black intro and the branded outro.
    const handleTimeUpdate = () => {
      if (video.currentTime >= HERO_VIDEO.loopEnd) {
        video.currentTime = HERO_VIDEO.loopStart;
      }
      if (video.currentTime >= HERO_VIDEO.loopStart) {
        setIsVideoVisible(true);
      }
    };
    const handleEnded = () => {
      video.currentTime = HERO_VIDEO.loopStart;
      tryPlay();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    const skipIntro = () => {
      if (video.currentTime < HERO_VIDEO.loopStart) {
        video.currentTime = HERO_VIDEO.loopStart;
      }
    };
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) skipIntro();
    else video.addEventListener("loadedmetadata", skipIntro, { once: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(hero);
    // Start right away; the observer then pauses/resumes as the hero leaves/enters view.
    tryPlay();

    return () => {
      observer.disconnect();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", skipIntro);
    };
  }, []);

  // Scroll-linked depth: the video drifts and the copy lifts away as you scroll.
  useEffect(() => {
    if (!heroRef.current || !backgroundRef.current || !contentRef.current) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      };

      gsap.fromTo(
        backgroundRef.current,
        { scale: 1.02, yPercent: 0 },
        { scale: 1.1, yPercent: 8, ease: "none", scrollTrigger },
      );
      gsap.to(contentRef.current, {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...scrollTrigger, end: "70% top" },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => undefined);
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  return (
    <section
      ref={heroRef}
      aria-label="Welcome to Aba Ceylon Tours & Travels"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#0d141e]"
    >
      <div ref={backgroundRef} className="absolute inset-0 will-change-transform">
        {/* Poster sits underneath so the black opening frames never show. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_VIDEO.poster}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
            isVideoVisible ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={HERO_VIDEO.url} type="video/mp4" />
        </video>
      </div>

      {/* Navy wash: darker at the top for the navbar and at the foot for the controls. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,24,0.62)_0%,rgba(10,15,24,0.18)_32%,rgba(10,15,24,0.22)_62%,rgba(10,15,24,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,15,24,0.45)_100%)]" />
      {/* Soft pool of shade behind the copy so it stays legible on bright footage. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_46%_at_50%_54%,rgba(10,15,24,0.42)_0%,rgba(10,15,24,0.18)_55%,transparent_80%)]" />

      <div
        ref={contentRef}
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 pb-16 pt-24 text-center text-white"
      >
        <div className="hero-rise flex items-center gap-4 text-[#e2c27a]" style={{ animationDelay: "0.1s" }}>
          <span className="h-px w-8 bg-current opacity-60 sm:w-14" />
          <TeardropMark className="h-6 w-[18px]" />
          <span className="h-px w-8 bg-current opacity-60 sm:w-14" />
        </div>

        <p
          className="hero-rise mt-5 font-cinzel text-[10px] uppercase tracking-[0.34em] text-[#e2c27a] [text-shadow:0_1px_10px_rgba(10,15,24,0.6)] sm:text-xs"
          style={{ animationDelay: "0.25s" }}
        >
          The Teardrop of the Indian Ocean
        </p>

        <h1 className="mt-6 font-cinzel [text-shadow:0_2px_30px_rgba(10,15,24,0.35)]">
          <span
            className="hero-rise block text-xl font-normal tracking-[0.14em] text-white/90 sm:text-3xl"
            style={{ animationDelay: "0.4s" }}
          >
            Journey Through
          </span>
          <span
            className="hero-rise mt-2 block text-[2.75rem] leading-[1.02] sm:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.55s" }}
          >
            Timeless Ceylon
          </span>
        </h1>

        <p
          className="hero-rise mt-7 max-w-[36rem] text-sm leading-7 text-white/90 [text-shadow:0_1px_12px_rgba(10,15,24,0.55)] sm:text-base"
          style={{ animationDelay: "0.75s" }}
        >
          Private, tailor-made journeys across the island, from misty tea
          country and ancient citadels to golden southern shores. Planned by
          locals, driven by our own chauffeurs.
        </p>

        <div
          className="hero-rise mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-10"
          style={{ animationDelay: "0.9s" }}
        >
          <Link
            href={routes.customizeJourneys}
            className="inline-flex min-h-12 items-center justify-center border border-white/70 px-8 py-3 font-cinzel text-xs uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:bg-white hover:text-[#182231] focus-visible:bg-white focus-visible:text-[#182231] focus-visible:outline-none"
          >
            Customize Your Journey
          </Link>
          <Link href={routes.packages} className="editorial-link text-white/90 hover:text-[#e2c27a]">
            View Tour Packages
          </Link>
        </div>
      </div>

      {/* Controls sit bottom-left: the WhatsApp and chat buttons own the bottom-right corner. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-5 px-5 pb-6 text-white sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={toggleVideo}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/35 text-white/80 transition hover:border-white/70 hover:bg-white/10 hover:text-white"
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>

        <a
          href="#island"
          className="hero-scroll-cue absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-cinzel text-[10px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-white"
        >
          Explore
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
