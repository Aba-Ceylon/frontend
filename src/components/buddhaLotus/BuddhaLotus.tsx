"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PETAL_PATH =
  "M30 100 C20 100, 4 80, 2 58 C0 38, 10 16, 30 2 C50 16, 60 38, 58 58 C56 80, 40 100, 30 100 Z";
const INNER_PETAL_PATH =
  "M30 100 C22 100, 8 82, 6 62 C4 44, 14 22, 30 8 C46 22, 56 44, 54 62 C52 82, 38 100, 30 100 Z";

const LAYER_DEFS = [
  {
    count: 8,
    pw: 22,
    ph: 52,
    path: INNER_PETAL_PATH,
    offset: 0,
    zIndex: 5,
    from: "#C8960C",
    to: "#F0D060",
  },
  {
    count: 10,
    pw: 28,
    ph: 68,
    path: PETAL_PATH,
    offset: 18,
    zIndex: 4,
    from: "#C99A2B",
    to: "#F5E090",
  },
  {
    count: 12,
    pw: 34,
    ph: 82,
    path: PETAL_PATH,
    offset: 8,
    zIndex: 3,
    from: "#EDD98A",
    to: "#FFF8F0",
  },
  {
    count: 14,
    pw: 38,
    ph: 94,
    path: PETAL_PATH,
    offset: 4,
    zIndex: 2,
    from: "#F8EED0",
    to: "#FFFFFF",
  },
  {
    count: 16,
    pw: 40,
    ph: 102,
    path: PETAL_PATH,
    offset: 11,
    zIndex: 1,
    from: "#F5F0E8",
    to: "#FFFFFF",
  },
];

const PETALS = LAYER_DEFS.flatMap((layer, li) =>
  Array.from({ length: layer.count }, (_, pi) => {
    const angle = (360 / layer.count) * pi + layer.offset;
    return {
      li,
      pi,
      angle,
      w: layer.pw,
      h: layer.ph,
      path: layer.path,
      left: `calc(50% - ${layer.pw / 2}px)`,
      top: `calc(50% - ${layer.ph}px)`,
      zIndex: layer.zIndex,
      from: layer.from,
      to: layer.to,
      filter: `drop-shadow(0 0 4px ${layer.from}88)`,
      gradId: `pg-${li}-${pi}`,
    };
  }),
);

const STAMEN_DOTS = Array.from({ length: 12 }, (_, i) => {
  const rad = (Math.PI / 180) * (30 * i);
  const x = Math.round(Math.sin(rad) * 28 * 100) / 100;
  const y = Math.round(-Math.cos(rad) * 28 * 100) / 100;
  return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` };
});

const STAMEN_INNER = Array.from({ length: 8 }, (_, i) => {
  const rad = (Math.PI / 180) * (45 * i + 22);
  const x = Math.round(Math.sin(rad) * 18 * 100) / 100;
  const y = Math.round(-Math.cos(rad) * 18 * 100) / 100;
  return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` };
});

const MANDALA_TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (360 / 24) * i;
  const rad = (angle * Math.PI) / 180;
  const r1 = 195;
  const r2 = i % 6 === 0 ? 210 : i % 2 === 0 ? 205 : 200;
  return {
    x1: Math.round(Math.sin(rad) * r1 * 100) / 100,
    y1: Math.round(-Math.cos(rad) * r1 * 100) / 100,
    x2: Math.round(Math.sin(rad) * r2 * 100) / 100,
    y2: Math.round(-Math.cos(rad) * r2 * 100) / 100,
    major: i % 6 === 0,
  };
});

