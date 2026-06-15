"use client";

interface StepHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function StepHeader({
  eyebrow,
  title,
  description,
}: StepHeaderProps) {
  return (
    <div data-reveal>
      <p className="mb-2 font-cinzel text-[11px] uppercase tracking-[0.32em] text-amber-700">
        {eyebrow}
      </p>
      <h2 className="font-cinzel text-3xl text-[#182231] sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-base leading-8 text-[#445062]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
