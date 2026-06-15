"use client";

interface SectionHeaderProps {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
  eyebrow?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  title,
  description,
  titleClassName = "font-cinzel text-4xl font-medium leading-tight text-[#101A28] sm:text-5xl lg:text-[3.45rem]",
  descriptionClassName = "mx-auto max-w-2xl text-base leading-8 text-[#3B4654] sm:text-lg",
  className = "",
  eyebrow,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div className={`mb-12 ${alignClass} ${className}`} data-reveal>
      {eyebrow ? (
        <p className="mb-4 font-cinzel text-[11px] uppercase tracking-[0.32em] text-[#A97B17]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mb-4 ${titleClassName}`}>{title}</h2>
      {description ? (
        <p className={`${align === "left" ? "mx-0" : "mx-auto"} ${descriptionClassName}`}>
          {description}
        </p>
      ) : null}
      <div
        className={`mt-6 h-px w-20 bg-linear-to-r from-[#C99A2B] to-transparent ${align === "left" ? "" : "mx-auto"}`}
        data-draw-line
      />
    </div>
  );
}
