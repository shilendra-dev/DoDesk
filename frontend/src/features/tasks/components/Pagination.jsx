
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="sticky bottom-0 left-0 w-full bg-[var(--color-bg)] backdrop-blur-sm pt-2 pb-2 flex justify-center items-center space-x-2 text-sm text-[var(--color-text)] dark:text-[var(--color-text)] z-10 border-t border-[var(--color-border)] dark:border-[var(--color-border)]">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border border-[var(--color-border)] cursor-pointer hover:bg-[#374151] transition disabled:opacity-30"
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 rounded-md border text-[var(--color-text)] cursor-pointer border-gray-600 hover:bg-[var(--color-bg-secondary)] transition ${
            currentPage === index + 1
              ? "bg-indigo-600 text-[var(--color-text)] "
              : " hover:bg-[#374151]"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border text-[var(--color-text)] cursor-pointer border-gray-600 hover:bg-[var(--color-bg-secondary)] transition disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;