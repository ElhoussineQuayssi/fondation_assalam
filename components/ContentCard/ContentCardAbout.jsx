import React from "react";
import Image from "next/image";
import Link from "next/link";

const ContentCardAbout = ({
  title,
  description,
  imageSrc,
  imageAlt,
  link,
  className = "",
}) => (
  <div
    className={`bg-white rounded-xl p-6 shadow-lg border-t-4 border-opacity-70 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${className} scroll-reveal`}
    style={{ borderColor: "#6495ED" }}
  >
    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        className="grayscale hover:grayscale-0 transition-all duration-300"
      />
    </div>
    <h4 className="text-xl font-bold mb-2" style={{ color: "#333333" }}>
      {title}
    </h4>
    <p className="text-gray-700 text-sm mb-4">{description}</p>
    {link && (
      <Link
        href={link}
        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
        style={{ backgroundColor: "#6495ED", color: "white" }}
      >
        Voir plus
      </Link>
    )}
  </div>
);

export default ContentCardAbout;