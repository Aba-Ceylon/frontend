"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * Site-wide motion, driven by data attributes:
 *   data-reveal            fade/lift the element in when it scrolls into view
 *   data-reveal-stagger    reveal each direct child in turn (grids, lists)
 *   data-spotlight         soft gold glow that follows the pointer (cards)
 *
 * Observers also pick up content that mounts later (lazy sections, client
 * fetched grids, pagination). Anything already on screen when the script
 * starts is left alone so nothing flashes after the first paint.
 */

const REVEAL_SELECTOR = "[data-reveal], [data-reveal-stagger] > *";
const STAGGER_MS = 90;

function revealTargets(root: ParentNode): HTMLElement[] {
  const found = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
  if (root instanceof HTMLElement && root.matches(REVEAL_SELECTOR)) found.unshift(root);
  return found;
}

export default function SiteMotion() {
  const pathname = usePathname();

  // Pointer spotlight: one delegated listener for every [data-spotlight] card.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const event = lastEvent;
      if (!event) return;
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Scroll reveals, re-armed on every route change.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<HTMLElement>();

    const reveal = (element: HTMLElement, delay: number) => {
      element.style.transitionDelay = `${delay}ms`;
      element.classList.add("reveal-run");
      element.classList.remove("reveal-pending");
      const done = () => {
        element.classList.remove("reveal-run");
        element.style.transitionDelay = "";
      };
      element.addEventListener("transitionend", done, { once: true });
      // Fallback in case no transition fires (e.g. display changes).
      window.setTimeout(done, 1400 + delay);
    };

    const intersection = new IntersectionObserver(
      (entries) => {
        const batch = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          );

        batch.forEach((element, index) => {
          intersection.unobserve(element);
          const staggered = element.parentElement?.hasAttribute("data-reveal-stagger");
          reveal(element, staggered ? Math.min(index, 6) * STAGGER_MS : 0);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const arm = (elements: HTMLElement[], allowInView: boolean) => {
      const viewportHeight = window.innerHeight;
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        if (!allowInView && element.getBoundingClientRect().top < viewportHeight * 0.92) {
          return;
        }
        element.classList.add("reveal-pending");
        intersection.observe(element);
      });
    };

    // Existing content: only arm what is still below the fold.
    arm(revealTargets(document), false);

    // New content has not been painted yet, so it can animate even in view.
    const mutation = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) arm(revealTargets(node), true);
        });
      });
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refresh);
      mutation.disconnect();
      intersection.disconnect();
      document
        .querySelectorAll(".reveal-pending")
        .forEach((element) => element.classList.remove("reveal-pending"));
    };
  }, [pathname]);

  return null;
}
