"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useLoaderGate, useLoaderProgress } from "./LoaderGate";

const words = ["Discover", "Explore", "Journey"];
const EXIT_DELAY_MS = 450;

export default function HomeEntryLoader() {
  const reduce = useReducedMotion();
  const ready = useLoaderGate();
  const progress = useLoaderProgress();
  const [isVisible, setIsVisible] = useState(() => !ready);
  const [wordIndex, setWordIndex] = useState(0);

  const count = Math.round(progress * 100);

  useEffect(() => {
    if (!isVisible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  useEffect(() => {
    if (!ready || !isVisible) return;

    const exitTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, EXIT_DELAY_MS);

    return () => window.clearTimeout(exitTimer);
  }, [ready, isVisible]);

  useEffect(() => {
    if (!isVisible || reduce) return;

    const wordTimer = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 900);

    return () => window.clearInterval(wordTimer);
  }, [isVisible, reduce]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-120 flex flex-col items-center justify-center bg-[#182231]"
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.4 : 1, ease: [0.83, 0, 0.17, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading Aba Ceylon Tours and Travels"
        >
          {/* aurora wash */}
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,154,43,0.35),transparent_60%)] blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <div className="h-9 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={wordIndex}
                  initial={reduce ? false : { y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: -30, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-cinzel block text-xs uppercase tracking-[0.28em] text-[#c99a2b]"
                >
                  {words[wordIndex]}.
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="aba-ceylon-loader-fill font-cinzel text-[13vw] font-bold uppercase leading-none tracking-[0.04em] md:text-[6rem]">
              Aba Ceylon
            </div>
          </div>

          <div className="absolute bottom-8 right-6 font-cinzel text-5xl font-bold tabular-nums text-[#f7f2e7] md:bottom-12 md:right-12 md:text-7xl">
            {count}
            <span className="text-[#c99a2b]">%</span>
          </div>

          <div className="absolute bottom-0 left-0 h-0.75 w-full bg-white/10">
            <motion.div
              className="h-full"
              style={{
                width: `${count}%`,
                background:
                  "linear-gradient(90deg, var(--royal-gold), var(--antique-bronze))",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
