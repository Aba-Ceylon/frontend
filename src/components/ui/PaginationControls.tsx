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
        className="border border-[#182231]/14 px-4 py-2 font-cinzel text-[#182231] transition hover:bg-[#182231] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
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
            className={`h-10 w-10 font-cinzel transition ${
              active
                ? "bg-[#182231] text-white"
                : "border border-[#182231]/14 text-[#182231] hover:bg-[#182231] hover:text-white"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={goNext}
        disabled={currentPage === totalPages}
        className="border border-[#182231]/14 px-4 py-2 font-cinzel text-[#182231] transition hover:bg-[#182231] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        Next
      </button>
    </div>
  );
}
