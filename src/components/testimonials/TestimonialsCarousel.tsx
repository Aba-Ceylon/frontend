"use client";


export interface TestimonialItem {
  quote: string;
  name: string;
  location?: string;
  rating?: number;
}

const FALLBACK_ITEMS: TestimonialItem[] = [
  {
    quote: "The most personal travel experience I have ever had. Our driver knew every back road and every story behind every site. Completely different to a group tour.",
    name: "Sarah M.",
    location: "United Kingdom",
    rating: 5,
  },
  {
    quote: "We had our itinerary within hours of messaging. Everything was arranged exactly as we asked, with zero fuss. Sigiriya at sunrise was everything.",
    name: "Thomas & Klara",
    location: "Germany",
    rating: 5,
  },
  {
    quote: "Travelling solo felt completely safe and comfortable. The team was reachable the whole time. I never felt alone even for a moment.",
    name: "Yuki T.",
    location: "Japan",
    rating: 5,
  },
  {
    quote: "Our family of five — including two young kids — had an incredible 10 days. The driver was endlessly patient and the pacing was perfect.",
    name: "James R.",
    location: "Australia",
    rating: 5,
  },
  {
    quote: "I have been to Sri Lanka twice before through agencies. This was the first time it felt like someone actually cared about the experience.",
    name: "Nadia V.",
    location: "Netherlands",
    rating: 5,
  },
  {
    quote: "The route through the hill country was breathtaking. We stopped at places that aren't in any guidebook. That's the difference with a local guide.",
    name: "Marco B.",
    location: "Italy",
    rating: 5,
  },
  {
    quote: "From the airport pick-up to the final goodbye, everything was seamless. Honest, warm, and genuinely world-class service.",
    name: "Priya S.",
    location: "Canada",
    rating: 5,
  },
  {
    quote: "We changed our plans twice mid-trip and Aba Ceylon adapted without a single complaint. That flexibility is priceless when you're travelling.",
    name: "David & Anna",
    location: "Sweden",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5"
          viewBox="0 0 20 20"
          fill={i < count ? "#C99A2B" : "#E5E7EB"}
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.06 9.377c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.287-3.95z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div
      className="shrink-0 flex flex-col justify-between rounded-[1.5rem] border border-neutral-200/80 bg-white p-7 shadow-[0_2px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_40px_rgba(15,23,42,0.1)] transition-shadow duration-300"
      style={{ width: "clamp(300px, 30vw, 400px)" }}
    >
      {/* Top: quote mark + stars */}
      <div className="flex items-start justify-between mb-4">
        <span
          className="font-cinzel leading-none select-none"
          style={{ fontSize: "72px", lineHeight: "0.7", color: "#C99A2B", opacity: 0.18 }}
          aria-hidden="true"
        >
          &ldquo;
        </span>
        <Stars count={item.rating ?? 5} />
      </div>

      {/* Quote */}
      <blockquote
        className="flex-1 text-[15px] leading-7 text-neutral-600 italic"
        style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
      >
        {item.quote.replace(/^"|"$/g, "")}
      </blockquote>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-100" />
        <div className="h-1.5 w-1.5 rounded-full bg-amber-400/40" />
        <div className="h-px flex-1 bg-neutral-100" />
      </div>

      {/* Author */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-cinzel text-sm text-[#0F172A]">{item.name}</p>
          {item.location && (
            <p
              className="mt-0.5 text-xs text-neutral-400"
              style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
            >
              {item.location}
            </p>
          )}
        </div>
        {/* Verified badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 px-3 py-1">
          <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span
            className="text-[10px] text-emerald-600 font-medium"
            style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
          >
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  duration = 55,
}: {
  items: TestimonialItem[];
  duration?: number;
}) {
  // Duplicate enough times so the strip is always wider than the viewport
  const looped = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{ WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
    >
      <div
        className="flex gap-5 w-max"
        style={{ animation: `marquee-scroll ${duration}s linear infinite` }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
      >
        {looped.map((item, i) => (
          <TestimonialCard key={i} item={item} />
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  );
}

export default function TestimonialsCarousel({
  items,
}: {
  items: TestimonialItem[];
}) {
  const list = items.length >= 4 ? items : FALLBACK_ITEMS;

  return (
    <div>
      <MarqueeRow items={list} duration={55} />
    </div>
  );
}
