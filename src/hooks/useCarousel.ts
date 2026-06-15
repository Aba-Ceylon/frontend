import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 820) return 1;
  if (window.innerWidth < 1180) return 2;
  return 3;
}

interface UseCarouselOptions<T> {
  items: T[];
  gap?: number;
  autoPlayMs?: number;
}

export function useCarousel<T>({ items, gap = 32, autoPlayMs = 3000 }: UseCarouselOptions<T>) {
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef(items.length);
  const animating = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible] = useState(() => getVisible());

  const total = items.length;
  const cloned = useMemo(() => [...items, ...items, ...items], [items]);
  const effectiveGap = visible === 1 ? 0 : gap;

  const getStep = useCallback(() => {
    const w = containerRef.current?.offsetWidth ?? 0;
    return (w - effectiveGap * (visible - 1)) / visible + effectiveGap;
  }, [effectiveGap, visible]);

  const snapToOffset = useCallback(
    (nextOffset: number) => {
      gsap.set(stripRef.current, { x: -(nextOffset * getStep()) });
    },
    [getStep],
  );

  const slideTo = useCallback(
    (direction: 1 | -1) => {
      if (!total || animating.current) return;
      animating.current = true;
      const step = getStep();
      offset.current += direction;
      setDotIndex(((offset.current % total) + total) % total);

      gsap.to(stripRef.current, {
        x: -(offset.current * step),
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          animating.current = false;
          if (offset.current <= 0 || offset.current >= total * 2) {
            offset.current = total + (((offset.current % total) + total) % total);
            snapToOffset(offset.current);
          }
        },
      });
    },
    [getStep, snapToOffset, total],
  );

  // Reset on items change
  useEffect(() => {
    offset.current = total;
    const raf = requestAnimationFrame(() => snapToOffset(total));
    return () => cancelAnimationFrame(raf);
  }, [snapToOffset, total]);

  // Resize handler
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raf = requestAnimationFrame(() => {
      setVisible(getVisible());
      snapToOffset(offset.current);
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
  }, [snapToOffset]);

  // Autoplay
  useEffect(() => {
    if (!total) return;
    const timer = setInterval(() => slideTo(1), autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, slideTo, total]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragStartX.current === null) return;
      const diff = dragStartX.current - e.clientX;
      dragStartX.current = null;
      if (Math.abs(diff) > 50) slideTo(diff > 0 ? 1 : -1);
    },
    [slideTo],
  );

  const cardWidth = `calc((100% - ${effectiveGap * (visible - 1)}px) / ${visible})`;

  return {
    stripRef,
    containerRef,
    cloned,
    dotIndex,
    cardWidth,
    gap: effectiveGap,
    slideTo,
    onPointerDown,
    onPointerUp,
  };
}
