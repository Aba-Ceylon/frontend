"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PackageImageCarousel from "@/features/packages/PackageImageCarousel";
import { SectionKicker } from "@/components/ui/Teardrop";

/** Full-height photo header for package, stay and vehicle pages. */
export function DetailHero({
  images,
  title,
  eyebrow,
  backHref,
  backLabel,
  entityLabel,
  children,
}: {
  images: string[];
  title: string;
  eyebrow: string;
  backHref: string;
  backLabel: string;
  entityLabel?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative flex h-[86svh] min-h-[560px] items-end overflow-hidden bg-[var(--navy-deep)]">
      <div className="absolute inset-0">
        <PackageImageCarousel images={images} title={title} variant="hero" entityLabel={entityLabel} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,24,0.6)_0%,rgba(10,15,24,0.08)_30%,rgba(10,15,24,0.42)_56%,rgba(10,15,24,0.9)_100%)]" />

      <div className="pointer-events-none relative mx-auto w-full max-w-[1360px] px-6 pb-24 sm:pb-28 lg:px-10">
        <Link
          href={backHref}
          className="pointer-events-auto hero-rise inline-flex items-center gap-2 font-cinzel text-[11px] uppercase tracking-[0.2em] text-white/80 transition hover:text-[#e2c27a]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
        <div className="hero-rise mt-8" style={{ animationDelay: "0.1s" }}>
          <SectionKicker tone="dark">{eyebrow}</SectionKicker>
        </div>
        <h1
          className="hero-rise mt-4 max-w-5xl font-cinzel text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.98] text-white [text-wrap:balance]"
          style={{ animationDelay: "0.2s" }}
        >
          {title}
        </h1>
        {children ? (
          <div className="hero-rise mt-7" style={{ animationDelay: "0.35s" }}>
            {children}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/** Glassy pill used for key facts in the detail header. */
export function FactPill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
      <span className="text-[#e2c27a]">{icon}</span>
      {children}
    </span>
  );
}

/** Two-column body: story on the left, a booking panel that sticks while you read. */
export function DetailBody({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <div className="bg-[var(--ivory)]">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:px-10 lg:py-24">
        <aside className="lg:order-last">
          <div className="lg:sticky lg:top-28">{aside}</div>
        </aside>
        <div className="min-w-0 space-y-16">{children}</div>
      </div>
    </div>
  );
}

/** Navy booking card for the sticky aside. */
export function BookingPanel({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-[var(--navy-deep)] p-7 text-white shadow-[0_30px_70px_-30px_rgba(13,20,30,0.6)] sm:p-8" data-reveal>
      <SectionKicker tone="dark">{kicker}</SectionKicker>
      <p className="mt-4 font-cinzel text-2xl leading-snug">{title}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Section heading inside a detail page body. */
export function DetailSection({
  kicker,
  title,
  children,
  aside,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section data-reveal>
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionKicker>{kicker}</SectionKicker>
          <h2 className="mt-4 font-cinzel text-3xl leading-tight text-[#182231] sm:text-4xl">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** Large first image plus a grid of the rest. */
export function GalleryGrid({ images, title }: { images: string[]; title: string }) {
  if (!images.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {images.map((image, index) => (
        <figure
          key={`${image}-${index}`}
          className={`card-zoom group relative overflow-hidden bg-[#182231] ${
            index === 0 || (index === images.length - 1 && images.length % 2 === 0)
              ? "col-span-2 aspect-[16/9]"
              : "aspect-[4/3]"
          }`}
        >
          <Image
            src={image}
            alt={`${title}, photo ${index + 1} of ${images.length}`}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  );
}
