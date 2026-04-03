"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { label: "Holiday Packages", href: "/packages" },
    { label: "Plan With Us", href: "/#custom-planner" },
    { label: "Fleet", href: "/fleet" },
    { label: "Stays", href: "/stays" },
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
                alt="Aba Ceylon Logo"
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
                  className="font-cinzel text-white text-sm font-medium tracking-[0.08em] transition-colors duration-300 hover:text-[#B8860B]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop CTA & Auth Buttons */}
          {!isAuthPage && (
            <div className="hidden lg:flex items-center gap-4">
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="font-cinzel text-white text-sm font-medium tracking-[0.08em] px-4 py-2 transition-colors duration-300 hover:text-[#B8860B]"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="font-cinzel text-white text-sm font-medium tracking-[0.08em] px-4 py-2 transition-colors duration-300 hover:text-[#B8860B]"
                >
                  Sign Up
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/feedback"
                  className="text-white text-sm font-medium px-4 py-2 transition-colors duration-300 hover:text-[#B8860B]"
                >
                  Feedback
                </Link>
                <UserButton />
              </Show>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
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
                  className="font-cinzel text-white text-sm font-medium tracking-[0.08em] py-2 transition-colors duration-300 hover:text-[#B8860B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/20 pt-3 mt-3 flex flex-col gap-3">
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="font-cinzel text-white text-sm font-medium tracking-[0.08em] py-2 transition-colors duration-300 hover:text-[#B8860B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="font-cinzel text-white text-sm font-medium tracking-[0.08em] py-2 transition-colors duration-300 hover:text-[#B8860B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/feedback"
                    className="text-white text-sm font-medium py-2 transition-colors duration-300 hover:text-[#B8860B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Feedback
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
    </nav>
  );
}
