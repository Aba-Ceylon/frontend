import type { ReactNode } from "react";
import { SectionKicker } from "@/components/ui/Teardrop";

/** Heading row that opens a listing page: label, title, intro and an aside (count, filters). */
export default function ListingIntro({
  kicker,
  title,
  description,
  aside,
}: {
  kicker: string;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <div
      className="mb-12 flex flex-col gap-8 border-b border-[#182231]/12 pb-10 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
      data-reveal
    >
      <div className="max-w-2xl">
        <SectionKicker>{kicker}</SectionKicker>
        <h2 className="mt-5 font-cinzel text-4xl leading-[1.1] text-[#182231] sm:text-5xl">{title}</h2>
        {description ? (
          <p className="mt-5 text-base leading-8 text-[#182231]/68">{description}</p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}

export function ResultCount({ count, noun }: { count: number; noun: string }) {
  return (
    <p className="font-cinzel text-sm tracking-[0.08em] text-[#182231]/70" aria-live="polite">
      <span className="text-3xl text-[#9b7422]">{String(count).padStart(2, "0")}</span>{" "}
      {noun}
      {count === 1 ? "" : "s"}
    </p>
  );
}
