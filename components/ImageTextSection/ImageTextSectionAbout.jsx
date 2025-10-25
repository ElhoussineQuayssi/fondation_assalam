import React from "react";
import Image from "next/image";

const ImageTextSection = ({
  title,
  content,
  imageSrc,
  imageAlt,
  layout = "image-right",
}) => {
  const isImageLeft = layout === "image-left";

  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center py-12 scroll-reveal">
      {/* Image Block */}
      <div
        className={`relative h-96 rounded-xl overflow-hidden shadow-2xl ${isImageLeft ? "md:order-1" : "md:order-2"}`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          className="filter grayscale opacity-70 transition duration-500"
        />
        <div
          className="absolute inset-0 border-b-8 border-opacity-70 pointer-events-none"
          style={{ borderColor: "#6495ED" }}
        ></div>
      </div>

      {/* Text Content */}
      <div className={`space-y-4 ${isImageLeft ? "md:order-2" : "md:order-1"}`}>
        <h2
          className={`text-4xl font-bold mb-4 border-b-4 border-opacity-50 pb-2 inline-block`}
          style={{ color: "#333333", borderColor: "#6495ED80" }}
        >
          {title}
        </h2>
        <div className="text-lg text-gray-700 leading-relaxed">{content}</div>
      </div>
    </div>
  );
};

export default ImageTextSection;
