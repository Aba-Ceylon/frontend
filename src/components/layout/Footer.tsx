"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { footerLinkGroups, routes } from "@/constants/routes";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  const whatsappHref = generateWhatsAppLink(
    process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488",
    "Hello Aba Ceylon, I would like to start planning my Sri Lanka trip.",
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (bigTextRef.current && footerRef.current) {
        gsap.fromTo(
          bigTextRef.current,
          { y: 18 },
          {
            y: -10,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-[#182231]/10 bg-[#05070A] pb-8 pt-16 text-white md:pt-24"
    >
      <div
        ref={bigTextRef}
        className="pointer-events-none absolute bottom-[-1%] left-0 w-full select-none overflow-hidden"
      >
        <h2 className="w-full whitespace-nowrap text-center font-cinzel text-[12vw] leading-none tracking-tight text-white/[0.03] uppercase md:text-[16vw] lg:text-[15vw]">
          Aba Ceylon
        </h2>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(24,34,49,0.82)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-[1360px] px-6 lg:px-10">
        <div
          className="mb-14 border border-white/10 bg-white px-8 py-8 text-[#182231] shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:px-10 sm:py-10 lg:px-12 lg:py-12"
          data-reveal
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_340px] lg:items-end">
            <div>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#C99A2B]">
                Tailor-made island itineraries
              </p>
              <h3 className="mt-4 font-cinzel text-3xl leading-[1.05] text-[#182231] sm:text-5xl lg:text-6xl">
                Trust the trip to
                <br className="hidden sm:block" /> the team on the island.
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#182231]/68">
                Message Aba Ceylon directly for a privately planned Sri Lanka
                route with curated stays, chauffeur transport, and local support
                that stays with you throughout the journey.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href={routes.planner}
                className="flex items-center justify-between border border-[#182231] bg-[#182231] px-6 py-4 font-cinzel text-[11px] uppercase tracking-[0.18em] text-white transition hover:bg-[#243142]"
              >
                Build My Itinerary
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border border-[#182231]/14 bg-white px-6 py-4 font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#182231] transition hover:border-[#C99A2B] hover:text-[#C99A2B]"
              >
                Start on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 border-b border-white/5 pb-12 md:pb-16 lg:grid-cols-12 lg:gap-8">
          <div className="text-center md:text-left lg:col-span-5" data-reveal>
            <span className="mb-4 block font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#C99A2B] md:mb-6 md:tracking-[0.22em]">
              Based in Colombo, planning island-wide
            </span>
            <h3 className="mb-6 font-cinzel text-3xl leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-[3.35rem]">
              THE FINEST WAY
              <br className="hidden sm:block" /> to experience
              <br className="hidden sm:block" /> THE ISLAND.
            </h3>
            <p className="max-w-xl text-base leading-8 text-white/66">
              We keep the operation intentionally personal so your route,
              timing, and support all come from one accountable local team.
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <Link href={routes.about} className="editorial-link text-[#C99A2B]">
                Read our story
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-8">
              {footerLinkGroups.map((group) => (
                <div key={group.title} data-reveal className="col-span-1">
                  <h4 className="mb-6 font-cinzel text-xs uppercase tracking-[0.18em] text-[#C99A2B]/90 md:mb-8">
                    {group.title}
                  </h4>
                  <ul className="space-y-3 md:space-y-4">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group/link flex items-center text-sm text-white/76 transition-colors duration-300 hover:text-[#C99A2B]"
                        >
                          <span className="mr-0 h-[1px] w-0 bg-[#C99A2B] transition-all duration-300 group-hover/link:mr-2 group-hover/link:w-3" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div
                data-reveal
                className="col-span-2 border-t border-white/5 pt-4 md:col-span-1 md:border-none md:pt-0"
              >
                <h4 className="mb-6 font-cinzel text-xs uppercase tracking-[0.18em] text-[#C99A2B]/90 md:mb-8">
                  Headquarters
                </h4>
                <address className="space-y-4 text-sm leading-relaxed text-white/76 not-italic">
                  <p className="flex items-start gap-3">
                    <MapPin size={16} className="shrink-0 text-[#C99A2B]/72" />
                    Colombo, Sri Lanka
                  </p>
                  <a
                    href="tel:+94722554488"
                    className="flex items-start gap-3 transition-colors hover:text-white"
                  >
                    <Phone size={16} className="shrink-0 text-[#C99A2B]/72" />
                    072 255 4488
                  </a>
                  <a
                    href="mailto:abaceylon@gmail.com"
                    className="flex items-start gap-3 break-all transition-colors hover:text-white md:break-normal"
                  >
                    <Mail size={16} className="shrink-0 text-[#C99A2B]/72" />
                    abaceylon@gmail.com
                  </a>
                </address>

                <div className="mt-8 flex gap-5">
                  <Link
                    href="https://www.instagram.com/abaceylonaours"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/40 transition-colors hover:text-[#C99A2B]"
                  >
                    <Instagram size={20} />
                  </Link>
                  <Link
                    href="https://www.facebook.com/abaceylonaours"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/40 transition-colors hover:text-[#C99A2B]"
                  >
                    <Facebook size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row"
          data-reveal
        >
          <div className=" text-[11px] tracking-[0.12em] text-white/52">
            &copy; 2026.Abaceylontours.com All Rights Reserved.
          </div>

          <div className="flex gap-6 text-[11px] tracking-[0.12em] text-white/52 md:gap-8">
            <Link
              href={routes.privacy}
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href={routes.terms}
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>
          </div>

          <div className="text-[11px] tracking-[0.12em] text-white/52">
            Developed by{" "}
            <Link
              href="https://vernoxlabs.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#C99A2B]/80 transition-colors hover:text-[#C99A2B]"
            >
              M99Labs Sri Lanka
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
