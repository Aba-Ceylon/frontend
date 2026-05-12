"use client";

import { useCallback } from "react";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationControlsProps) {
  const goPrev = useCallback(
    () => onPageChange(Math.max(1, currentPage - 1)),
    [currentPage, onPageChange],
  );

  const goNext = useCallback(
    () => onPageChange(Math.min(totalPages, currentPage + 1)),
    [currentPage, totalPages, onPageChange],
  );

  if (totalPages <= 1) return null;

  return (
    <div className={`mt-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap ${className}`}>
      <button
        onClick={goPrev}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full border border-[#0b2545]/20 text-[#0b2545] font-cinzel disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#0b2545] hover:text-white transition"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const active = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={active ? "page" : undefined}
            className={`w-10 h-10 rounded-full font-cinzel transition ${
              active
                ? "bg-[#0b2545] text-white"
                : "border border-[#0b2545]/20 text-[#0b2545] hover:bg-[#0b2545] hover:text-white"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={goNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full border border-[#0b2545]/20 text-[#0b2545] font-cinzel disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#0b2545] hover:text-white transition"
      >
        Next
      </button>
    </div>
  );
}
