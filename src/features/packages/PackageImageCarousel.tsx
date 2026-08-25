"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PackageImageCarouselProps = {
  images: string[];
  title: string;
  variant: "card" | "hero";
  entityLabel?: string;
};

export default function PackageImageCarousel({
  images,
  title,
  variant,
  entityLabel = "package",
}: PackageImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselId = useId();
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;
  const activeImage = images[activeIndex] ?? images[0];

  const goTo = (index: number) => {
    setActiveIndex((index + imageCount) % imageCount);
  };

  const isHero = variant === "hero";

  return (
    <div
      id={carouselId}
      className="pointer-events-none relative h-full w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label={`${title} images`}
    >
      <Image
        key={activeImage}
        src={activeImage}
        alt={`${title} — image ${activeIndex + 1} of ${imageCount}`}
        fill
        priority={isHero}
        loading={isHero ? undefined : "lazy"}
        sizes={
          isHero
            ? "100vw"
            : "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        }
        className="object-cover transition-transform duration-700"
      />

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label={`Show previous ${entityLabel} image`}
            className={`pointer-events-auto absolute left-3 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#101A28]/55 text-white backdrop-blur-sm transition hover:bg-[#101A28]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              isHero ? "h-11 w-11 sm:left-6 sm:h-12 sm:w-12" : "h-9 w-9"
            }`}
          >
            <ChevronLeft className={isHero ? "h-5 w-5" : "h-4 w-4"} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label={`Show next ${entityLabel} image`}
            className={`pointer-events-auto absolute right-3 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#101A28]/55 text-white backdrop-blur-sm transition hover:bg-[#101A28]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              isHero ? "h-11 w-11 sm:right-6 sm:h-12 sm:w-12" : "h-9 w-9"
            }`}
          >
            <ChevronRight className={isHero ? "h-5 w-5" : "h-4 w-4"} aria-hidden="true" />
          </button>

          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between gap-3 bg-linear-to-t from-black/60 to-transparent ${
              isHero ? "px-6 pb-5 pt-14 sm:px-10 sm:pb-7" : "px-4 pb-3 pt-10"
            }`}
          >
            <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-white/90" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} / {String(imageCount).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-1.5" aria-label={`Choose ${entityLabel} image`}>
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={`pointer-events-auto h-2 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    index === activeIndex ? "w-5 bg-white" : "w-2 bg-white/55 hover:bg-white/85"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
