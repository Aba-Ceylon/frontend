"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";

const Star = () => (
  <svg className="w-5 h-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.06 9.377c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.287-3.95z" />
  </svg>
);

const testimonials = [
  { quote: '"Aba Ceylon curated the most incredible heritage journey through Sri Lanka. Our chauffeur guide was knowledgeable and passionate about the culture. The recommended stays were exceptional, blending authenticity with comfort."', name: "Emma Thompson", location: "United Kingdom" },
  { quote: '"We used the custom journey planner and couldn\'t be happier. Aba Ceylon helped us create the perfect 10-day itinerary combining ancient temples, tea country, and beach time. The attention to detail exceeded all expectations."', name: "Michael & Sarah Johnson", location: "Australia" },
  { quote: '"As a history enthusiast, the Cultural Triangle tour was a dream come true. The expert knowledge shared about each heritage site, combined with comfortable transport and excellent accommodation, made this the trip of a lifetime."', name: "Hans Mueller", location: "Germany" },
  { quote: '"Fantastic service and deep cultural insights. The drivers and guides were punctual and friendly, and the suggested places to stay were charming and authentic. We felt well taken care of throughout our journey."', name: "Priya Nair", location: "India" },
  { quote: '"A truly personalised experience. Aba Ceylon listened to our interests and designed an itinerary that balanced relaxation with discovery. The small touches made all the difference."', name: "Liam O\'Connor", location: "Ireland" },
  { quote: '"From planning to execution, everything was seamless. The local food recommendations were highlights, and we loved learning about the heritage sites with knowledgeable guides."', name: "Sofia Martinez", location: "Spain" },
];

// Duplicate for seamless loop
const items = [...testimonials, ...testimonials];

export default function Testimonials() {
  const stripRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const currentX = useRef(0);
  const dragStart = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const halfWidth = strip.scrollWidth / 2;

    tweenRef.current = gsap.to(strip, {
      x: -halfWidth,
      duration: 40,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => {
          currentX.current = parseFloat(x) % halfWidth;
          return `${currentX.current}px`;
        },
      },
    });

    return () => { tweenRef.current?.kill(); };
  }, []);

  const onDragStart = (clientX: number) => {
    dragStart.current = clientX;
    isDragging.current = false;
    tweenRef.current?.pause();
  };

  const onDragMove = (clientX: number) => {
    if (dragStart.current === null) return;
    const delta = clientX - dragStart.current;
    if (Math.abs(delta) > 3) isDragging.current = true;
    const strip = stripRef.current;
    if (!strip) return;
    const halfWidth = strip.scrollWidth / 2;
    let next = (currentX.current + delta) % halfWidth;
    if (next > 0) next -= halfWidth;
    gsap.set(strip, { x: next });
  };

  const onDragEnd = (clientX: number) => {
    if (dragStart.current === null) return;
    const delta = clientX - dragStart.current;
    dragStart.current = null;
    const strip = stripRef.current;
    if (!strip) return;
    const halfWidth = strip.scrollWidth / 2;
    currentX.current = ((currentX.current + delta) % halfWidth);
    if (currentX.current > 0) currentX.current -= halfWidth;
    // Resume from current position
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(strip, {
      x: currentX.current - halfWidth,
      duration: Math.abs(currentX.current / halfWidth) * 40 + 40,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => {
          currentX.current = parseFloat(x) % halfWidth;
          return `${currentX.current}px`;
        },
      },
    });
  };

  return (
    <section className="py-16 bg-[#1A2238] overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-semibold font-cinzel text-amber-400 drop-shadow-[0_0_30px_rgba(217,119,6,0.5)]">Traveler Stories</h2>
          <p className="font-cinzel text-white mt-2">What our guests say about their heritage journey</p>
        </div>
      </Container>

      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => e.buttons === 1 && onDragMove(e.clientX)}
        onMouseUp={(e) => onDragEnd(e.clientX)}
        onMouseLeave={(e) => { if (e.buttons === 1) onDragEnd(e.clientX); }}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
      >
        <div ref={stripRef} className="flex gap-6 w-max">
          {items.map((t, i) => (
            <div key={i} className="shrink-0" style={{ width: "clamp(280px, 28vw, 380px)" }}>
              <Card className="p-6 flex flex-col justify-between" style={{ height: "220px" }}>
                <div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, s) => <Star key={s} />)}
                  </div>
                  <blockquote className="text-slate-600 italic text-sm line-clamp-4">{t.quote}</blockquote>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="font-medium text-slate-800 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
