"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cloudinaryVideos } from "@/config/media";

gsap.registerPlugin(ScrollTrigger);

const END_EPSILON = 0.08;

function getInitialVideoEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const videoProbe = document.createElement("video");
  const canPlayVideo =
    typeof videoProbe.canPlayType === "function" &&
    ["video/webm", "video/mp4"].some(
      (type) => videoProbe.canPlayType(type).replace(/no/i, "") !== "",
    );

  return canPlayVideo && !prefersReducedMotion;
}

export default function BuddhaLotus() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaShellRef = useRef<HTMLDivElement>(null);
  const topBadgeRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const attributesRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoEnabled = getInitialVideoEnabled();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;

    if (!section || !stage) {
      return;
    }

    let cleanup: (() => void) | undefined;

    const buildScrollExperience = (withVideo: boolean) => {
      cleanup?.();
      if (withVideo && video) {
        video.pause();
      }

      const ctx = gsap.context(() => {
        gsap.set(mediaShellRef.current, { scale: 0.94, yPercent: 8, autoAlpha: 0 });
        gsap.set(quoteRef.current, { opacity: 0, y: 34 });
        gsap.set(subtitleRef.current, { opacity: 0, y: 18 });
        gsap.set(topBadgeRef.current, { opacity: 0, y: -18 });
        gsap.set(leftPanelRef.current, { opacity: 0, x: -48 });
        gsap.set(rightPanelRef.current, { opacity: 0, x: 48 });
        gsap.set(attributesRef.current, { opacity: 0, y: 18 });
        gsap.set(bottomLineRef.current, { opacity: 0, scaleX: 0.72 });
        gsap.set(overlayRef.current, { opacity: 0.1 });
        if (withVideo && video) {
          gsap.set(video, { currentTime: 0.001 });
        }

        const chapterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: stage,
            start: "top top",
            end: "+=360%",
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        chapterTimeline
          .to(
            mediaShellRef.current,
            {
              autoAlpha: 1,
              scale: 1.01,
              yPercent: 0,
              ease: "power2.out",
              duration: 0.16,
            },
            0,
          )
          .to(
            overlayRef.current,
            {
              opacity: 0.2,
              ease: "none",
              duration: 0.14,
            },
            0,
          )
          .to(topBadgeRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.14)
          .to(leftPanelRef.current, { opacity: 1, x: 0, duration: 0.14 }, 0.28)
          .to(rightPanelRef.current, { opacity: 1, x: 0, duration: 0.14 }, 0.28)
          .to(
            mediaShellRef.current,
            {
              scale: 1.09,
              yPercent: -4,
              ease: "none",
              duration: 0.78,
            },
            0.18,
          )
          .to(
            overlayRef.current,
            { opacity: 0.62, ease: "none", duration: 0.78 },
            0.18,
          )
          .to(quoteRef.current, { opacity: 1, y: 0, duration: 0.14 }, 0.44)
          .to(attributesRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.56)
          .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.64)
          .to(
            bottomLineRef.current,
            { opacity: 1, scaleX: 1, duration: 0.12 },
            0.72,
          );

        if (withVideo && video) {
          chapterTimeline.to(
            video,
            {
              currentTime: Math.max(video.duration - END_EPSILON, 0.001),
              ease: "none",
              duration: 0.78,
            },
            0.18,
          );
        }
      }, sectionRef);

      cleanup = () => ctx.revert();
    };

    if (!videoEnabled || !video) {
      buildScrollExperience(false);
      return () => {
        cleanup?.();
      };
    }

    if (video.readyState >= 1) {
      buildScrollExperience(true);
    } else {
      const handleReady = () => buildScrollExperience(true);
      const handleError = () => buildScrollExperience(false);

      video.addEventListener("loadedmetadata", handleReady, { once: true });
      video.addEventListener("error", handleError, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", handleReady);
        video.removeEventListener("error", handleError);
        cleanup?.();
      };
    }

    return () => {
      cleanup?.();
    };
  }, [videoEnabled]);

  return (
    <section ref={sectionRef} className="relative w-full bg-black">
      <div
        ref={stageRef}
        className="flex h-[100svh] items-center justify-center overflow-hidden bg-black"
      >
        <div
          ref={mediaShellRef}
          className="absolute inset-0 z-[1] overflow-hidden will-change-transform"
        >
          {videoEnabled ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload="auto"
              poster="/beach.jpg"
              aria-hidden="true"
              disablePictureInPicture
              src={cloudinaryVideos.lotus.url}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,154,43,0.18),transparent_24%),linear-gradient(180deg,#0A0C10_0%,#15100B_38%,#05070A_100%)]" />
          )}
        </div>

        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(15,10,5,0.26) 34%, rgba(0,0,0,0.68) 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-[3] opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {[
          "top-6 left-6",
          "top-6 right-6 scale-x-[-1]",
          "bottom-6 left-6 scale-y-[-1]",
          "bottom-6 right-6 scale-[-1]",
        ].map((pos, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute ${pos} z-[4] opacity-40`}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path
                d="M4 4 L4 20 M4 4 L20 4"
                stroke="#C99A2B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="4" cy="4" r="2" fill="#C99A2B" />
              <path
                d="M14 14 L14 24 M14 14 L24 14"
                stroke="#C99A2B"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>
        ))}

        <div
          ref={topBadgeRef}
          className="pointer-events-none absolute left-0 right-0 top-5 z-[5] flex flex-col items-center px-4 sm:top-8"
        >
          <p className="mb-3 font-cinzel text-[10px] uppercase tracking-[0.5em] text-amber-400/80">
            Aba Ceylon | Heritage Journeys
          </p>
          <div className="flex items-center gap-3">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-400/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-400/50" />
          </div>
        </div>

        <div
          ref={leftPanelRef}
          className="pointer-events-none absolute bottom-0 left-0 top-0 z-[5] hidden w-[18%] flex-col items-center justify-center gap-8 px-4 lg:flex xl:w-[22%]"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-amber-400/50 to-amber-400/30" />
            <p
              className="font-cinzel text-[11px] uppercase text-amber-400/70"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.4em" }}
            >
              Sacred | Ancient
            </p>
            <div className="h-16 w-px bg-gradient-to-t from-transparent via-amber-400/50 to-amber-400/30" />
          </div>
          <div className="w-full max-w-[140px] rounded-sm border border-amber-400/30 bg-black/30 p-4 text-center backdrop-blur-md">
            <p className="mb-1 font-cinzel text-lg text-amber-400/80">&#x1FAB7;</p>
            <p className="font-cinzel text-[10px] uppercase tracking-widest text-amber-100/60 leading-relaxed">
              Nelumbo
              <br />
              Nucifera
            </p>
            <div className="mx-auto mt-2 h-px w-8 bg-amber-400/30" />
            <p className="mt-2 font-cinzel text-[9px] text-amber-100/40 leading-relaxed">
              Sacred flower of
              <br />
              the Buddha
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {[1, 0.5, 0.3].map((op, i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full bg-amber-400"
                style={{ opacity: op }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="font-cinzel text-2xl font-medium text-amber-400/60">
              2500
            </p>
            <p className="font-cinzel text-[9px] uppercase tracking-widest text-amber-100/40">
              Years of
              <br />
              Buddhism
            </p>
          </div>
        </div>

        <div
          ref={rightPanelRef}
          className="pointer-events-none absolute bottom-0 right-0 top-0 z-[5] hidden w-[18%] flex-col items-center justify-center gap-8 px-4 lg:flex xl:w-[22%]"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-rose-300/50 to-rose-300/30" />
            <p
              className="font-cinzel text-[11px] uppercase text-rose-300/70"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.4em" }}
            >
              Purity | Peace
            </p>
            <div className="h-16 w-px bg-gradient-to-t from-transparent via-rose-300/50 to-rose-300/30" />
          </div>
          <div className="w-full max-w-[140px] rounded-sm border border-rose-300/25 bg-black/30 p-4 text-center backdrop-blur-md">
            <p className="mb-1 font-cinzel text-lg text-rose-300/80">&#x2638;</p>
            <p className="font-cinzel text-[10px] uppercase tracking-widest text-rose-100/60 leading-relaxed">
              Dhamma
              <br />
              Chakra
            </p>
            <div className="mx-auto mt-2 h-px w-8 bg-rose-300/30" />
            <p className="mt-2 font-cinzel text-[9px] text-rose-100/40 leading-relaxed">
              Wheel of the
              <br />
              Dharma
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {[0.3, 0.5, 1].map((op, i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full bg-rose-300"
                style={{ opacity: op }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="font-cinzel text-2xl font-medium text-rose-300/60">8</p>
            <p className="font-cinzel text-[9px] uppercase tracking-widest text-rose-100/40">
              Noble
              <br />
              Petals
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-12 left-0 right-0 z-[5] flex flex-col items-center gap-3 px-4 sm:bottom-20 sm:gap-4">
          <div ref={quoteRef} className="max-w-xl px-4 text-center">
            <p className="font-cinzel text-lg leading-relaxed tracking-wide text-amber-50/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-2xl">
              &ldquo;Just as the lotus rises from muddy waters,
              <br />
              <span className="text-amber-400">
                Sri Lanka rises in timeless beauty.&rdquo;
              </span>
            </p>
          </div>
          <div ref={attributesRef} className="flex items-center gap-4 sm:gap-10">
            {["Purity", "Enlightenment", "Rebirth"].map((word, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-1.5 h-1 w-1 rounded-full bg-amber-400/70" />
                <p className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-amber-100/50">
                  {word}
                </p>
              </div>
            ))}
          </div>
          <div ref={subtitleRef} className="text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-amber-400/40 sm:w-12" />
              <div className="h-1 w-1 rounded-full bg-amber-400/70" />
              <div className="h-1 w-1 rounded-full bg-rose-300/70" />
              <div className="h-1 w-1 rounded-full bg-amber-400/70" />
              <div className="h-px w-8 bg-amber-400/40 sm:w-12" />
            </div>
            <p className="font-cinzel text-[9px] uppercase tracking-[0.22em] text-amber-100/40 sm:text-[10px] sm:tracking-[0.3em]">
              The Sacred Lotus Symbol of Purity &amp; Enlightenment
            </p>
          </div>
        </div>

        <div
          ref={bottomLineRef}
          className="pointer-events-none absolute bottom-6 left-0 right-0 z-[5] hidden items-center justify-center gap-4 sm:bottom-8 sm:flex"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent to-amber-400/40" />
          <span className="font-cinzel text-xs text-amber-400/50">+++</span>
          <p className="font-cinzel text-[9px] uppercase tracking-[0.4em] text-amber-100/40">
            Aba Ceylon Tours &amp; Travels
          </p>
          <span className="font-cinzel text-xs text-amber-400/50">+++</span>
          <div className="h-px w-32 bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>
      </div>
    </section>
  );
}
