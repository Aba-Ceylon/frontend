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
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`mt-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full border border-[#0b2545]/20 text-[#0b2545] font-cinzel disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#0b2545] hover:text-white transition"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        const active = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            aria-current={active ? "page" : undefined}
            className={`w-10 h-10 rounded-full font-cinzel transition ${
              active
                ? "bg-[#0b2545] text-white"
                : "border border-[#0b2545]/20 text-[#0b2545] hover:bg-[#0b2545] hover:text-white"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full border border-[#0b2545]/20 text-[#0b2545] font-cinzel disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#0b2545] hover:text-white transition"
      >
        Next
      </button>
    </div>
  );
}