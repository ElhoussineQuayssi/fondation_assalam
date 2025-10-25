import React from "react";

/**
 * Replacement for ProjectContentSection, provides structure and H2 title styling.
 */
const ProjectContentSection = ({ title, children, className = "" }) => (
  <section className={`pt-8 ${className}`}>
    {title && (
      // H2 Typography Pattern: Bold title with accent underline
      <h2
        className="text-4xl font-bold mb-8 border-b-4 border-opacity-50 pb-2 inline-block scroll-reveal"
        style={{ color: "#333333", borderColor: "#6495ED80" }} // 80 is 50% opacity
      >
        {title}
      </h2>
    )}
    <div className="space-y-10">{children}</div>
  </section>
);

export default ProjectContentSection;
