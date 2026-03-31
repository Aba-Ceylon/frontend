"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook, ArrowUpRight } from "lucide-react";
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
  const year = new Date().getFullYear();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Smooth parallax for the big brand text
      gsap.fromTo(
        bigTextRef.current,
        { y: 50, opacity: 0 },
        {
          y: -20,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Elegant reveal for footer content
      gsap.fromTo(
        "[data-f-reveal]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#05070A] pt-16 md:pt-24 pb-8 text-white/90"
    >
      {/* 1. FIXED BACKGROUND TEXT: Uses clamp to prevent "N" clipping and responsive sizing */}
      <div 
        ref={bigTextRef}
        className="absolute bottom-[-2%] left-0 w-full pointer-events-none select-none overflow-hidden"
      >
        <h2 className="font-cinzel text-[14vw] md:text-[16vw] lg:text-[15vw] leading-none text-white/[0.03] whitespace-nowrap text-center uppercase tracking-tighter w-full">
          Aba Ceylon
        </h2>
      </div>

      {/* 2. ATMOSPHERIC GRADIENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#111827_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/5 pb-16">
          
          {/* LEFT: Branding & CTA */}
          <div className="lg:col-span-6 xl:col-span-5" data-f-reveal>
            <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] block mb-4 md:mb-6">
              Establishment of Excellence
            </span>
            <h3 className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-8">
              THE FINEST WAY <br />
              TO <span className="italic text-[#D4AF37] font-serif lowercase">experience</span> <br />
              THE ISLAND.
            </h3>
            
            <Link 
              href="/planner"
              className="group relative inline-flex items-center gap-4 py-3 md:py-4 pr-8 border-b border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-500"
            >
              <span className="font-cinzel text-base md:text-lg text-[#D4AF37] uppercase tracking-widest">Curate Your Journey</span>
              <div className="relative overflow-hidden h-5 w-5">
                <ArrowUpRight className="text-[#D4AF37] absolute inset-0 transition-transform duration-500 group-hover:translate-x-5 group-hover:-translate-y-5" />
                <ArrowUpRight className="text-[#D4AF37] absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </Link>
          </div>

          {/* RIGHT: Directory Links (Responsive Grid) */}
          <div className="lg:col-span-6 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">
            {footerLinks.map((group) => (
              <div key={group.title} data-f-reveal>
                <h4 className="font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#D4AF37]/80 mb-6 md:mb-8">
                  {group.title}
                </h4>
                <ul className="space-y-3 md:space-y-4">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-light text-white/60 hover:text-[#D4AF37] transition-colors duration-300 flex items-center group/link"
                      >
                        <span className="w-0 group-hover/link:w-3 h-[1px] bg-[#D4AF37] mr-0 group-hover/link:mr-2 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Info */}
            <div data-f-reveal>
              <h4 className="font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#D4AF37]/80 mb-6 md:mb-8">
                Headquarters
              </h4>
              <address className="not-italic text-sm font-light space-y-4 leading-relaxed text-white/60">
                <p className="flex gap-3 items-start"><MapPin size={16} className="shrink-0 text-[#D4AF37]/70" /> Colombo, Sri Lanka</p>
                <p className="flex gap-3 items-start"><Phone size={16} className="shrink-0 text-[#D4AF37]/70" /> +94 77 000 0000</p>
                <p className="flex gap-3 items-start"><Mail size={16} className="shrink-0 text-[#D4AF37]/70" /> hello@abaceylon.com</p>
              </address>
              
              <div className="flex gap-5 mt-8">
                <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors"><Instagram size={20} /></Link>
                <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors"><Facebook size={20} /></Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Minimalist & Clean */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6" data-f-reveal>
          <div className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30">
            © {year} Aba Ceylon Tours & Travels
          </div>
          
          <div className="flex gap-8 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>

          <div className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30">
            Design by <a href="https://vernoxlabs.com" className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors">Vernox Labs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}