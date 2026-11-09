"use client";

import { SectionKicker } from "@/components/ui/Teardrop";

interface SectionHeaderProps {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
  eyebrow?: string;
  align?: "left" | "center";
  /** "dark" for navy sections: light title and soft-gold label. */
  tone?: "light" | "dark";
}

export default function SectionHeader({
  title,
  description,
  titleClassName,
  descriptionClassName,
  className = "",
  eyebrow,
  align = "center",
  tone = "light",
}: SectionHeaderProps) {
  const isDark = tone === "dark";
  const alignClass = align === "left" ? "text-left" : "text-center";
  const titleClasses =
    titleClassName ??
    `font-cinzel text-4xl leading-[1.1] sm:text-5xl ${isDark ? "text-white" : "text-[#182231]"}`;
  const descriptionClasses =
    descriptionClassName ??
    `max-w-2xl text-base leading-8 ${isDark ? "text-white/68" : "text-[#182231]/68"}`;

  return (
    <div className={`mb-12 ${alignClass} ${className}`} data-reveal>
      {eyebrow ? (
        <SectionKicker tone={tone} align={align} className="mb-5">
          {eyebrow}
        </SectionKicker>
      ) : null}
      <h2 className={titleClasses}>{title}</h2>
      {description ? (
        <p className={`mt-5 ${align === "left" ? "mx-0" : "mx-auto"} ${descriptionClasses}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
