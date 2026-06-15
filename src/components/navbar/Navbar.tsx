"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { primaryNavLinks, routes } from "@/constants/routes";
import FeedbackModal from "@/features/feedback/FeedbackModal";

export default function NavBar() {
  const pathname = usePathname();
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
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const shellClass = isScrolled || isAuthPage
    ? "border-[#182231]/10 bg-[rgba(251,248,242,0.92)] shadow-[0_16px_36px_rgba(17,24,39,0.06)] backdrop-blur-xl"
    : "border-transparent bg-[rgba(251,248,242,0.58)] backdrop-blur-md";

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto max-w-[1360px] border transition-all duration-500 ${shellClass}`}
          style={{ fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI"' }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href={routes.home} className="flex min-w-0 items-center gap-4">
              <div className="relative h-11 w-14 overflow-hidden border border-[#182231]/10 bg-white sm:h-12 sm:w-16">
                <Image
                  src="/LOGO.jpeg"
                  alt="Aba Ceylon Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="font-cinzel text-sm tracking-[0.18em] text-[#182231] sm:text-base">
                  Aba Ceylon
                </p>
                <p className="truncate text-[10px] uppercase tracking-[0.22em] text-[#4a5565] sm:text-[11px]">
                  Tours & Travels
                </p>
              </div>
            </Link>

            {!isAuthPage ? (
              <div className="hidden min-w-0 flex-1 items-center justify-center gap-7 px-5 xl:flex 2xl:gap-8">
                {primaryNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="whitespace-nowrap font-cinzel text-[10px] uppercase tracking-[0.16em] text-[#314055] transition-colors duration-300 hover:text-[#8b6b1f] 2xl:text-[11px] 2xl:tracking-[0.18em]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : <div className="hidden xl:block" />}

            <div className="hidden items-center gap-3 xl:flex">
              {!isAuthPage ? (
                <>
                  <Link
                    href={routes.contact}
                    className="inline-flex min-h-11 items-center justify-center border border-[#182231]/14 px-4 py-2 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231] transition hover:bg-white"
                  >
                    Enquire
                  </Link>
                  <Link
                    href={routes.planner}
                    className="inline-flex min-h-11 items-center justify-center bg-[#182231] px-5 py-2 font-cinzel text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-[#243142]"
                  >
                    Planner
                  </Link>
                  <Show when="signed-out">
                    <Link
                      href={routes.signIn}
                      className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#4a5565] transition-colors hover:text-[#182231]"
                    >
                      Sign In
                    </Link>
                  </Show>
                  <Show when="signed-in">
                    <button
                      type="button"
                      className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#4a5565] transition-colors hover:text-[#182231]"
                      onClick={() => setIsFeedbackOpen(true)}
                    >
                      Feedback
                    </button>
                    <UserButton />
                  </Show>
                </>
              ) : (
                <Link
                  href={routes.contact}
                  className="inline-flex min-h-11 items-center gap-2 border border-[#182231]/14 px-4 py-2 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231]"
                >
                  Need help
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#8b6b1f]" />
                </Link>
              )}
            </div>

            {!isAuthPage ? (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center border border-[#182231]/10 bg-white/70 text-[#182231] lg:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            ) : (
              <Link
                href={routes.contact}
                className="inline-flex min-h-11 items-center gap-2 border border-[#182231]/10 px-3 py-2 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231] lg:hidden"
              >
                Contact
              </Link>
            )}
          </div>
        </div>
      </nav>

      {!isAuthPage && isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(246,240,230,0.96)] px-6 pb-8 pt-28 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex h-full max-w-md flex-col">
            <div className="luxury-divider mb-8 w-full" />
            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-5">
                {primaryNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block font-cinzel text-2xl text-[#182231] transition-colors hover:text-[#8b6b1f]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-10 space-y-4 border border-[#182231]/8 bg-white/70 p-6">
                <Link
                  href={routes.planner}
                  className="flex items-center justify-between bg-[#182231] px-5 py-4 font-cinzel text-[11px] uppercase tracking-[0.22em] text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Open planner
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  href={routes.contact}
                  className="flex items-center justify-between border border-[#182231]/12 px-5 py-4 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Enquire now
                  <ArrowUpRight className="h-4 w-4 text-[#8b6b1f]" />
                </Link>

                <Show when="signed-out">
                  <Link
                    href={routes.signIn}
                    className="block font-cinzel text-[12px] uppercase tracking-[0.18em] text-[#445062]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href={routes.signUp}
                    className="block font-cinzel text-[12px] uppercase tracking-[0.18em] text-[#445062]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Show>
                <Show when="signed-in">
                  <button
                    type="button"
                    className="font-cinzel text-[12px] uppercase tracking-[0.18em] text-[#445062]"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsFeedbackOpen(true);
                    }}
                  >
                    Feedback
                  </button>
                  <div className="py-2">
                    <UserButton />
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isFeedbackOpen ? (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      ) : null}
    </>
  );
}
