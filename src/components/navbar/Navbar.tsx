"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import FeedbackModal from "@/features/feedback/FeedbackModal";

export default function NavBar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("navbar.holidayPackages"), href: "/packages" },
    { label: t("navbar.planWithUs"), href: "/#custom-planner" },
    { label: t("navbar.fleet"), href: "/fleet" },
    { label: t("navbar.stays"), href: "/stays" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg py-3" : "py-4"
      }`}
      style={{
        fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI"',
        backgroundColor: isScrolled ? "#1A2238" : "transparent",
        transition: "background-color 300ms ease",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src="/LOGO.jpeg"
                alt={t("navbar.logoAlt")}
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!isAuthPage && (
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-cinzel text-white text-sm font-medium tracking-[0.08em] transition-colors duration-300 hover:text-[#C99A2B]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden lg:flex items-center gap-4">
            {!isAuthPage && (
              <>
                <Link
                  href="/contact"
                  className="relative overflow-hidden border-2 border-amber-400/60 bg-white/5 px-6 py-2 text-sm text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-amber-400 hover:bg-white/10"
                >
                  <span className="relative z-10 font-cinzel tracking-wide">
                    {t("navbar.enquireNow")}
                  </span>
                </Link>
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="font-cinzel text-white text-sm font-medium tracking-[0.08em] px-4 py-2 transition-colors duration-300 hover:text-[#C99A2B]"
                  >
                    {t("navbar.signIn")}
                  </Link>
                  <Link
                    href="/sign-up"
                    className="rounded-md bg-amber-400/60 px-4 py-2 font-cinzel text-sm font-medium tracking-[0.08em] text-white drop-shadow-[0_0_30px_rgba(201,154,43,0.5)] transition-all duration-300 hover:bg-amber-400/75"
                  >
                    {t("navbar.signUp")}
                  </Link>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/feedback"
                    className="font-cinzel text-white text-sm font-medium tracking-[0.08em] px-4 py-2 transition-colors duration-300 hover:text-[#C99A2B]"
                    onClick={(event) => {
                      event.preventDefault();
                      setIsFeedbackOpen(true);
                    }}
                  >
                    {t("navbar.feedback")}
                  </Link>
                  <UserButton />
                </Show>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {!isAuthPage ? (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2"
                aria-label={t("navbar.toggleMenu")}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {!isAuthPage && isMobileMenuOpen && (
          <div
            className={`lg:hidden mt-4 pb-4 border-t ${
              isScrolled ? "border-white/20" : "border-white/30"
            }`}
          >
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-cinzel text-white text-sm font-medium tracking-[0.08em] py-2 transition-colors duration-300 hover:text-[#C99A2B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/20 pt-3 mt-3 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="relative overflow-hidden border-2 border-amber-400/60 bg-white/5 px-4 py-3 text-center text-sm text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400 hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative z-10 font-cinzel tracking-wide">
                    {t("navbar.enquireNow")}
                  </span>
                </Link>
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="font-cinzel text-white text-sm font-medium tracking-[0.08em] py-2 transition-colors duration-300 hover:text-[#C99A2B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navbar.signIn")}
                  </Link>
                  <Link
                    href="/sign-up"
                    className="rounded-md bg-amber-400/60 px-4 py-2 text-center font-cinzel text-sm font-medium tracking-[0.08em] text-white drop-shadow-[0_0_30px_rgba(201,154,43,0.5)] transition-all duration-300 hover:bg-amber-400/75"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navbar.signUp")}
                  </Link>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/feedback"
                    className="font-cinzel text-white text-sm font-medium tracking-[0.08em] py-2 transition-colors duration-300 hover:text-[#C99A2B]"
                    onClick={(event) => {
                      event.preventDefault();
                      setIsMobileMenuOpen(false);
                      setIsFeedbackOpen(true);
                    }}
                  >
                    {t("navbar.feedback")}
                  </Link>
                  <div className="py-2">
                    <UserButton />
                  </div>
                </Show>
              </div>
            </div>
          </div>
        )}
      </div>

      {isFeedbackOpen ? (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      ) : null}
    </nav>
  );
}
