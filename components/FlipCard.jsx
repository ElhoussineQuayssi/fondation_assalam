"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal/ScrollReveal";

function FlipCard({
  frontContent,
  backContent,
  className = "",
  onClick,
  index,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onClick?.();
  };

  return (
    <ScrollReveal delay={index ? index * 0.1 : 0}>
      <div
        className={`relative w-full max-w-[300px] h-[400px] cursor-pointer [perspective:1000px] mx-auto ${className}`}
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
        >
          <div className="absolute w-full h-full [backface-visibility:hidden]">
            {frontContent}
          </div>
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
            {backContent}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}


export { FlipCard };