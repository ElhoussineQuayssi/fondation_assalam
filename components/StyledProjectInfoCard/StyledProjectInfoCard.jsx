import React from "react";

/**
 * Replacement for ProjectInfoCard, using the Content/Stats Card pattern.
 */
const StyledProjectInfoCard = ({ label, value, icon: Icon, index }) => (
  <div
    className="card-lift bg-white rounded-xl p-6 shadow-lg border-t-4 text-center scroll-reveal transition duration-300 hover:shadow-xl hover:scale-[1.02]"
    style={{ animationDelay: `${index * 0.15}s`, borderColor: "#6495EDB3" }} // B3 is 70% opacity
  >
    <div className="mb-3 mx-auto" style={{ color: "#6495ED" }}>
      <Icon className="h-8 w-8 mx-auto" />
    </div>
    {/* FIX: Replaced text-gray-600 with MUTED_TEXT constant */}
    <div
      className="text-sm font-semibold uppercase tracking-wider mb-1"
      style={{ color: "#767676" }}
    >
      {label}
    </div>
    <div className="text-2xl font-bold" style={{ color: "#333333" }}>
      {value}
    </div>
  </div>
);

export default StyledProjectInfoCard;
