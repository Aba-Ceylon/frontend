"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Card from "@/components/ui/Card";

const Star = () => (
  <svg className="w-5 h-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.06 9.377c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.287-3.95z" />
  </svg>
);

export interface TestimonialItem {
  quote: string;
  name: string;
  location?: string;
  rating?: number;
}

export default function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const currentX = useRef(0);
  const dragStart = useRef<number | null>(null);

  // Duplicate only if enough items to make the loop non-obvious
  const loopItems = items.length > 2 ? [...items, ...items] : items;

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
    tweenRef.current?.pause();
  };

  const onDragMove = (clientX: number) => {
    if (dragStart.current === null) return;
    const delta = clientX - dragStart.current;
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
    currentX.current = (currentX.current + delta) % halfWidth;
    if (currentX.current > 0) currentX.current -= halfWidth;
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
        {loopItems.map((t, i) => (
          <div key={i} className="shrink-0" style={{ width: "clamp(280px, 28vw, 380px)" }}>
            <Card className="p-6 flex flex-col justify-between" style={{ height: "220px" }}>
              <div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating ?? 5 }).map((_, s) => <Star key={s} />)}
                </div>
                <blockquote className="text-slate-600 italic text-sm line-clamp-4">{t.quote}</blockquote>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="font-medium text-slate-800 text-sm">{t.name}</div>
                {t.location && <div className="text-xs text-slate-500">{t.location}</div>}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
