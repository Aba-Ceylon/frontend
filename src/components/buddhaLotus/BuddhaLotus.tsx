"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BuddhaLotus() {
  const sectionRef    = useRef<HTMLElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const scrollCueRef  = useRef<HTMLDivElement>(null);
  const scrollDotRef  = useRef<HTMLDivElement>(null);
  const swipeCueRef   = useRef<HTMLDivElement>(null);
  const topBadgeRef   = useRef<HTMLDivElement>(null);
  const leftPanelRef  = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const quoteRef      = useRef<HTMLDivElement>(null);
  const subtitleRef   = useRef<HTMLDivElement>(null);
  const attributesRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video   = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Pause immediately — we scrub manually
    video.pause();

    const ctx = gsap.context(() => {

      // ── Initial states ────────────────────────────────────────────
      gsap.set(quoteRef.current,      { opacity: 0, y: 30 });
      gsap.set(subtitleRef.current,   { opacity: 0, y: 16 });
      gsap.set(topBadgeRef.current,   { opacity: 0, y: -16 });
      gsap.set(leftPanelRef.current,  { opacity: 0, x: -40 });
      gsap.set(rightPanelRef.current, { opacity: 0, x: 40 });
      gsap.set(attributesRef.current, { opacity: 0, y: 16 });
      gsap.set(bottomLineRef.current, { opacity: 0, scaleX: 0 });
      gsap.set(scrollCueRef.current,  { opacity: 1, y: 0 });
      gsap.set(swipeCueRef.current,   { opacity: 1, y: 0 });

      // ── Scroll cue idle bobs ──────────────────────────────────────
      gsap.to(scrollDotRef.current, {
        y: 10, duration: 1.2, repeat: -1, yoyo: true, ease: "power1.inOut",
      });
      gsap.to(scrollCueRef.current, {
        y: 10, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(swipeCueRef.current, {
        y: -10, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      // ── Main scroll timeline ───────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   1,
          fastScrollEnd:      true,
          invalidateOnRefresh: true,
          onUpdate(self) {
            // Scrub video currentTime with scroll progress
            if (video.readyState >= 1) {
              video.currentTime = self.progress * video.duration;
            }
          },
        },
      });

      // Overlay dims as scroll progresses (light → dark)
      tl.fromTo(overlayRef.current,
        { opacity: 0.1 },
        { opacity: 0.55, duration: 1 },
        0,
      );

      // Dismiss cues
      tl.to(scrollCueRef.current,
        { opacity: 0, y: -24, duration: 0.2, ease: "power2.out" }, 0.25);
      tl.to(swipeCueRef.current,
        { opacity: 0, y: -24, duration: 0.2, ease: "power2.out" }, 0.25);

      // Top badge
      tl.to(topBadgeRef.current,  { opacity: 1, y: 0, duration: 0.1 }, 0.05);

      // Side panels
      tl.to(leftPanelRef.current,  { opacity: 1, x: 0, duration: 0.15 }, 0.4);
      tl.to(rightPanelRef.current, { opacity: 1, x: 0, duration: 0.15 }, 0.4);

      // Quote + words
      tl.to(quoteRef.current,      { opacity: 1, y: 0, duration: 0.18 }, 0.55);
      tl.to(attributesRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.68);
      tl.to(subtitleRef.current,   { opacity: 1, y: 0, duration: 0.12 }, 0.76);
      tl.to(bottomLineRef.current,
        { opacity: 1, scaleX: 1, duration: 0.15 }, 0.82);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[245vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-black">

        {/* ── Video layer ─────────────────────────────────────────── */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          src="/videos/output.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* ── Dark overlay — dims as you scroll ───────────────────── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(15,10,5,0.35) 40%, rgba(0,0,0,0.6) 100%)" }}
        />

        {/* ── Texture grid ────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] z-[3]"
          style={{
            backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* ── Corner ornaments ────────────────────────────────────── */}
        {[
          "top-6 left-6",
          "top-6 right-6 scale-x-[-1]",
          "bottom-6 left-6 scale-y-[-1]",
          "bottom-6 right-6 scale-[-1]",
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos} pointer-events-none opacity-40 z-[4]`}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M4 4 L4 20 M4 4 L20 4" stroke="#C99A2B" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="4" cy="4" r="2" fill="#C99A2B" />
              <path d="M14 14 L14 24 M14 14 L24 14" stroke="#C99A2B" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        ))}

        {/* ── Top badge ───────────────────────────────────────────── */}
        <div
          ref={topBadgeRef}
          className="absolute top-5 sm:top-8 left-0 right-0 flex flex-col items-center pointer-events-none z-[5] px-4"
        >
          <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-amber-400/80 mb-3">
            Aba Ceylon &middot; Heritage Journeys
          </p>
          <div className="flex items-center gap-3">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-400/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-400/50" />
          </div>
        </div>

        {/* ── Scroll cue — desktop ────────────────────────────────── */}
        <div
          ref={scrollCueRef}
          className="absolute left-1/2 top-16 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 pointer-events-none z-[8]"
        >
          <div className="rounded-full border border-amber-100/85 bg-slate-950/90 px-6 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.48)] backdrop-blur-md">
            <p className="font-cinzel text-sm tracking-[0.34em] uppercase text-amber-50 whitespace-nowrap drop-shadow-[0_0_18px_rgba(201,154,43,0.35)]">
              Scroll Down to Reveal
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-amber-100/45 bg-slate-950/58 px-5 py-4 shadow-[0_0_40px_rgba(201,154,43,0.28)] backdrop-blur-sm">
            <div className="w-10 h-16 rounded-full border-2 border-amber-50/85 bg-black/45 flex justify-center pt-2.5 shadow-[0_0_24px_rgba(201,154,43,0.28)]">
              <div ref={scrollDotRef} className="w-1.5 h-3.5 rounded-full bg-amber-50 shadow-[0_0_18px_rgba(201,154,43,1)]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-200/75" />
              <div className="flex flex-col items-center gap-1">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 text-amber-50 drop-shadow-[0_0_12px_rgba(201,154,43,0.55)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v12" /><path d="m7 12 5 5 5-5" />
                </svg>
                <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-amber-100/90">Scroll</span>
              </div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-200/75" />
            </div>
          </div>
        </div>

        {/* ── Swipe cue — mobile ──────────────────────────────────── */}
        <div
          ref={swipeCueRef}
          className="absolute left-1/2 top-10 -translate-x-1/2 flex sm:hidden flex-col items-center gap-3 pointer-events-none z-[8]"
        >
          <div className="rounded-full border border-amber-100/85 bg-slate-950/90 px-5 py-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.48)] backdrop-blur-md">
            <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase text-amber-50 whitespace-nowrap drop-shadow-[0_0_18px_rgba(201,154,43,0.35)]">
              Swipe to Reveal
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-[2rem] border border-amber-100/45 bg-slate-950/58 px-5 py-4 shadow-[0_0_40px_rgba(201,154,43,0.28)] backdrop-blur-sm">
            <div className="flex flex-col items-center gap-0.5">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="swipe-chevron-1 w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(201,154,43,0.6)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="swipe-chevron-2 w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(201,154,43,0.7)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="swipe-chevron-3 w-6 h-6 text-amber-400 drop-shadow-[0_0_14px_rgba(201,154,43,0.9)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            </div>
            <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-amber-100/80">Swipe Up</span>
          </div>
        </div>

        {/* ── Left panel ──────────────────────────────────────────── */}
        <div
          ref={leftPanelRef}
          className="absolute left-0 top-0 bottom-0 w-[18%] xl:w-[22%] hidden lg:flex flex-col items-center justify-center gap-8 pointer-events-none px-4 z-[5]"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-400/50 to-amber-400/30" />
            <p className="font-cinzel text-[11px] text-amber-400/70 uppercase" style={{ writingMode: "vertical-rl", letterSpacing: "0.4em" }}>
              Sacred &middot; Ancient
            </p>
            <div className="w-px h-16 bg-gradient-to-t from-transparent via-amber-400/50 to-amber-400/30" />
          </div>
          <div className="border border-amber-400/30 rounded-sm p-4 text-center bg-black/30 backdrop-blur-md w-full max-w-[140px]">
            <p className="font-cinzel text-amber-400/80 text-lg mb-1">&#x1FAB7;</p>
            <p className="font-cinzel text-[10px] tracking-widest uppercase text-amber-100/60 leading-relaxed">
              Nelumbo<br />Nucifera
            </p>
            <div className="w-8 h-px bg-amber-400/30 mx-auto mt-2" />
            <p className="font-cinzel text-[9px] text-amber-100/40 mt-2 leading-relaxed">
              Sacred flower of<br />the Buddha
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {[1, 0.5, 0.3].map((op, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-amber-400" style={{ opacity: op }} />
            ))}
          </div>
          <div className="text-center">
            <p className="font-cinzel text-2xl text-amber-400/60 font-medium">2500</p>
            <p className="font-cinzel text-[9px] tracking-widest uppercase text-amber-100/40">Years of<br />Buddhism</p>
          </div>
        </div>

        {/* ── Right panel ─────────────────────────────────────────── */}
        <div
          ref={rightPanelRef}
          className="absolute right-0 top-0 bottom-0 w-[18%] xl:w-[22%] hidden lg:flex flex-col items-center justify-center gap-8 pointer-events-none px-4 z-[5]"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-rose-300/50 to-rose-300/30" />
            <p className="font-cinzel text-[11px] text-rose-300/70 uppercase" style={{ writingMode: "vertical-rl", letterSpacing: "0.4em" }}>
              Purity &middot; Peace
            </p>
            <div className="w-px h-16 bg-gradient-to-t from-transparent via-rose-300/50 to-rose-300/30" />
          </div>
          <div className="border border-rose-300/25 rounded-sm p-4 text-center bg-black/30 backdrop-blur-md w-full max-w-[140px]">
            <p className="font-cinzel text-rose-300/80 text-lg mb-1">&#x2638;</p>
            <p className="font-cinzel text-[10px] tracking-widest uppercase text-rose-100/60 leading-relaxed">
              Dhamma<br />Chakra
            </p>
            <div className="w-8 h-px bg-rose-300/30 mx-auto mt-2" />
            <p className="font-cinzel text-[9px] text-rose-100/40 mt-2 leading-relaxed">
              Wheel of the<br />Dharma
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {[0.3, 0.5, 1].map((op, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-rose-300" style={{ opacity: op }} />
            ))}
          </div>
          <div className="text-center">
            <p className="font-cinzel text-2xl text-rose-300/60 font-medium">8</p>
            <p className="font-cinzel text-[9px] tracking-widest uppercase text-rose-100/40">Noble<br />Petals</p>
          </div>
        </div>

        {/* ── Quote + attributes ──────────────────────────────────── */}
        <div className="absolute bottom-12 sm:bottom-20 left-0 right-0 flex flex-col items-center gap-3 sm:gap-4 z-[5] pointer-events-none px-4">
          <div ref={quoteRef} className="text-center px-4 max-w-xl">
            <p className="font-cinzel text-lg md:text-2xl text-amber-50/90 leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              &ldquo;Just as the lotus rises from muddy waters,
              <br />
              <span className="text-amber-400">Sri Lanka rises in timeless beauty.&rdquo;</span>
            </p>
          </div>
          <div ref={attributesRef} className="flex items-center gap-4 sm:gap-10">
            {["Purity", "Enlightenment", "Rebirth"].map((word, i) => (
              <div key={i} className="text-center">
                <div className="w-1 h-1 rounded-full bg-amber-400/70 mx-auto mb-1.5" />
                <p className="font-cinzel text-[10px] text-amber-100/50 tracking-[0.25em] uppercase">{word}</p>
              </div>
            ))}
          </div>
          <div ref={subtitleRef} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 sm:w-12 h-px bg-amber-400/40" />
              <div className="w-1 h-1 rounded-full bg-amber-400/70" />
              <div className="w-1 h-1 rounded-full bg-rose-300/70" />
              <div className="w-1 h-1 rounded-full bg-amber-400/70" />
              <div className="w-8 sm:w-12 h-px bg-amber-400/40" />
            </div>
            <p className="font-cinzel text-[9px] sm:text-[10px] text-amber-100/40 tracking-[0.22em] sm:tracking-[0.3em] uppercase">
              The Sacred Lotus Symbol of Purity &amp; Enlightenment
            </p>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div
          ref={bottomLineRef}
          className="absolute bottom-6 sm:bottom-8 left-0 right-0 hidden sm:flex items-center justify-center gap-4 pointer-events-none z-[5]"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div className="w-32 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
          <span className="font-cinzel text-amber-400/50 text-xs">+++</span>
          <p className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-amber-100/40">
            Aba Ceylon Tours &amp; Travels
          </p>
          <span className="font-cinzel text-amber-400/50 text-xs">+++</span>
          <div className="w-32 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>

      </div>
    </section>
  );
}
