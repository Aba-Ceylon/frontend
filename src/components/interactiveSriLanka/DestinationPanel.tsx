"use client";

import { Destination } from "@/types/destination";
import { useEffect } from "react";
import { getMapLegendCategory, mapCategoryStyles } from "./mapCategoryUtils";

interface DestinationPanelProps {
  destination: Destination;
  onClose: () => void;
}

export default function DestinationPanel({
  destination,
  onClose,
}: DestinationPanelProps) {
  const displayCategory = getMapLegendCategory(destination);
  const categoryStyle = mapCategoryStyles[displayCategory];

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 z-20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-x-0 top-3 bottom-3 z-30 flex items-center justify-center px-3 sm:top-4 sm:bottom-4 sm:px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-full max-h-full overflow-hidden animate-slideUp sm:rounded-3xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div
              className={`${categoryStyle.bgClass} relative p-4 pr-14 text-white sm:p-6 sm:pr-16`}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors sm:top-4 sm:right-4 sm:h-10 sm:w-10"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
                <div className="inline-flex px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium mb-3 font-cinzel uppercase tracking-[0.2em]">
                  {displayCategory}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 font-cinzel pr-2">
                  {destination.name}
                </h2>
                <p className="text-white/90 text-sm sm:text-lg leading-6 sm:leading-7 font-cinzel">
                  {destination.summary}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mb-6 flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${categoryStyle.softClass}`}
                >
                  {displayCategory}
                </span>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase text-slate-700">
                  {destination.region}
                </span>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase text-slate-700">
                  {destination.district}
                </span>
              </div>
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cinzel">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed font-cinzel">
                  {destination.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cinzel">
                  Key Highlights
                </h3>
                <ul className="space-y-2">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span
                        className={`${categoryStyle.bgClass} w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
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
                      <span className="text-gray-700 font-cinzel">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best Time to Visit */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2 font-cinzel">
                  <svg
                    className="w-5 h-5"
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
                <p className="text-blue-800 font-cinzel">
                  {destination.bestTimeToVisit}
                </p>
              </div>

              {/* Why Visit */}
              <div
                className={`p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-l-4 ${categoryStyle.borderClass}`}
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2 font-cinzel">
                  <svg
                    className="w-5 h-5"
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
                  Why Visit This Place
                </h3>
                <p className="text-gray-700 leading-relaxed font-cinzel">
                  {destination.whyVisit}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors font-cinzel"
              >
                Close
              </button>
              <button
                className={`flex-1 px-6 py-3 ${categoryStyle.bgClass} text-white rounded-lg font-medium hover:opacity-90 transition-opacity font-cinzel`}
              >
                Add to Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
