"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { primaryNavLinks, routes } from "@/constants/routes";
import FeedbackModal from "@/features/feedback/FeedbackModal";

// Pages that open on a full-bleed dark hero, so the bar can start transparent.
const DARK_HERO_ROUTES = [
  routes.customizeJourneys,
  "/about",
  "/activities",
  "/destinations",
  "/fleet",
  "/packages",
  "/stays",
];

// Always visible on desktop; everything else lives in the menu panel.
const MAIN_LINKS = [
  { label: "Tour Packages", href: routes.packages },
  { label: "Destinations", href: routes.destinations },
];

const MENU_LINKS = [
  ...primaryNavLinks,
  { label: "Activities", href: routes.activities },
  { label: "Contact", href: routes.contact },
];

const LINK_CLASS =
  "font-cinzel text-[11px] uppercase tracking-[0.2em] text-white/85 transition-colors hover:text-[#e2c27a]";

export default function NavBar() {
  const pathname = usePathname();
  // Undefined while Clerk loads (or if it fails), so Sign In still shows.
  const { isSignedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the menu on navigation without a setState-in-effect cascade.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMenuOpen(false);
  }

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const value = isMenuOpen ? "hidden" : "";
    document.body.style.overflow = value;
    document.documentElement.style.overflow = value;
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const hasDarkHero =
    pathname === routes.home ||
    DARK_HERO_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
  const isSolid = isScrolled || isAuthPage || !hasDarkHero;

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          isSolid
            ? "bg-[rgba(24,34,49,0.96)] shadow-[0_12px_30px_rgba(10,15,24,0.18)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
        style={{ fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI"' }}
      >
        <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:h-20 sm:px-6 lg:px-10">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex min-h-11 items-center gap-3 text-white"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden font-cinzel text-[11px] uppercase tracking-[0.24em] sm:inline">
                Menu
              </span>
            </button>
            <div className="hidden items-center gap-8 lg:flex">
              {MAIN_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href={routes.home} className="flex items-center gap-3" aria-label="Aba Ceylon home">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white sm:h-11 sm:w-11">
              <Image src="/LOGO.jpeg" alt="" fill className="object-cover" priority />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block font-cinzel text-sm tracking-[0.18em] text-white sm:text-base">
                Aba Ceylon
              </span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-white/70">
                Tours & Travels
              </span>
            </span>
          </Link>

          <div className="flex items-center justify-end gap-4 sm:gap-6">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <Link href={routes.signIn} className={`whitespace-nowrap ${LINK_CLASS}`}>
                Sign In
              </Link>
            )}
            <Link
              href={routes.planner}
              className="inline-flex min-h-11 items-center justify-center border border-white/70 px-4 py-2 font-cinzel text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-[#182231] sm:px-6"
            >
              Plan a Trip
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[55] bg-[#0a0f18]/50 backdrop-blur-sm transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed inset-y-0 left-0 z-[60] flex w-full max-w-md flex-col overflow-y-auto bg-[#182231] px-8 pb-10 pt-6 text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="inline-flex min-h-11 items-center gap-3 self-start text-white/80 transition-colors hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
          <span className="font-cinzel text-[11px] uppercase tracking-[0.24em]">Close</span>
        </button>

        <nav className="mt-12 flex flex-col gap-5" aria-label="All pages">
          {MENU_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`font-cinzel text-2xl transition-colors hover:text-[#e2c27a] ${
                pathname === link.href ? "text-[#e2c27a]" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4 border-t border-white/10 pt-8">
          <Link
            href={routes.planner}
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between bg-[#C99A2B] px-5 py-4 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231] transition hover:bg-[#ddb044]"
          >
            Plan a Trip
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          {isSignedIn ? (
            <button
              type="button"
              className={`pt-2 ${LINK_CLASS}`}
              onClick={() => {
                setIsMenuOpen(false);
                setIsFeedbackOpen(true);
              }}
            >
              Feedback
            </button>
          ) : (
            <div className="flex gap-6 pt-2">
              <Link href={routes.signIn} onClick={() => setIsMenuOpen(false)} className={LINK_CLASS}>
                Sign In
              </Link>
              <Link href={routes.signUp} onClick={() => setIsMenuOpen(false)} className={LINK_CLASS}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {isFeedbackOpen ? (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      ) : null}
    </>
  );
}
