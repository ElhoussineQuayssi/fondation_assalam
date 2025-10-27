"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Heart, Users, Target, ChevronDown } from "lucide-react";
import Image from "next/image"
// Removed imports: Image from "next/image" and Button from "./Button/Button"

// --- Sub-Components (Concise & Grou
// 1. Animated Background Pattern
const BackgroundPattern = () => (
    <div className="absolute inset-0 opacity-15" aria-hidden="true">
        {[20, 50, 80, 45, 70, 95].map((top, i) => (
            <div
                key={i}
                className={`absolute bg-white rounded-full animate-pulse-slow`}
                style={{
                    top: `${top}%`,
                    left: `${i * 15}%`,
                    width: `${10 + i * 2}px`,
                    height: `${10 + i * 2}px`,
                    animationDelay: `${i * 0.5}s`,
                    filter: 'blur(1px)'
                }}
            />
        ))}
    </div>
);

// 2. Decorative Icons
const DecorativeIcons = () => (
    <div className="flex justify-center space-x-6 mb-8 opacity-90" aria-hidden="true">
        {[Heart, Users, Target].map((Icon, i) => (
            <div
                key={i}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full transition duration-300 hover:scale-110"
                style={{ animation: `stagger-fade-in 0.8s ease-out ${0.1 + i * 0.1}s both` }}
            >
                <Icon className="w-6 h-6 text-white" />
            </div>
        ))}
    </div>
);

// 3. Scroll Indicator
const ScrollIndicator = () => (
    <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-80 animate-bounce transition-opacity duration-500"
        aria-hidden="true"
    >
        <ChevronDown className="w-6 h-6 text-white" />
    </div>
);

// Animation keyframes for staggered fade-in
const staggerFadeInKeyframes = `
  @keyframes stagger-fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes pulse-slow {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.25; }
  }
  .animate-pulse-slow {
      animation: pulse-slow 6s infinite ease-in-out;
  }
`;

const StyleInjector = () => (
    // Inject custom animation keyframes and classes
    <style dangerouslySetInnerHTML={{ __html: staggerFadeInKeyframes }} />
);


// --- Main Component ---

/**
  * UnifiedHero Component
  * Fixed the background image transition using a robust "Fade-to-Black" logic.
  * Random image selection now uses useMemo to ensure fresh randomization on each component mount.
  */