export default function BuddhaLotus() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lotusRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const scrollDotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowRoseRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const topBadgeRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const attributesRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const mandalaRef = useRef<SVGSVGElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const allPetals = lotusRef.current
        ? Array.from(
            lotusRef.current.querySelectorAll<SVGElement>(".lotus-petal-svg"),
          )
        : [];

      const layerPetals: SVGElement[][] = LAYER_DEFS.map((_, li) =>
        allPetals.filter((p) => p.dataset.layer === String(li)),
      );

      gsap.set(allPetals, {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 100%",
      });
      gsap.set(glowRef.current, { scale: 0, opacity: 0 });
      gsap.set(glowRoseRef.current, { scale: 0, opacity: 0 });
      gsap.set(quoteRef.current, { opacity: 0, y: 30 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 16 });
      gsap.set(topBadgeRef.current, { opacity: 0, y: -16 });
      gsap.set(leftPanelRef.current, { opacity: 0, x: -40 });
      gsap.set(rightPanelRef.current, { opacity: 0, x: 40 });
      gsap.set(attributesRef.current, { opacity: 0, y: 16 });
      gsap.set([ring1Ref.current, ring2Ref.current], { scale: 0, opacity: 0 });
      gsap.set(mandalaRef.current, {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(centerRef.current, { scale: 0, opacity: 0 });
      gsap.set(bottomLineRef.current, { opacity: 0, scaleX: 0 });
      gsap.set(bgOverlayRef.current, { opacity: 0 });
      gsap.set(lotusRef.current, { scale: 0.35, transformOrigin: "50% 50%" });
      gsap.set(scrollCueRef.current, { opacity: 1, y: 0 });

      if (scrollDotRef.current) {
        gsap.to(scrollDotRef.current, {
          y: 10,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      if (scrollCueRef.current) {
        gsap.to(scrollCueRef.current, {
          y: 10,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // 0Ã¢â‚¬â€œ100%: background darkens, glass blur intensifies
      tl.to(bgOverlayRef.current, { opacity: 1, duration: 1 }, 0);
      tl.to(
        glassRef.current,
        {
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background: "rgba(26, 34, 56, 0.15)",
          duration: 1,
        },
        0,
      );

      // 0%: ambient + glow
      tl.to(topBadgeRef.current, { opacity: 1, y: 0, duration: 0.08 }, 0);
      tl.to(glowRef.current, { scale: 1, opacity: 1, duration: 0.08 }, 0);
      tl.to(
        centerRef.current,
        { scale: 1, opacity: 1, duration: 0.06, ease: "back.out(2)" },
        0.02,
      );
      tl.to(
        scrollCueRef.current,
        { opacity: 0, y: -24, duration: 0.2, ease: "power2.out" },
        0.32,
      );

      // 0Ã¢â‚¬â€œ55%: lotus grows small Ã¢â€ â€™ large
      tl.to(
        lotusRef.current,
        {
          scale: 1.45,
          duration: 0.55,
          ease: "power2.out",
          transformOrigin: "50% 50%",
        },
        0,
      );

      // 2Ã¢â‚¬â€œ50%: petals bloom layer by layer
      layerPetals.forEach((petals, li) => {
        const layerStart = 0.02 + li * 0.11;
        petals.forEach((petal, pi) => {
          tl.to(
            petal,
            { scale: 1, opacity: 1, duration: 0.06, ease: "back.out(1.6)" },
            layerStart + pi * (0.08 / petals.length),
          );
        });
      });

      // 55Ã¢â‚¬â€œ70%: lotus settles, side panels slide in
      tl.to(
        lotusRef.current,
        {
          scale: 1.15,
          duration: 0.15,
          ease: "power2.inOut",
          transformOrigin: "50% 50%",
        },
        0.55,
      );
      tl.to(leftPanelRef.current, { opacity: 1, x: 0, duration: 0.12 }, 0.52);
      tl.to(rightPanelRef.current, { opacity: 1, x: 0, duration: 0.12 }, 0.52);

      // 45Ã¢â‚¬â€œ65%: mandala + rings, glow shifts gold Ã¢â€ â€™ rose
      tl.to(
        mandalaRef.current,
        { scale: 1, opacity: 1, duration: 0.15, ease: "power2.out" },
        0.45,
      );
      tl.to(ring1Ref.current, { scale: 1, opacity: 0.5, duration: 0.1 }, 0.5);
      tl.to(ring2Ref.current, { scale: 1, opacity: 0.25, duration: 0.1 }, 0.55);
      tl.to(glowRef.current, { opacity: 0, scale: 1.3, duration: 0.2 }, 0.46);
      tl.to(glowRoseRef.current, { scale: 1, opacity: 1, duration: 0.2 }, 0.46);

      // 48Ã¢â‚¬â€œ68%: color shift outer layers Ã¢â€ â€™ white
      layerPetals.slice(2).forEach((petals, li) => {
        const shiftStart = 0.48 + li * 0.05;
        const colorTo = LAYER_DEFS[li + 2].to;
        petals.forEach((petal) => {
          const stop = petal.querySelector("stop:last-child");
          if (stop)
            tl.to(
              stop,
              { attr: { stopColor: colorTo }, duration: 0.16 },
              shiftStart,
            );
        });
      });

      // 65Ã¢â‚¬â€œ85%: text fades in
      tl.to(topBadgeRef.current, { opacity: 1, y: 0, duration: 0.08 }, 0.65);
      tl.to(quoteRef.current, { opacity: 1, y: 0, duration: 0.14 }, 0.65);
      tl.to(attributesRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.74);
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.8);
      tl.to(
        bottomLineRef.current,
        { opacity: 1, scaleX: 1, duration: 0.15 },
        0.82,
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[245vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{
          background:
            "linear-gradient(160deg, #f9f5ee 0%, #f5f0e8 40%, #fdf6f0 100%)",
        }}
      >
        {/* Dark overlay */}
        <div
          ref={bgOverlayRef}
          className="absolute inset-0 pointer-events-none z-0"
          style={{ backgroundColor: "#1A2238" }}
        />

        {/* Frosted glass */}
        <div
          ref={glassRef}
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backdropFilter: "blur(0px)",
            WebkitBackdropFilter: "blur(0px)",
            background: "rgba(26, 34, 56, 0.08)",
          }}
        />

        {/* Texture grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] z-[2]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Corner ornaments */}
        {[
          "top-6 left-6",
          "top-6 right-6 scale-x-[-1]",
          "bottom-6 left-6 scale-y-[-1]",
          "bottom-6 right-6 scale-[-1]",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} pointer-events-none opacity-40 z-[3]`}
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

        {/* Top badge */}
        <div
          ref={topBadgeRef}
          className="absolute top-5 sm:top-8 left-0 right-0 flex flex-col items-center pointer-events-none z-[3] px-4"
        >
          <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-amber-400/80 mb-3">
            Aba Ceylon Ã‚Â· Heritage Journeys
          </p>
          <div className="flex items-center gap-3">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-400/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <span className="font-cinzel text-amber-600/50 text-xs">
              Ã¢Å“Â¦
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-400/50" />
          </div>
        </div>

        {/* Scroll cue */}
        <div
          ref={scrollCueRef}
          className="absolute left-1/2 top-10 sm:top-16 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-[8]"
        >
          <div className="rounded-full border border-amber-100/85 bg-slate-950/90 px-6 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.48)] backdrop-blur-md">
            <p className="font-cinzel text-xs sm:text-sm tracking-[0.34em] uppercase text-amber-50 whitespace-nowrap drop-shadow-[0_0_18px_rgba(201,154,43,0.35)]">
              Scroll Down to Reveal
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-amber-100/45 bg-slate-950/58 px-5 py-4 shadow-[0_0_40px_rgba(201,154,43,0.28)] backdrop-blur-sm">
            <div className="w-10 h-16 rounded-full border-2 border-amber-50/85 bg-black/45 flex justify-center pt-2.5 shadow-[0_0_24px_rgba(201,154,43,0.28)]">
              <div
                ref={scrollDotRef}
                className="w-1.5 h-3.5 rounded-full bg-amber-50 shadow-[0_0_18px_rgba(201,154,43,1)]"
              />
            </div>
            <div className="flex items-center gap-3 [&>span]:hidden">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-200/75" />
              <div className="flex flex-col items-center gap-1">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-amber-50 drop-shadow-[0_0_12px_rgba(201,154,43,0.55)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v12" />
                  <path d="m7 12 5 5 5-5" />
                </svg>
                <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-amber-100/90">
                  Scroll
                </span>
              </div>
              <span className="font-cinzel text-amber-100 text-sm drop-shadow-[0_0_10px_rgba(201,154,43,0.45)]">
                Ã¢â€ â€œ
              </span>
              <span className="font-cinzel text-amber-200/80 text-xs">
                Ã¢Å’â€ž
              </span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-200/75" />
            </div>
          </div>
        </div>

        {/* Left panel */}
        <div
          ref={leftPanelRef}
          className="absolute left-0 top-0 bottom-0 w-[18%] xl:w-[22%] hidden lg:flex flex-col items-center justify-center gap-8 pointer-events-none px-4 z-[3]"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-400/50 to-amber-400/30" />
            <p
              className="font-cinzel text-[11px] text-amber-400/70 uppercase"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.4em" }}
            >
              Sacred Ã‚Â· Ancient
            </p>
            <div className="w-px h-16 bg-gradient-to-t from-transparent via-amber-400/50 to-amber-400/30" />
          </div>
          <div className="border border-amber-400/30 rounded-sm p-4 text-center bg-white/5 backdrop-blur-md w-full max-w-[140px]">
            <p className="font-cinzel text-amber-400/80 text-lg mb-1">🪷</p>
            <p className="font-cinzel text-[10px] tracking-widest uppercase text-amber-100/60 leading-relaxed">
              Nelumbo
              <br />
              Nucifera
            </p>
            <div className="w-8 h-px bg-amber-400/30 mx-auto mt-2" />
            <p className="font-cinzel text-[9px] text-amber-100/40 mt-2 leading-relaxed">
              Sacred flower of
              <br />
              the Buddha
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {[1, 0.5, 0.3].map((op, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-amber-400"
                style={{ opacity: op }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="font-cinzel text-2xl text-amber-400/60 font-medium">
              2500
            </p>
            <p className="font-cinzel text-[9px] tracking-widest uppercase text-amber-100/40">
              Years of
              <br />
              Buddhism
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div
          ref={rightPanelRef}
          className="absolute right-0 top-0 bottom-0 w-[18%] xl:w-[22%] hidden lg:flex flex-col items-center justify-center gap-8 pointer-events-none px-4 z-[3]"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-rose-300/50 to-rose-300/30" />
            <p
              className="font-cinzel text-[11px] text-rose-300/70 uppercase"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.4em" }}
            >
              Purity Ã‚Â· Peace
            </p>
            <div className="w-px h-16 bg-gradient-to-t from-transparent via-rose-300/50 to-rose-300/30" />
          </div>
          <div className="border border-rose-300/25 rounded-sm p-4 text-center bg-white/5 backdrop-blur-md w-full max-w-[140px]">
            <p className="font-cinzel text-rose-300/80 text-lg mb-1">☸</p>
            <p className="font-cinzel text-[10px] tracking-widest uppercase text-rose-100/60 leading-relaxed">
              Dhamma
              <br />
              Chakra
            </p>
            <div className="w-8 h-px bg-rose-300/30 mx-auto mt-2" />
            <p className="font-cinzel text-[9px] text-rose-100/40 mt-2 leading-relaxed">
              Wheel of the
              <br />
              Dharma
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {[0.3, 0.5, 1].map((op, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-rose-300"
                style={{ opacity: op }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="font-cinzel text-2xl text-rose-300/60 font-medium">
              8
            </p>
            <p className="font-cinzel text-[9px] tracking-widest uppercase text-rose-100/40">
              Noble
              <br />
              Petals
            </p>
          </div>
        </div>

        {/* Center Ã¢â‚¬â€ lotus absolutely centered */}
        <div className="absolute inset-0 flex items-center justify-center z-[3] pointer-events-none scale-[0.58] sm:scale-[0.76] md:scale-[0.9] lg:scale-100">
          {/* Glows */}
          <div
            ref={glowRef}
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.12) 55%, transparent 78%)",
              filter: "blur(36px)",
            }}
          />
          <div
            ref={glowRoseRef}
            className="absolute w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,182,193,0.4) 0%, rgba(255,192,203,0.1) 55%, transparent 78%)",
              filter: "blur(40px)",
            }}
          />

          {/* Mandala */}
          <svg
            ref={mandalaRef}
            className="absolute pointer-events-none"
            width="560"
            height="560"
            viewBox="-280 -280 560 560"
            style={{ transformOrigin: "50% 50%" }}
          >
            <circle
              cx="0"
              cy="0"
              r="255"
              fill="none"
              stroke="rgba(212,175,55,0.15)"
              strokeWidth="0.5"
            />
            <circle
              cx="0"
              cy="0"
              r="272"
              fill="none"
              stroke="rgba(212,175,55,0.08)"
              strokeWidth="0.5"
            />
            {MANDALA_TICKS.map((t, i) => (
              <line
                key={i}
                x1={t.x1 * 1.31}
                y1={t.y1 * 1.31}
                x2={t.x2 * 1.31}
                y2={t.y2 * 1.31}
                stroke={
                  t.major ? "rgba(212,175,55,0.45)" : "rgba(212,175,55,0.18)"
                }
                strokeWidth={t.major ? 1.5 : 0.8}
                strokeLinecap="round"
              />
            ))}
            {Array.from({ length: 8 }, (_, i) => {
              const a = (45 * i * Math.PI) / 180;
              const cx = Math.round(Math.sin(a) * 272 * 100) / 100;
              const cy = Math.round(-Math.cos(a) * 272 * 100) / 100;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={i % 2 === 0 ? 3 : 2}
                  fill="rgba(212,175,55,0.35)"
                />
              );
            })}
          </svg>

          {/* Rings */}
          <div
            ref={ring2Ref}
            className="absolute w-[580px] h-[580px] rounded-full border border-rose-300/15 pointer-events-none"
          />
          <div
            ref={ring1Ref}
            className="absolute w-[480px] h-[480px] rounded-full border border-amber-400/20 pointer-events-none"
          />

          {/* Lotus */}
          <div
            ref={lotusRef}
            className="relative flex items-center justify-center"
            style={{ width: 460, height: 460, isolation: "isolate" }}
          >
            {PETALS.map((p) => (
              <svg
                key={p.gradId}
                data-layer={p.li}
                className="lotus-petal-svg absolute"
                viewBox="0 0 60 100"
                style={{
                  width: p.w,
                  height: p.h,
                  left: p.left,
                  top: p.top,
                  transform: `rotate(${p.angle}deg)`,
                  transformOrigin: "50% 100%",
                  zIndex: p.zIndex,
                  filter: p.filter,
                }}
              >
                <defs>
                  <linearGradient id={p.gradId} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={p.from} stopOpacity="1" />
                    <stop offset="45%" stopColor={p.from} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={p.to} stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                <path
                  d={p.path}
                  fill={`url(#${p.gradId})`}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="0.5"
                />
                <line
                  x1="30"
                  y1="15"
                  x2="30"
                  y2="88"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="0.6"
                />
              </svg>
            ))}

            {/* Stamen */}
            <div
              ref={centerRef}
              className="absolute z-20"
              style={{
                width: 72,
                height: 72,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {STAMEN_DOTS.map((dot, i) => (
                <div
                  key={`o${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background:
                      "radial-gradient(circle at 40% 30%, #fff9c4, #f9a825)",
                    top: "50%",
                    left: "50%",
                    transform: dot.transform,
                    boxShadow: "0 0 3px rgba(249,168,37,0.9)",
                  }}
                />
              ))}
              {STAMEN_INNER.map((dot, i) => (
                <div
                  key={`in${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    background:
                      "radial-gradient(circle at 40% 30%, #fff9c4, #f57f17)",
                    top: "50%",
                    left: "50%",
                    transform: dot.transform,
                    boxShadow: "0 0 3px rgba(245,127,23,0.9)",
                  }}
                />
              ))}
              <div
                className="absolute rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle at 38% 32%, #fff9c4 0%, #f9c74f 40%, #e65100 100%)",
                  boxShadow:
                    "0 0 0 3px rgba(249,199,79,0.4), 0 0 20px 8px rgba(212,175,55,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Quote + attributes */}
        <div className="absolute bottom-12 sm:bottom-20 left-0 right-0 flex flex-col items-center gap-3 sm:gap-4 z-[3] pointer-events-none px-4">
          <div ref={quoteRef} className="text-center px-4 max-w-xl">
            <p className="font-cinzel text-lg md:text-2xl text-amber-50/90 leading-relaxed tracking-wide">
              &ldquo;Just as the lotus rises from muddy waters,
              <br />
              <span className="text-amber-400">
                Sri Lanka rises in timeless beauty.&rdquo;
              </span>
            </p>
          </div>
          <div
            ref={attributesRef}
            className="flex items-center gap-4 sm:gap-10"
          >
            {["Purity", "Enlightenment", "Rebirth"].map((word, i) => (
              <div key={i} className="text-center">
                <div className="w-1 h-1 rounded-full bg-amber-400/70 mx-auto mb-1.5" />
                <p className="font-cinzel text-[10px] text-amber-100/50 tracking-[0.25em] uppercase">
                  {word}
                </p>
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

        {/* Bottom bar */}
        <div
          ref={bottomLineRef}
          className="absolute bottom-6 sm:bottom-8 left-0 right-0 hidden sm:flex items-center justify-center gap-4 pointer-events-none z-[3]"
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
