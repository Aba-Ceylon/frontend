"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useLoaderGate, useLoaderProgress } from "./LoaderGate";

export default function HomeEntryLoader() {
  const ready = useLoaderGate();
  const progressValue = useLoaderProgress();
  const [isVisible, setIsVisible] = useState(() => !ready);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const logoShellRef = useRef<HTMLDivElement | null>(null);
  const orbitPrimaryRef = useRef<HTMLDivElement | null>(null);
  const orbitSecondaryRef = useRef<HTMLDivElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const progressGlowRef = useRef<HTMLDivElement | null>(null);
  const animationsRef = useRef<gsap.core.Animation[]>([]);
  const previousOverflowRef = useRef("");

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const overlay = overlayRef.current;
    const scene = sceneRef.current;
    const logoShell = logoShellRef.current;
    const orbitPrimary = orbitPrimaryRef.current;
    const orbitSecondary = orbitSecondaryRef.current;
    const beam = beamRef.current;
    const glow = glowRef.current;
    const copy = copyRef.current;
    const progress = progressRef.current;
    const progressGlow = progressGlowRef.current;

    if (
      !overlay ||
      !scene ||
      !logoShell ||
      !orbitPrimary ||
      !orbitSecondary ||
      !beam ||
      !glow ||
      !copy ||
      !progress ||
      !progressGlow
    ) {
      return;
    }

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(scene, { autoAlpha: 0, y: 24, scale: 0.96, rotateX: 10 });
    gsap.set(logoShell, { autoAlpha: 0, y: 18, scale: 0.88, rotateY: -18 });
    gsap.set(orbitPrimary, { autoAlpha: 0, scale: 0.84, rotateZ: 18 });
    gsap.set(orbitSecondary, { autoAlpha: 0, scale: 0.9, rotateZ: -12 });
    gsap.set(beam, {
      autoAlpha: 0,
      scaleY: 0.5,
      transformOrigin: "50% 100%",
    });
    gsap.set(glow, { autoAlpha: 0, scale: 0.76 });
    gsap.set(copy, { autoAlpha: 0, y: 12 });
    gsap.set(progress, {
      scaleX: 0.02,
      transformOrigin: "left center",
    });
    gsap.set(progressGlow, { xPercent: -120 });

    const introTimeline = gsap.timeline();
    introTimeline
      .to(scene, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.75,
        ease: "power3.out",
      })
      .to(
        glow,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.52",
      )
      .to(
        beam,
        {
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.7",
      )
      .to(
        orbitPrimary,
        {
          autoAlpha: 1,
          scale: 1,
          rotateZ: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.65",
      )
      .to(
        orbitSecondary,
        {
          autoAlpha: 1,
          scale: 1,
          rotateZ: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.7",
      )
      .to(
        logoShell,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.7",
      )
      .to(
        copy,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.38",
      );

    const orbitPrimaryTween = gsap.to(orbitPrimary, {
      rotateZ: 360,
      duration: 10.5,
      ease: "none",
      repeat: -1,
    });

    const orbitSecondaryTween = gsap.to(orbitSecondary, {
      rotateZ: -360,
      duration: 13.5,
      ease: "none",
      repeat: -1,
    });

    const shellFloatTween = gsap.to(logoShell, {
      y: -10,
      rotateX: 3,
      duration: 1.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const sceneDriftTween = gsap.to(scene, {
      rotateY: 3,
      rotateX: -2,
      duration: 2.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const beamPulseTween = gsap.to(beam, {
      opacity: 0.48,
      duration: 1.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const glowPulseTween = gsap.to(glow, {
      scale: 1.08,
      opacity: 0.92,
      duration: 1.45,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const shimmerTween = gsap.to(progressGlow, {
      xPercent: 120,
      duration: 1,
      ease: "none",
      repeat: -1,
    });

    animationsRef.current = [
      introTimeline,
      orbitPrimaryTween,
      orbitSecondaryTween,
      shellFloatTween,
      sceneDriftTween,
      beamPulseTween,
      glowPulseTween,
      shimmerTween,
    ];

    return () => {
      animationsRef.current.forEach((animation) => animation.kill());
      animationsRef.current = [];
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !progressRef.current) {
      return;
    }

    gsap.to(progressRef.current, {
      scaleX: Math.max(progressValue, 0.02),
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  }, [isVisible, progressValue]);

  useEffect(() => {
    if (!ready || !isVisible) {
      return;
    }

    const overlay = overlayRef.current;
    const scene = sceneRef.current;
    const progress = progressRef.current;

    if (!overlay || !scene || !progress) {
      return;
    }

    animationsRef.current.forEach((animation) => animation.kill());
    animationsRef.current = [];

    const outroTimeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        document.body.style.overflow = previousOverflowRef.current;
        setIsVisible(false);
      },
    });

    outroTimeline
      .to(progress, { scaleX: 1, duration: 0.2 })
      .to(
        scene,
        { autoAlpha: 0, y: -14, scale: 1.03, duration: 0.34 },
        "-=0.04",
      )
      .to(overlay, { autoAlpha: 0, duration: 0.38 }, "-=0.08");

    return () => {
      outroTimeline.kill();
    };
  }, [ready, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] overflow-hidden bg-[#08111C]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,154,43,0.15),transparent_22%),radial-gradient(circle_at_20%_35%,rgba(43,73,112,0.22),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(24,34,49,0.55),transparent_30%),linear-gradient(180deg,#091321_0%,#08111C_42%,#04070D_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[42vh] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-30" />
      <div className="absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full bg-[#C99A2B]/10 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute bottom-[-14vh] left-1/2 h-[42vh] w-[120vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(10,18,30,0.9)_0%,rgba(4,7,13,0)_72%)]" />

      <div className="relative z-[1] flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl [perspective:1800px]">
          <div
            ref={sceneRef}
            className="relative mx-auto flex flex-col items-center text-center [transform-style:preserve-3d]"
          >
            <div
              ref={beamRef}
              className="absolute top-6 h-52 w-px bg-[linear-gradient(180deg,rgba(201,154,43,0),rgba(201,154,43,0.65),rgba(201,154,43,0))] opacity-70 blur-[1px] sm:h-64"
            />

            <div
              ref={glowRef}
              className="absolute top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(201,154,43,0.28),rgba(201,154,43,0.06)_52%,transparent_74%)] blur-2xl sm:h-56 sm:w-56"
            />

            <div className="relative mb-12 flex h-[17rem] w-[17rem] items-center justify-center sm:h-[21rem] sm:w-[21rem]">
              <div
                ref={orbitPrimaryRef}
                className="absolute inset-0 border border-[#C99A2B]/38"
                style={{ transform: "rotateX(72deg) rotateZ(16deg)" }}
              />
              <div
                ref={orbitSecondaryRef}
                className="absolute inset-[1.15rem] border border-white/14"
                style={{ transform: "rotateY(70deg) rotateZ(-12deg)" }}
              />

              <div
                ref={logoShellRef}
                className="relative h-36 w-36 [transform-style:preserve-3d] sm:h-44 sm:w-44"
              >
                <div className="absolute inset-0 translate-z-0 border border-white/10 bg-[linear-gradient(180deg,rgba(18,30,48,0.96),rgba(8,14,24,0.98))] shadow-[0_28px_80px_rgba(0,0,0,0.45)]" />
                <div className="absolute inset-[0.7rem] translate-z-[18px] border border-[#C99A2B]/45 bg-[linear-gradient(180deg,rgba(10,18,30,0.72),rgba(7,12,20,0.94))] sm:inset-[0.9rem]" />
                <div className="absolute inset-[1.3rem] translate-z-[34px] overflow-hidden border border-white/10 bg-[#0B1523] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:inset-[1.55rem]">
                  <Image
                    src="/LOGO.jpeg"
                    alt="Aba Ceylon logo"
                    fill
                    priority
                    sizes="176px"
                    className="object-cover opacity-95"
                  />
                </div>
                <div className="absolute -bottom-3 left-[12%] right-[12%] h-8 translate-z-[-16px] bg-[radial-gradient(ellipse_at_center,rgba(201,154,43,0.18),rgba(201,154,43,0)_72%)] blur-xl" />
              </div>
            </div>

            <div ref={copyRef} className="max-w-2xl">
              <p className="font-cinzel text-[0.72rem] uppercase tracking-[0.42em] text-[#E2C57E] sm:text-[0.82rem]">
                Entering Aba Ceylon
              </p>
              <h1 className="mt-5 font-cinzel text-[2.35rem] leading-[0.95] text-white sm:text-[3.7rem]">
                Journeys with
                <br />
                depth and calm.
              </h1>
              <p
                className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                Loading the real home experience, not a timer.
              </p>

              <div className="mx-auto mt-9 w-full max-w-sm">
                <div className="relative h-[2px] overflow-hidden bg-white/10">
                  <div
                    ref={progressRef}
                    className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,#8B6B1F_0%,#C99A2B_45%,#F3D790_100%)]"
                  />
                  <div
                    ref={progressGlowRef}
                    className="absolute inset-y-[-6px] left-0 w-24 bg-white/80 blur-md"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-3 text-[0.66rem] uppercase tracking-[0.32em] text-white/42 sm:text-[0.72rem]">
                  <span>{Math.round(progressValue * 100)}%</span>
                  <span className="h-px w-7 bg-white/14" />
                  <span>Media</span>
                  <span className="h-px w-7 bg-white/14" />
                  <span>Data</span>
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute bottom-[-2.25rem] left-1/2 h-16 w-[19rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(201,154,43,0.18),rgba(8,17,28,0)_72%)] blur-xl sm:w-[24rem]"
              style={{ transform: "translateX(-50%) rotateX(78deg)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
