import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { label: "Holiday Packages", href: "/packages" },
  { label: "Fleet", href: "/fleet" },
  { label: "Stays", href: "/stays" },
  { label: "Activities", href: "/activities" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Contact", href: "/contact" },
  { label: "Plan Your Journey", href: "/planner" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#06090F] border-t border-amber-400/20">
      <div className="absolute inset-0 bg-linear-to-b from-[#0A1324] via-[#070A11] to-[#040507]" />
      <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-400/12 blur-3xl" />
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(212,175,55,0.22) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-18 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-14">
          <div className="xl:col-span-5">
            <p className="font-cinzel text-xs tracking-[0.28em] uppercase text-amber-400/90 mb-4">
              Aba Ceylon Tours & Travels
            </p>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              Journey Through Sri Lanka
              <span className="block text-amber-400 mt-1">With Heritage-Led Luxury.</span>
            </h2>

            <p className="mt-5 text-amber-50/75 max-w-xl text-base sm:text-lg leading-relaxed">
              Curated routes, trusted chauffeurs, and memorable stays crafted to feel timeless from arrival to farewell.
            </p>

            <div className="mt-7 space-y-3 text-sm text-amber-100/80">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-400" />
                Sri Lanka | Island-wide coverage
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400" />
                +94 77 000 0000
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400" />
                hello@abaceylon.com
              </p>
            </div>
          </div>

          <div className="xl:col-span-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-cinzel text-lg text-amber-300 mb-4">Explore</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-amber-50/80 hover:text-amber-300 transition-colors duration-300"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-cinzel text-lg text-amber-300 mb-4">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-amber-50/80 hover:text-amber-300 transition-colors duration-300"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-cinzel text-lg text-amber-300 mb-4">Plan With Us</h3>

              <p className="text-amber-50/75 text-sm leading-relaxed mb-4">
                Share your travel month and we will craft a tailored itinerary.
              </p>

              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-full border border-amber-300/30 bg-white/5 px-4 py-2.5 text-sm text-amber-50 placeholder:text-amber-100/50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
                <Link
                  href="/planner"
                  className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-cinzel text-[#0B2545] hover:bg-amber-300 transition-colors duration-300"
                >
                  Start Your Journey
                </Link>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-amber-400/20 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-amber-50/65">
          <p>© {year} Aba Ceylon Tours & Travels. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://vernoxlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 transition-colors duration-300"
            >
              Vernox Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
