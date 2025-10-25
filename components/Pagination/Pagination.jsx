import React from "react";
import Link from "next/link";

/**
 * Pagination component (Accent style on active page).
 */
const Pagination = ({ currentPage, totalPages, basePath, activeCategory }) => {
  if (totalPages <= 1) return null;

  const createHref = (page) => {
    const params = new URLSearchParams();
    params.set("page", page);
    if (activeCategory) {
      params.set("category", activeCategory);
    }
    return `${basePath}?${params.toString()}`;
  };

  // Calculate pages to show (e.g., max 5 visible pages centered around current)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-16">
      {/* Previous Button */}
      <Link
        href={createHref(currentPage - 1)}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:opacity-80"}`}
        style={{ color: "#333333" }}
      >
        &larr; Page précédente
      </Link>

      {/* Page Numbers */}
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={createHref(page)}
            className="w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-200 hover:opacity-80"
            style={{
              backgroundColor: isActive ? "#6495ED" : "white",
              color: isActive ? "white" : "#333333",
              border: `2px solid ${isActive ? "#6495ED" : "#B0E0E6"}`,
            }}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      <Link
        href={createHref(currentPage + 1)}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:opacity-80"}`}
        style={{ color: "#333333" }}
      >
        Page suivante &rarr;
      </Link>
    </div>
  );
};

export default Pagination;
