"use client";

import { Destination } from "@/types/destination";
import { useEffect } from "react";

interface DestinationPanelProps {
  destination: Destination;
  onClose: () => void;
}

export default function DestinationPanel({
  destination,
  onClose,
}: DestinationPanelProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const categoryColors = {
    Heritage: "bg-amber-600",
    Nature: "bg-emerald-600",
    Adventure: "bg-red-600",
    Coastal: "bg-sky-600",
  };

  const categoryBorders = {
    Heritage: "border-amber-600",
    Nature: "border-emerald-600",
    Adventure: "border-red-600",
    Coastal: "border-sky-600",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 z-20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-2xl max-h-[85vh] overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl mx-4 overflow-hidden animate-slideUp">
          {/* Header */}
          <div
            className={`${categoryColors[destination.category]} p-6 text-white relative`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
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

            <div className="pr-12">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3 font-cinzel">
                {destination.category}
              </div>
              <h2 className="text-3xl font-bold mb-2 font-cinzel">
                {destination.name}
              </h2>
              <p className="text-white/90 text-lg font-cinzel">
                {destination.summary}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
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
                      className={`${categoryColors[destination.category]} w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
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
              className={`p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-l-4 ${categoryBorders[destination.category]}`}
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
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors font-cinzel"
            >
              Close
            </button>
            <button
              className={`flex-1 px-6 py-3 ${categoryColors[destination.category]} text-white rounded-lg font-medium hover:opacity-90 transition-opacity font-cinzel`}
            >
              Add to Planner
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
