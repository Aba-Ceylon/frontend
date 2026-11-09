"use client";

import { useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <nav
      aria-label="Pagination"
      className={`mt-14 flex flex-wrap items-center justify-center gap-3 ${className}`}
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="round-btn round-btn-light"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const active = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={active ? "page" : undefined}
            aria-label={`Page ${page}`}
            className={`h-11 w-11 rounded-full font-cinzel text-sm transition-colors ${
              active
                ? "bg-[#182231] text-white"
                : "text-[#182231]/70 hover:bg-[#182231]/8 hover:text-[#182231]"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={goNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="round-btn round-btn-light"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
