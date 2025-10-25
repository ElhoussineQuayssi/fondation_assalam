import React from "react";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

/**
 * Header for Blog listing page (Hero Section pattern).
 */
const BlogHeader = ({ title, subtitle }) => (
  <ScrollReveal>
    <header
      className="py-24 mb-16 rounded-3xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: "#B0E0E6" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* H1 Typography Pattern: Oversized, bold, with staggered accent color */}
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
          style={{ color: "#333333" }}
        >
          {title.split(" ").map((word, index) => (
            <span
              key={index}
              style={{ color: index % 2 === 0 ? "#6495ED" : "#333333" }}
            >
              {word}{" "}
            </span>
          ))}
        </h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: "#333333D9" }}>
          {subtitle}
        </p>
      </div>
    </header>
  </ScrollReveal>
);

export default BlogHeader;
