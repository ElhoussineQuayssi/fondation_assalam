import React from "react";
import { Target, Eye } from "lucide-react";

const MissionVisionCard = ({ type, title, description }) => {
  const Icon = type === "mission" ? Target : Eye;
  return (
    <div
      className="card-lift bg-white rounded-2xl p-8 shadow-xl border-l-8 scroll-reveal"
      style={{ borderColor: type === "mission" ? "#6495ED" : "#B0E0E6" }}
    >
      <Icon className="h-10 w-10 mb-4" style={{ color: "#6495ED" }} />
      <h3 className="text-2xl font-bold mb-4" style={{ color: "#333333" }}>
        {title}
      </h3>
      <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default MissionVisionCard;
