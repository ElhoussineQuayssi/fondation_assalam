"use client";

import React from "react";
import { Calendar, Clock, ChevronRight } from "lucide-react";

// --- Design System Constants ---
const ACCENT_COLOR = "#6495ED"; // Foundation Blue (Solidarity)
const TEXT_COLOR = "#333333";
const SECONDARY_COLOR = "#767676";

// Custom Keyframe for Staggered Slide-In Animation (for Next.js)
const StaggerAnimationStyles = () => (
    <style jsx global>{`
      @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-slide-in-stagger { 
        /* Base class for the animation */
        animation: slide-in-right 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; 
      }
    `}</style>
);


// --- Main Components ---

/**
 * Timeline - Container for the chronological events.
 * Uses a horizontal flex layout for mobile stacking and a responsive line effect.
 */
export const Timeline = ({ children }) => (
    <div className="relative pt-4 pb-8">
        <StaggerAnimationStyles />
        {/* Decorative Vertical Line */}
        <div 
            className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"
            style={{ left: '1.5rem' }} // Adjust position to align with markers
            aria-hidden="true"
        />
        <ol>{children}</ol>
    </div>
);

/**
 * TimelineItem - Individual event card wrapper with staggered animation.
 * @param {number} index - Index for staggered animation delay.
 */
export const TimelineItem = ({ children, index }) => (
    <li
        className="mb-8 ml-6 transform transition-all duration-500 hover:scale-[1.01] animate-slide-in-stagger"
        style={{
            animationDelay: `${0.1 + index * 0.15}s`, // Staggered reveal
            zIndex: index // Ensure higher cards overlay lower ones slightly
        }}
    >
        {children}
    </li>
);

/**
 * TimelineCard - The main content wrapper, styled as a card.
 */
export const TimelineCard = ({ children }) => (
  <div
    className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-b-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-l-8 card-lift border-accent bg-gradient-to-br from-white to-gray-50"
  >
    {children}
  </div>
);

/**
 * TimelineMarker - Visual point on the vertical line.
 */
export const TimelineMarker = () => (
  <span
    className="absolute flex items-center justify-center -left-[0.95rem] w-6 h-6 rounded-full ring-4 ring-white shadow-md z-10 bg-accent"
    aria-hidden="true"
  >
    <ChevronRight className="w-4 h-4 text-white" />
  </span>
);


/**
 * TimelineTime - Displays the Date/Year of the event.
 * @param {string} date - The event date/year.
 * @param {string} [time] - Optional event time.
 */
export const TimelineTime = ({ date, time }) => (
  <div className="flex items-center space-x-4 mb-2">
    <TimelineMarker />
    
    <div className="flex items-center space-x-1 text-sm font-semibold p-1 px-3 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
        <Calendar className="w-4 h-4 text-accent" />
        <span className="text-text-muted">{date}</span>
    </div>

    {time && (
        <div className="flex items-center space-x-1 text-sm p-1 px-3 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-text-muted">{time}</span>
        </div>
    )}
  </div>
);

/**
 * TimelineTitle - Title of the event.
 */
export const TimelineTitle = ({ children }) => (
  <h4
    className={`font-bold text-xl mt-3 transition-colors duration-300 text-text-dark`}
  >
    {children}
  </h4>
);

/**
 * TimelineDescription - Description/Body of the event.
 */
export const TimelineDescription = ({ children }) => (
  <p className="text-base font-normal mt-2 leading-relaxed text-text-muted">
    {children}
  </p>
);

// --- Example Usage Structure ---

/*
Example usage (for reference, not part of the component file itself):

<Timeline>
    <TimelineItem index={0}>
        <TimelineCard>
            <TimelineTime date="2025" time="Q1"/>
            <TimelineTitle>Digital Transformation Begins</TimelineTitle>
            <TimelineDescription>Launched modern Next.js platform to enhance donor and beneficiary engagement.</TimelineDescription>
        </TimelineCard>
    </TimelineItem>
    <TimelineItem index={1}>
        <TimelineCard>
            <TimelineTime date="2018"/>
            <TimelineTitle>Women's Empowerment Initiatives</TimelineTitle>
            <TimelineDescription>Scaled up vocational training centers (Nadi Assalam & Fataer Al Baraka) across new regions.</TimelineDescription>
        </TimelineCard>
    </TimelineItem>
</Timeline>

*/