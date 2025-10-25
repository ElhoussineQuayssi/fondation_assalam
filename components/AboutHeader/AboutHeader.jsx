"use client";

import React from "react";
import { Heart, Users, Target, ChevronDown } from "lucide-react";

// --- Sub-Components (Concise & Grouped) ---

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

// --- Main Component ---

/**
 * AboutHeader Component 
 * Enhanced, Organized, and Smaller Header for the 'About' page.
 * Features a soft gradient, clean sub-components, and a smooth staggered title reveal.
 * * @param {string} title - The main heading text
 * @param {string} subtitle - The subtitle text
 * @returns {JSX.Element} The rendered header component
 */
const AboutHeader = ({ title, subtitle }) => {
  const words = title.split(" ");

  return (
    <header
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 mb-16 rounded-b-[4rem] overflow-hidden shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 50%, #6495ED 100%)",
        minHeight: '400px'
      }}
      role="banner"
    >
      {/* Custom Keyframes for Staggered Animation - Moved to globals.css */}
      
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
                        index % 2 === 0 ? "text-white drop-shadow-lg" : "text-blue-900"
                    }`}
                    style={{
                        // Apply the staggered animation using the custom keyframe
                        animation: `stagger-fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + index * 0.1}s both`,
                        textShadow: index % 2 === 0 ? "2px 2px 4px rgba(0,0,0,0.3)" : "none",
                    }}
                >
                    {word}
                </span>
            ))}
        </h1>

        {/* Subtitle (Simplified and Inlined) */}
        <div className="max-w-3xl mx-auto">
            <p
                className="text-lg md:text-xl text-blue-900 font-medium leading-relaxed opacity-0"
                style={{ animation: "stagger-fade-in 0.8s ease-out 1.2s forwards" }}
            >
                {subtitle}
            </p>

            {/* Decorative separator line */}
            <div
                className="w-16 h-1 mt-6 bg-white mx-auto rounded-full shadow-md opacity-0"
                style={{ animation: "stagger-fade-in 0.8s ease-out 1.4s forwards" }}
                aria-hidden="true"
            />
        </div>
      </div>

      {/* 3. Scroll Indicator */}
      <ScrollIndicator />
    </header>
  );
};

export default AboutHeader;