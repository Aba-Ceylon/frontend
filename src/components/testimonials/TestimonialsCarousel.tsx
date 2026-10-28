"use client";

import { socialLinks } from "@/config/site";

export interface TestimonialItem {
  quote: string;
  name: string;
  location?: string;
  rating?: number;
  source?: "facebook" | "site";
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

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
  const isFacebook = item.source === "facebook";

  return (
    <article
      className="flex shrink-0 flex-col justify-between border border-[#182231]/10 bg-white p-7"
      style={{ width: "clamp(280px, 30vw, 400px)" }}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span
            className="font-cinzel text-6xl leading-none text-[#C99A2B]/25"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          {isFacebook ? null : <Stars count={item.rating ?? 5} />}
        </div>
        <blockquote
          className="mt-2 line-clamp-4 text-[15px] leading-7 text-[#182231]/75"
          style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
        >
          {item.quote.replace(/^"|"$/g, "")}
        </blockquote>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-[#182231]/10 pt-5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#182231] font-cinzel text-sm text-[#e2c27a]"
          aria-hidden="true"
        >
          {initials(item.name)}
        </span>
        <div className="min-w-0" style={{ fontFamily: "Switzer, system-ui, sans-serif" }}>
          <p className="truncate font-cinzel text-sm text-[#182231]">{item.name}</p>
          {isFacebook ? (
            <a
              href={socialLinks.facebookReviews}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#182231]/55 transition-colors hover:text-[#1877F2]"
            >
              <FacebookMark />
              Recommends on Facebook
            </a>
          ) : (
            <p className="mt-1 text-xs text-[#182231]/55">
              {item.location ?? "Aba Ceylon traveller"}
            </p>
          )}
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
  if (!items.length) return null;

  return <MarqueeRow items={items} duration={items.length * 12} />;
}
