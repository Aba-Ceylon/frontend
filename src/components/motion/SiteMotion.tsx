"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      reveals.forEach((element, index) => {
        const revealY = Number(element.dataset.revealY ?? 36);
        const revealDelay =
          Number(element.dataset.revealDelay ?? 0) + index * 0.02;

        gsap.fromTo(
          element,
          { opacity: 0, y: revealY },
          {
            opacity: 1,
            y: 0,
            duration: 0.92,
            delay: revealDelay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      const parallaxElements =
        gsap.utils.toArray<HTMLElement>("[data-parallax]");
      parallaxElements.forEach((element) => {
        const yPercent = Number(element.dataset.parallax ?? 12);
        const trigger =
          element.closest<HTMLElement>("[data-parallax-root]") ?? element;

        gsap.to(element, {
          yPercent,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
      });

      const lineElements = gsap.utils.toArray<HTMLElement>("[data-draw-line]");
      lineElements.forEach((element) => {
        gsap.fromTo(
          element,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [pathname]);

  return null;
}
