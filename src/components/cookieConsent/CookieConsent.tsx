"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { routes } from "@/constants/routes";

const CONSENT_KEY = "aba-cookie-consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let hasConsent = false;
    try {
      hasConsent = Boolean(window.localStorage.getItem(CONSENT_KEY));
    } catch {
      // Storage blocked (private mode etc.) — show the banner each visit.
    }
    if (hasConsent) return;

    const timeoutId = window.setTimeout(() => setIsVisible(true), 600);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const acceptAll = () => {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ status: "accepted", at: new Date().toISOString() }),
      );
    } catch {
      // Ignore storage failures; the banner still closes for this session.
    }
    setIsVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 bottom-0 z-[70] p-4 transition-all duration-500 ease-out sm:p-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1360px] flex-col gap-5 border-t-2 border-[#bf9230] bg-[#182231] px-6 py-5 text-white shadow-[0_-12px_40px_rgba(10,15,24,0.25)] lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8">
        <p className="max-w-4xl text-sm leading-6 text-white/80">
          We use cookies to enhance your experience, personalize content, and
          analyze traffic. By clicking &lsquo;Accept All Cookies,&rsquo; you
          consent to their use. For more information, see our Privacy Policy.
          To disable cookies, update your preferences via your browser
          settings.
        </p>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={acceptAll}
            tabIndex={isVisible ? 0 : -1}
            className="inline-flex min-h-11 items-center justify-center bg-[#bf9230] px-6 py-2 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231] transition hover:bg-[#d1a644]"
          >
            Accept All Cookies
          </button>
          <Link
            href={routes.privacy}
            tabIndex={isVisible ? 0 : -1}
            className="inline-flex min-h-11 items-center justify-center border border-white/30 px-6 py-2 font-cinzel text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}
