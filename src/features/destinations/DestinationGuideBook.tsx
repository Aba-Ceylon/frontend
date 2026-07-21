"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Sparkles, Star } from "lucide-react";

type GuidePage = {
  label: string;
  title: string;
  kind: "season" | "reason" | "highlights";
};

type TurnState = {
  from: number;
  to: number;
  direction: "forward" | "backward";
};

const TURN_DURATION_MS = 760;

const pages: GuidePage[] = [
  { label: "Season notes", title: "Best time to visit", kind: "season" },
  { label: "The reason", title: "Why visit", kind: "reason" },
  { label: "Do not miss", title: "Key highlights", kind: "highlights" },
];

function Prose({ children }: { children: string }) {
  const blocks = children
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-[15px] leading-8 text-[#302c25]/76 sm:text-base">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const isList = lines.length > 1 && lines.every((line) => /^[-•*]/.test(line));

        if (isList) {
          return (
            <ul key={index} className="space-y-3">
              {lines.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#9b7422]" />
                  <span>{line.replace(/^[-•*]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={index} className="whitespace-pre-line">{block}</p>;
      })}
    </div>
  );
}

function PageContent({
  page,
  pageNumber,
  destinationName,
  bestTimeToVisit,
  whyVisit,
  highlights,
}: {
  page: GuidePage;
  pageNumber: number;
  destinationName: string;
  bestTimeToVisit: string;
  whyVisit: string;
  highlights: string[];
}) {
  const Icon = page.kind === "season" ? CalendarDays : page.kind === "reason" ? Sparkles : Star;

  return (
    <div className="destination-paper-content">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#9b7422]">{page.label}</p>
          <h3 className="mt-3 font-cinzel text-3xl leading-[1.05] text-[#29251f] sm:text-4xl">{page.title}</h3>
        </div>
        <Icon className="h-6 w-6 shrink-0 text-[#9b7422]" strokeWidth={1.4} />
      </div>

      <div className="my-7 h-px bg-[linear-gradient(90deg,#9b7422,rgba(155,116,34,0.08))]" />

      <div className="destination-paper-copy">
        {page.kind === "season" ? <Prose>{bestTimeToVisit}</Prose> : null}
        {page.kind === "reason" ? <Prose>{whyVisit}</Prose> : null}
        {page.kind === "highlights" ? (
          <ol className="space-y-5">
            {highlights.map((highlight, index) => (
              <li key={highlight} className="grid grid-cols-[34px_1fr] gap-4 text-[15px] leading-7 text-[#302c25]/78 sm:text-base">
                <span className="font-cinzel text-sm text-[#9b7422]">{String(index + 1).padStart(2, "0")}</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <div className="mt-auto flex items-end justify-between gap-5 border-t border-[#5f5545]/12 pt-5">
        <p className="max-w-[70%] font-cinzel text-[9px] uppercase tracking-[0.18em] text-[#302c25]/42">{destinationName} field notes</p>
        <p className="font-cinzel text-xs text-[#9b7422]">{pageNumber} / {pages.length}</p>
      </div>
    </div>
  );
}

export default function DestinationGuideBook({
  destinationName,
  bestTimeToVisit,
  whyVisit,
  highlights,
}: {
  destinationName: string;
  bestTimeToVisit: string;
  whyVisit: string;
  highlights: string[];
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [turn, setTurn] = useState<TurnState | null>(null);

  const turnTo = useCallback((nextPage: number) => {
    if (turn || nextPage < 0 || nextPage >= pages.length || nextPage === currentPage) return;

    const direction = nextPage > currentPage ? "forward" : "backward";
    setTurn({ from: currentPage, to: nextPage, direction });
    window.setTimeout(() => {
      setCurrentPage(nextPage);
      setTurn(null);
    }, TURN_DURATION_MS);
  }, [currentPage, turn]);

  const baseIndex = turn?.direction === "forward" ? turn.to : currentPage;
  const turningIndex = turn?.direction === "forward" ? turn.from : turn?.to;
  const contentProps = { destinationName, bestTimeToVisit, whyVisit, highlights };

  return (
    <section className="overflow-hidden bg-[#182231] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl" data-reveal>
          <p className="font-cinzel text-[10px] uppercase tracking-[0.26em] text-[#d5aa47]">Turn the page</p>
          <h2 className="mt-4 font-cinzel text-4xl leading-[1.06] sm:text-5xl">A field guide to {destinationName}</h2>
          <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base">Three essential notes, collected as pages. Use the controls or your keyboard arrows to explore them.</p>
        </div>

        <div
          className="destination-book-stage focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#d5aa47]"
          data-reveal
          aria-live="polite"
          aria-label="Destination field guide. Use left and right arrow keys to turn pages."
          role="group"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") turnTo(currentPage + 1);
            if (event.key === "ArrowLeft") turnTo(currentPage - 1);
          }}
        >
          <div className="destination-book-shadow" />
          <div className="destination-paper-sheet destination-paper-base">
            <PageContent page={pages[baseIndex]} pageNumber={baseIndex + 1} {...contentProps} />
          </div>

          {turn && turningIndex !== undefined ? (
            <div key={`${turn.from}-${turn.to}`} className={`destination-paper-sheet destination-paper-turning destination-paper-${turn.direction}`}>
              <PageContent page={pages[turningIndex]} pageNumber={turningIndex + 1} {...contentProps} />
            </div>
          ) : null}
        </div>

        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2" aria-label="Guide pages">
            {pages.map((page, index) => (
              <button key={page.title} type="button" onClick={() => turnTo(index)} disabled={Boolean(turn)} aria-label={`Open ${page.title}`} aria-current={index === currentPage ? "page" : undefined} className={`h-1.5 transition-all ${index === currentPage ? "w-10 bg-[#d5aa47]" : "w-5 bg-white/24 hover:bg-white/50"}`} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <button type="button" onClick={() => turnTo(currentPage - 1)} disabled={currentPage === 0 || Boolean(turn)} className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/18 px-5 font-cinzel text-[10px] uppercase tracking-[0.18em] transition hover:border-[#d5aa47] hover:text-[#d5aa47] disabled:cursor-not-allowed disabled:opacity-30">
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button type="button" onClick={() => turnTo(currentPage + 1)} disabled={currentPage === pages.length - 1 || Boolean(turn)} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#d5aa47] px-5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#182231] transition hover:bg-[#e4bd61] disabled:cursor-not-allowed disabled:opacity-30">
              Next page <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
