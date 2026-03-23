"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";

const GAP = 24;

const Star = ({ className = "w-5 h-5 text-amber-500" }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.06 9.377c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.287-3.95z" />
  </svg>
);

const testimonialsData = [
  {
    quote:
      '"Aba Ceylon curated the most incredible heritage journey through Sri Lanka. Our chauffeur guide was knowledgeable and passionate about the culture. The recommended stays were exceptional, blending authenticity with comfort. This wasn\'t just a tour - it was a cultural immersion."',
    name: "Emma Thompson",
    location: "United Kingdom",
  },
  {
    quote:
      '"We used the custom journey planner and couldn\'t be happier. Aba Ceylon helped us create the perfect 10-day itinerary combining ancient temples, tea country, and beach time. The attention to detail and personalized service exceeded all expectations."',
    name: "Michael & Sarah Johnson",
    location: "Australia",
  },
  {
    quote:
      '"As a history enthusiast, the Cultural Triangle tour was a dream come true. The expert knowledge shared about each heritage site, combined with comfortable transport and excellent accommodation recommendations, made this the trip of a lifetime."',
    name: "Hans Mueller",
    location: "Germany",
  },
  {
    quote:
      '"Fantastic service and deep cultural insights. The drivers and guides were punctual and friendly, and the suggested places to stay were charming and authentic. We felt well taken care of throughout our journey."',
    name: "Priya Nair",
    location: "India",
  },
  {
    quote:
      '"A truly personalised experience. Aba Ceylon listened to our interests and designed an itinerary that balanced relaxation with discovery. The small touches made all the difference."',
    name: "Liam O\'Connor",
    location: "Ireland",
  },
  {
    quote:
      '"From planning to execution, everything was seamless. The local food recommendations were highlights, and we loved learning about the heritage sites with knowledgeable guides."',
    name: "Sofia Martinez",
    location: "Spain",
  },
];

const LEN = testimonialsData.length;
const cloned = [...testimonialsData, ...testimonialsData, ...testimonialsData];

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 820) return 1;
  if (window.innerWidth < 1180) return 2;
  return 3;
}

export default function Testimonials() {
  const offset = useRef(LEN);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animating = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible] = useState(3);

  const getStep = () => {
    const containerWidth = containerRef.current?.offsetWidth ?? 0;
    const vis = getVisible();
    return (containerWidth - GAP * (vis - 1)) / vis + GAP;
  };

  const snapToOffset = (off: number) => {
    gsap.set(stripRef.current, { x: -(off * getStep()) });
  };

  const slideTo = (direction: 1 | -1) => {
    if (animating.current) return;
    animating.current = true;

    const step = getStep();
    offset.current += direction;
    setDotIndex(((offset.current % LEN) + LEN) % LEN);

    gsap.to(stripRef.current, {
      x: -(offset.current * step),
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        animating.current = false;
        if (offset.current <= 0 || offset.current >= LEN * 2) {
          offset.current = LEN + (((offset.current % LEN) + LEN) % LEN);
          snapToOffset(offset.current);
        }
      },
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    dragStartX.current = null;
    if (Math.abs(diff) > 50) slideTo(diff > 0 ? 1 : -1);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setVisible(getVisible());
      snapToOffset(LEN);
    });

    const onResize = () => {
      setVisible(getVisible());
      snapToOffset(offset.current);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => slideTo(1), 3000);
    return () => clearInterval(timer);
  }, []);

  const cardWidth = `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  return (
    <section className="py-16 bg-slate-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-semibold text-slate-800">Traveler Stories</h2>
          <p className="text-slate-500 mt-2">What our guests say about their heritage journey</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => slideTo(-1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Previous"
          >
            <LucideArrowLeft size={16} />
          </button>

          <div
            ref={containerRef}
            className="relative overflow-hidden flex-1 cursor-grab active:cursor-grabbing select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div ref={stripRef} className="flex" style={{ gap: GAP, willChange: "transform" }}>
              {cloned.map((t, i) => (
                <div key={i} className="shrink-0" style={{ width: cardWidth }}>
                  <Card className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                    </div>

                    <blockquote className="text-slate-600 italic text-sm mb-6">{t.quote}</blockquote>

                    <hr className="border-t border-gray-200 mb-4" />

                    <div>
                      <div className="font-medium text-slate-800">{t.name}</div>
                      <div className="text-sm text-slate-500">{t.location}</div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => slideTo(1)}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Next"
          >
            <LucideArrowRight size={16} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonialsData.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === dotIndex ? "bg-neutral-800 scale-125" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
