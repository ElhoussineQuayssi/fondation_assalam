import React from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

const ContentCard = ({
  title,
  excerpt,
  image,
  imageAlt,
  link,
  category,
  date,
  index,
  className = "",
}) => (
  <ScrollReveal delay={index ? index * 0.1 : 0}>
    <div
      className={`card-lift bg-white rounded-xl p-6 shadow-lg border-t-4 border-opacity-70 text-center transition-all duration-300 ${className}`}
      style={{ borderColor: "#6495ED" }}
    >
      <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="grayscale hover:grayscale-0 transition-all duration-300"
          priority={index === 0}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        />
      </div>
      {category && (
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
          style={{ backgroundColor: "#B0E0E6", color: "#6495ED" }}
        >
          {category}
        </span>
      )}
      <h4 className="text-xl font-bold mb-2" style={{ color: "#333333" }}>
        {title}
      </h4>
      <p className="text-gray-700 text-sm mb-4">{excerpt}</p>
      {date && (
        <p className="text-xs text-gray-500 mb-4">
          {new Date(date).toLocaleDateString("fr-FR")}
        </p>
      )}
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
  </ScrollReveal>
);

export default ContentCard;
