"use client";

import { useEffect, useState } from "react";
import { useLoaderGate } from "./LoaderGate";

const EXIT_DURATION_MS = 450;

export default function HomeEntryLoader() {
  const ready = useLoaderGate();
  const [isVisible, setIsVisible] = useState(() => !ready);

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
    }, EXIT_DURATION_MS);

    return () => window.clearTimeout(exitTimer);
  }, [ready, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#f6f0e6] px-6 transition-opacity duration-500 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Aba Ceylon Tours and Travels"
    >
      <div className="aba-ceylon-loader">
        Aba Ceylon Tours &amp; Travels
      </div>
    </div>
  );
}
