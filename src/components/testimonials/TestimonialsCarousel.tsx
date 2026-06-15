"use client";

export interface TestimonialItem {
  quote: string;
  name: string;
  location?: string;
  rating?: number;
}

const FALLBACK_ITEMS: TestimonialItem[] = [
  {
    quote: "The most personal travel experience I have ever had. Our driver knew every back road and every story behind every site.",
    name: "Sarah M.",
    location: "United Kingdom",
    rating: 5,
  },
  {
    quote: "We had our itinerary within hours of messaging. Everything was arranged exactly as we asked, with zero fuss.",
    name: "Thomas and Klara",
    location: "Germany",
    rating: 5,
  },
  {
    quote: "Travelling solo felt completely safe and comfortable. The team was reachable the whole time.",
    name: "Yuki T.",
    location: "Japan",
    rating: 5,
  },
  {
    quote: "Our family trip was paced properly from start to finish. Nothing felt rushed or generic.",
    name: "James R.",
    location: "Australia",
    rating: 5,
  },
  {
    quote: "This was the first time a Sri Lanka itinerary felt genuinely personal instead of pre-packed.",
    name: "Nadia V.",
    location: "Netherlands",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill={i < count ? "#C99A2B" : "rgba(24,34,49,0.14)"}
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
    <article
      className="flex shrink-0 flex-col justify-between border border-[#182231]/10 bg-white p-7"
      style={{ width: "clamp(300px, 30vw, 400px)" }}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span
            className="font-cinzel text-6xl leading-none text-[#C99A2B]/18"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <Stars count={item.rating ?? 5} />
        </div>
        <blockquote
          className="mt-4 text-[15px] leading-8 text-[#182231]/72"
          style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
        >
          {item.quote.replace(/^"|"$/g, "")}
        </blockquote>
      </div>

      <div className="mt-8 border-t border-[#182231]/10 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-cinzel text-sm text-[#182231]">{item.name}</p>
            {item.location ? (
              <p
                className="mt-1 text-xs text-[#182231]/52"
                style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
              >
                {item.location}
              </p>
            ) : null}
          </div>
          <span className="border border-[#C99A2B]/30 px-3 py-1 font-cinzel text-[10px] uppercase tracking-[0.14em] text-[#182231]">
            Verified
          </span>
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  duration = 55,
}: {
  items: TestimonialItem[];
  duration?: number;
}) {
  const looped = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max gap-5"
        style={{ animation: `marquee-scroll ${duration}s linear infinite` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {looped.map((item, i) => (
          <TestimonialCard key={i} item={item} />
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
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

  return <MarqueeRow items={list} duration={55} />;
}
