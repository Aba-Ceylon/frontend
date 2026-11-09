import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

function getVisible(maxVisible: number) {
  if (typeof window === "undefined") return maxVisible;
  if (window.innerWidth < 760) return 1;
  if (window.innerWidth < 1180) return Math.min(2, maxVisible);
  return maxVisible;
}

interface UseCarouselOptions<T> {
  items: T[];
  gap?: number;
  autoPlayMs?: number;
  /** Most cards shown at once on wide screens. Fewer means bigger cards. */
  maxVisible?: number;
}

export function useCarousel<T>({ items, gap = 32, autoPlayMs = 3000, maxVisible = 3 }: UseCarouselOptions<T>) {
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef(items.length);
  const animating = useRef(false);
  const dragStartX = useRef<number | null>(null);
  // Set when a drag just happened, so the release doesn't also "click" a card.
  const suppressClick = useRef(false);
  const paused = useRef(false);
  const [dotIndex, setDotIndex] = useState(0);
  const [visible, setVisible] = useState(() => getVisible(maxVisible));

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
      setVisible(getVisible(maxVisible));
      snapToOffset(offset.current);
    });
    const onResize = () => {
      setVisible(getVisible(maxVisible));
      snapToOffset(offset.current);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [maxVisible, snapToOffset]);

  // Autoplay
  // Autoplay: off for reduced motion; paused while hovered, focused or hidden.
  useEffect(() => {
    if (!total) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    const pause = () => { paused.current = true; };
    const resume = () => { paused.current = false; };
    container?.addEventListener("pointerenter", pause);
    container?.addEventListener("pointerleave", resume);
    container?.addEventListener("focusin", pause);
    container?.addEventListener("focusout", resume);

    const timer = setInterval(() => {
      if (!paused.current && document.visibilityState === "visible") slideTo(1);
    }, autoPlayMs);

    return () => {
      clearInterval(timer);
      container?.removeEventListener("pointerenter", pause);
      container?.removeEventListener("pointerleave", resume);
      container?.removeEventListener("focusin", pause);
      container?.removeEventListener("focusout", resume);
    };
  }, [autoPlayMs, slideTo, total]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragStartX.current === null) return;
      const diff = dragStartX.current - e.clientX;
      dragStartX.current = null;
      if (Math.abs(diff) > 10) suppressClick.current = true;
      if (Math.abs(diff) > 50) slideTo(diff > 0 ? 1 : -1);
    },
    [slideTo],
  );

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

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
    onClickCapture,
  };
}