const UnifiedHero = ({
    title = "Powerful Digital Solutions for Tomorrow",
    subtitle = "Experience advanced, scalable web development services tailored to accelerate your growth and mission success.",
    slug = "Innovation | Quality | Trust",
    description,
    actions = [
        { text: "View Our Work", href: "/projects", variant: "primary" },
        { text: "Contact Us", href: "/contact", variant: "secondary" },
    ],
    images = [
        "https://placehold.co/1200x800/222244/FFFFFF?text=Digital+Landscape",
        "https://placehold.co/1200x800/442222/FFFFFF?text=Innovation+Focus",
    ]
}) => {
  const words = typeof title === 'string' ? title.split(" ") : [];

  // FIX: Use useMemo to ensure random image selection runs only once per component mount,
  // generating a new random image each time the page is loaded/visited.
  // This bypasses the client-side caching in getRandomGalleryImages for true randomization.
  const selectedImages = useMemo(() => {
    if (!images || images.length === 0) {
      return [
        "https://placehold.co/1200x800/222244/FFFFFF?text=Digital+Landscape",
        "https://placehold.co/1200x800/442222/FFFFFF?text=Innovation+Focus",
      ];
    }

    // If we have images, shuffle them to create a random order for this component mount
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    return shuffled;
  }, []); // Empty dependency array ensures this runs only once per component mount

  // Slideshow state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false); // New state to control fade-to-black

  // Slideshow effect (Fixed Transition Logic)
  useEffect(() => {
    if (!selectedImages || selectedImages.length <= 1) return;

    // The duration of the CSS transition for the overlay (1000ms)
    const TRANSITION_DURATION = 1000;
    // The total interval time
    const INTERVAL_TIME = 5000;

    const interval = setInterval(() => {
      // 1. Start the visual fade-out (overlay opacity increases to 1)
      setIsFading(true);

      // 2. Schedule the source update and fade-in (after transition duration)
      const transitionTimer = setTimeout(() => {
        // A. Update the index while the screen is black
        setCurrentIndex((prev) => (prev + 1) % selectedImages.length);

        // B. Start the visual fade-in (overlay opacity decreases to 0.3)
        setIsFading(false);
      }, TRANSITION_DURATION);

      return () => clearTimeout(transitionTimer);
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, [selectedImages?.length]);

  // Fallback for primary button style (ACCENT_BLUE: #6495ED, DARK_TEXT: #333333)
  const getButtonStyle = (variant) => {
    switch (variant) {
        case "secondary":
            return {
                backgroundColor: '#6495ED', // ACCENT_BLUE
                color: '#FFFFFF',
                border: '2px solid #6495ED',
                transition: 'background-color 0.2s, opacity 0.2s'
            };
        case "primary":
        default:
            return {
                backgroundColor: '#FFFFFF',
                color: '#333333', // DARK_TEXT
                transition: 'background-color 0.2s, opacity 0.2s'
            };
    }
  };


  return (
    <>
      <StyleInjector />

      <header
        className="relative pt-32 pb-24 md:pt-40 md:pb-32 mb-16 rounded-b-[4rem] overflow-hidden shadow-2xl"
        style={{ minHeight: '400px' }}
        role="banner"
        suppressHydrationWarning
      >
      {/* Background Slideshow (Now uses a single Image element from Next.js) */}
      {selectedImages && selectedImages.length > 0 && (
        <div className="absolute inset-0">
          {/* Single Image Element - Source changes instantly while obscured */}
          <Image
            // Use key to hint React that this is a new element (optional but good practice)
            key={currentIndex}
            src={selectedImages[currentIndex]}
            alt="Hero background"
            // The image is always visible (opacity 1) within the container
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Overlay for text readability and FADE TRANSITION */}
      <div
        className="absolute inset-0 bg-blue-900 transition-opacity duration-1000"
        style={{ opacity: isFading ? 1 : 0.3 }} // Opacity transitions between 100% (blue blackout) and 30% (readable overlay)
      />

      {/* 1. Animated Background */}
      <BackgroundPattern />

      {/* 2. Main Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

        {/* Decorative Icons */}
        <DecorativeIcons />

        {/* Main Title (Enhanced Staggered Reveal) */}
        <h1
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
            aria-label={title}
        >
            {words.map((word, index) => (
                <span
                    key={index}
                    className={`mx-1 inline-block transition-transform duration-300 hover:scale-105 ${
                        // Original alternating color scheme maintained: text-white and text-blue-900
                        index % 2 === 0 ? "text-white drop-shadow-lg" : "text-blue-900"
                    }`}
                    style={{
                        animation: `stagger-fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + index * 0.1}s both`,
                        textShadow: index % 2 === 0 ? "2px 2px 4px rgba(0,0,0,0.3)" : "none",
                    }}
                >
                    {word}
                </span>
            ))}
        </h1>

        {/* Subtitle */}
        <div className="max-w-3xl mx-auto">
            <p
                className="text-lg md:text-xl text-blue-900 font-medium leading-relaxed opacity-0"
                style={{ animation: "stagger-fade-in 0.8s ease-out 1.2s forwards" }}
            >
                {subtitle}
            </p>

            {/* Slug */}
            {slug && (
                <p
                    className="text-sm text-blue-900 font-medium opacity-0"
                    style={{ animation: "stagger-fade-in 0.8s ease-out 1.8s forwards" }}
                >
                    {slug}
                </p>
            )}

            {/* Decorative separator line */}
            <div
                className="w-16 h-1 mt-6 bg-white mx-auto rounded-full shadow-md opacity-0"
                style={{ animation: "stagger-fade-in 0.8s ease-out 1.4s forwards" }}
                aria-hidden="true"
            />

            {/* Actions (Replaced <Button> with standard <a> tags and inline styles) */}
            {actions.length > 0 && (
                <div
                    className="flex flex-wrap justify-center gap-4 mt-8 opacity-0"
                    style={{ animation: "stagger-fade-in 0.8s ease-out 1.6s forwards" }}
                >
                    {actions.map((action, index) => (
                        <a
                            key={index}
                            href={action.href || 'javascript:void(0)'}
                            className="block w-full mt-2 py-2.5 px-8 rounded-md duration-150 sm:w-auto font-semibold shadow-lg hover:shadow-xl transition-shadow"
                            style={getButtonStyle(action.variant)}
                        >
                            {action.text}
                        </a>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* 3. Scroll Indicator */}
      <ScrollIndicator />
    </header>
    </>
  );
};

export default UnifiedHero;