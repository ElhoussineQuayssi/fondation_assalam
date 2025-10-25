import React from "react";
import Image from "next/image";

/**
 * Replacement for ProjectGallery, simple image grid with hover effect.
 */
const ProjectGallery = ({ images, projectTitle, className = "" }) => (
  <div className={`space-y-4 ${className} scroll-reveal`}>
    <h3
      className="text-2xl font-bold mb-6 pl-3 border-l-4 border-opacity-70"
      style={{ color: "#333333", borderColor: "#6495EDB3" }} // B3 is 70% opacity
    >
      Images de l'Impact
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.slice(0, 6).map((imageSrc, index) => (
        <div
          key={index}
          className="relative aspect-square rounded-xl overflow-hidden shadow-md group transition duration-300 hover:scale-[1.02] hover:shadow-xl scroll-reveal"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Image
            src={imageSrc}
            alt={`${projectTitle} photo ${index + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition duration-300 group-hover:scale-105"
          />
          {/* Use inline style for hover overlay background color */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "#6495ED1A" }} // 1A is 10% opacity
          ></div>
        </div>
      ))}
    </div>
  </div>
);

export default ProjectGallery;
