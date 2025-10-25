import React from "react";
import Link from "next/link";

/**
 * Category Filter component (Accent style on active).
 */
const CategoryFilter = ({ categories, activeCategory, basePath }) => (
  <div className="mb-16 flex flex-wrap gap-4 justify-center">
    {/* 'Tous' link */}
    <Link
      href={basePath}
      className="text-lg font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-md"
      style={{
        backgroundColor: !activeCategory ? "#6495ED" : "white",
        color: !activeCategory ? "white" : "#333333",
        border: `2px solid #6495ED`,
      }}
    >
      Tous les Récits
    </Link>
    {/* Category links */}
    {categories.map((cat) => {
      const isActive = cat === activeCategory;
      return (
        <Link
          key={cat}
          href={`${basePath}?category=${cat}`}
          className="text-lg font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: isActive ? "#6495ED" : "white",
            color: isActive ? "white" : "#333333",
            border: `2px solid #6495ED`,
          }}
        >
          {cat}
        </Link>
      );
    })}
  </div>
);

export default CategoryFilter;
