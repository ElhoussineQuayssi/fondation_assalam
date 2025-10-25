import React from "react";
import Image from "next/image";

const TeamMemberCard = ({ name, role, imageSrc, imageAlt }) => (
  <div
    className="card-lift bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden text-center scroll-reveal"
    style={{ borderBottom: `4px solid #6495ED` }}
  >
    <div className="relative aspect-square w-full">
      <Image
        src={imageSrc}
        alt={imageAlt || name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        style={{ objectFit: "cover" }}
        className="grayscale hover:grayscale-0 transition-all duration-500"
      />
    </div>
    <div className="p-6">
      <h4 className="text-lg font-bold mb-1" style={{ color: "#333333" }}>
        {name}
      </h4>
      <p
        className="text-sm text-gray-600 font-medium"
        style={{ color: "#6495ED" }}
      >
        {role}
      </p>
    </div>
  </div>
);

export default TeamMemberCard;
