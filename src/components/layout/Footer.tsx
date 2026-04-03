"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ArrowUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const footerLinks = [
  {
    title: "Curation",
    links: [
      { label: "Holiday Packages", href: "/packages" },
      { label: "Stays & Retreats", href: "/stays" },
      { label: "Private Fleet", href: "/fleet" },
      { label: "Bespoke Activities", href: "/activities" },
    ],
  },
  {
    title: "Heritage",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Destinations", href: "/destinations" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bigTextRef.current,
        { y: 30, opacity: 0 },
        {
          y: -10,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        "[data-f-reveal]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#05070A] pt-16 md:pt-24 pb-8 text-white/90"
    >
      {/* 1. BACKGROUND TEXT: Scaled down on mobile to prevent clipping */}
      <div
        ref={bigTextRef}
        className="absolute bottom-[-1%] left-0 w-full pointer-events-none select-none overflow-hidden"
      >
        <h2 className="font-cinzel text-[12vw] md:text-[16vw] lg:text-[15vw] leading-none text-white/[0.03] whitespace-nowrap text-center uppercase tracking-tighter w-full">
          Aba Ceylon
        </h2>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#111827_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/5 pb-12 md:pb-16">
          {/* LEFT: Branding - Centered on mobile, Left on Desktop */}
          <div
            className="lg:col-span-6 xl:col-span-5 text-center md:text-left"
            data-f-reveal
          >
            <span className="font-cinzel text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#C99A2B] block mb-4 md:mb-6">
              Establishment of Excellence
            </span>
            <h3 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-8">
              THE FINEST WAY <br className="hidden sm:block" />
              TO{" "}
              <span className="italic text-[#C99A2B] font-serif lowercase">
                experience
              </span>{" "}
              <br className="hidden sm:block" />
              THE ISLAND.
            </h3>

            <div className="flex justify-center md:justify-start">
              <Link
                href="/planner"
                className="group relative inline-flex items-center gap-4 py-3 md:py-4 pr-6 md:pr-8 border-b border-[#C99A2B]/30 hover:border-[#C99A2B] transition-all duration-500"
              >
                <span className="font-cinzel text-sm md:text-lg text-[#C99A2B] uppercase tracking-widest">
                  Curate Your Journey
                </span>
                <div className="relative overflow-hidden h-5 w-5">
                  <ArrowUpRight className="text-[#C99A2B] absolute inset-0 transition-transform duration-500 group-hover:translate-x-5 group-hover:-translate-y-5" />
                  <ArrowUpRight className="text-[#C99A2B] absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
              </Link>
            </div>
          </div>

          {/* RIGHT: Responsive Link Directory */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 md:gap-8">
              {footerLinks.map((group) => (
                <div key={group.title} data-f-reveal className="col-span-1">
                  <h4 className="font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#C99A2B]/80 mb-6 md:mb-8">
                    {group.title}
                  </h4>
                  <ul className="space-y-3 md:space-y-4">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm font-light text-white/60 hover:text-[#C99A2B] transition-colors duration-300 flex items-center group/link"
                        >
                          <span className="w-0 group-hover/link:w-3 h-[1px] bg-[#C99A2B] mr-0 group-hover/link:mr-2 transition-all duration-300" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Headquarters - Full width on smallest mobile to prevent email clipping */}
              <div
                data-f-reveal
                className="col-span-2 md:col-span-1 pt-4 md:pt-0 border-t border-white/5 md:border-none"
              >
                <h4 className="font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#C99A2B]/80 mb-6 md:mb-8">
                  Headquarters
                </h4>
                <address className="not-italic text-sm font-light space-y-4 leading-relaxed text-white/60">
                  <p className="flex gap-3 items-start">
                    <MapPin size={16} className="shrink-0 text-[#C99A2B]/70" />{" "}
                    Colombo, Sri Lanka
                  </p>
                  <p className="flex gap-3 items-start">
                    <Phone size={16} className="shrink-0 text-[#C99A2B]/70" />{" "}
                    072 255 4488
                  </p>
                  <p className="flex gap-3 items-start break-all md:break-normal">
                    <Mail size={16} className="shrink-0 text-[#C99A2B]/70" />{" "}
                    abaceylon@gmail.com
                  </p>
                </address>

                <div className="flex gap-5 mt-8">
                  <Link
                    href="#"
                    className="text-white/40 hover:text-[#C99A2B] transition-colors"
                  >
                    <Instagram size={20} />
                  </Link>
                  <Link
                    href="#"
                    className="text-white/40 hover:text-[#C99A2B] transition-colors"
                  >
                    <Facebook size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Responsive Stacking */}
        <div
          className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center"
          data-f-reveal
        >
          <div className="font-cinzel text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30">
            &copy; 2026 Aba Ceylon Travels & Tours
          </div>

          <div className="flex gap-6 md:gap-8 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30">
            <Link
              href="/privacy"
              className="font-cinzel hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-cinzel hover:text-white transition-colors"
            >
              Terms
            </Link>
          </div>

          <div className="font-cinzel text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30">
            Developed by{" "}
            <a
              href="https://vernoxlabs.com"
              className="text-[#C99A2B]/60 hover:text-[#C99A2B] transition-colors"
            >
              Vernox Labs Sri Lanka
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
