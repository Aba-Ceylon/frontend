"use client";

import { Destination } from "@/types/destination";
import { useEffect } from "react";
import { getMapLegendCategory, mapCategoryStyles } from "./mapCategoryUtils";

interface DestinationPanelProps {
  destination: Destination;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function DestinationPanel({
  destination,
  onClose,
  actionLabel,
  onAction,
}: DestinationPanelProps) {
  const displayCategory = getMapLegendCategory(destination);
  const categoryStyle = mapCategoryStyles[displayCategory];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      <div
        className="absolute inset-0 z-20 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-3 top-3 z-30 flex items-center justify-center px-3 sm:bottom-4 sm:top-4 sm:px-4">
        <div className="h-full max-h-full w-full max-w-3xl overflow-hidden bg-[#FBF8F2] shadow-2xl animate-slideUp">
          <div className="flex h-full flex-col">
            <div
              className={`${categoryStyle.bgClass} relative border-b border-black/10 p-4 pr-14 text-white sm:p-6 sm:pr-16`}
            >
              <button
                onClick={onClose}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/18 bg-white/10 transition-colors hover:bg-white/18 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                aria-label="Close destination panel"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div>
                <div className="mb-3 inline-flex border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] sm:text-sm">
                  {displayCategory}
                </div>
                <h2 className="pr-2 font-cinzel text-2xl font-bold sm:text-3xl">
                  {destination.name}
                </h2>
                <p className="mt-2 font-cinzel text-sm leading-6 text-white/90 sm:text-lg sm:leading-7">
                  {destination.summary}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mb-6 flex flex-wrap gap-2">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryStyle.softClass}`}
                >
                  {displayCategory}
                </span>
                <span className="inline-flex border border-[#182231]/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                  {destination.region}
                </span>
                <span className="inline-flex border border-[#182231]/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                  {destination.district}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 font-cinzel text-lg font-semibold text-gray-900">
                  About
                </h3>
                <p className="font-cinzel leading-relaxed text-gray-700">
                  {destination.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-cinzel text-lg font-semibold text-gray-900">
                  Key Highlights
                </h3>
                <ul className="space-y-2">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span
                        className={`${categoryStyle.bgClass} mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center`}
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="font-cinzel text-gray-700">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 border border-[#182231]/10 bg-white p-4">
                <h3 className="mb-1 flex items-center gap-2 font-cinzel text-sm font-semibold text-[#182231]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Best Time to Visit
                </h3>
                <p className="font-cinzel text-[#445062]">
                  {destination.bestTimeToVisit}
                </p>
              </div>

              <div className={`border ${categoryStyle.borderClass} bg-white p-4`}>
                <h3 className="mb-2 flex items-center gap-2 font-cinzel text-sm font-semibold text-gray-900">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Why Visit
                </h3>
                <p className="font-cinzel leading-relaxed text-gray-700">
                  {destination.whyVisit}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#182231]/10 bg-white p-4 sm:flex-row sm:p-6">
              <button
                onClick={onClose}
                className="flex-1 border border-[#182231]/18 bg-white px-6 py-3 font-cinzel font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onAction}
                disabled={!onAction}
                className={`flex-1 px-6 py-3 font-cinzel font-medium text-white transition-opacity ${categoryStyle.bgClass} ${
                  onAction
                    ? "hover:opacity-90"
                    : "cursor-not-allowed opacity-60"
                }`}
              >
                {actionLabel || "Add to Planner"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
