"use client";

import { useEffect } from "react";

/**
 * Client-side component that handles DOM manipulation for scroll reveal animations
 * and style injection. This prevents hydration mismatches by isolating client-side
 * DOM operations from the server-rendered component tree.
 */
export default function ScrollRevealHandler() {
  useEffect(() => {
    console.log('[ScrollRevealHandler] useEffect running - client-side DOM manipulation');

    // Inject blueprint styles if not already present
    const existingStyle = document.querySelector("#blueprint-styles");
    if (!existingStyle) {
      console.log('[ScrollRevealHandler] Injecting blueprint styles');
      const styleElement = document.createElement("style");
      styleElement.id = "blueprint-styles";
      styleElement.textContent = `
        /* Blueprint Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Blueprint Card Lift Effect */
        .card-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px #6495ED26;
        }

        /* Blueprint Timeline Styling */
        .timeline-line {
          background-color: #B0E0E6;
        }

        .timeline-dot {
          background-color: #6495ED;
          box-shadow: 0 0 0 4px #B0E0E6;
        }

        /* Blueprint Scroll Reveal */
        .scroll-reveal {
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Initialize scroll reveal animations with IntersectionObserver
    console.log('[ScrollRevealHandler] Setting up IntersectionObserver for scroll reveals');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        console.log('[ScrollRevealHandler] IntersectionObserver entry:', entry.isIntersecting, entry.target);
        if (entry.isIntersecting) {
          // Apply staggered animation delay based on element index
          const delay = index * 0.15;
          setTimeout(() => {
            entry.target.classList.add("animate-fade-in");
            entry.target.style.opacity = 1;
            console.log('[ScrollRevealHandler] Applied animation to element:', entry.target);
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const scrollElements = document.querySelectorAll(".scroll-reveal");
    console.log('[ScrollRevealHandler] Found scroll-reveal elements:', scrollElements.length);
    scrollElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.15}s`;

      // Check if element is already in viewport on load
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        // Apply animation immediately for elements already in viewport
        const delay = index * 0.15;
        setTimeout(() => {
          element.classList.add("animate-fade-in");
          element.style.opacity = 1;
          console.log('[ScrollRevealHandler] Applied immediate animation to visible element:', element);
        }, delay * 1000);
      } else {
        // Observe elements not yet in viewport
        observer.observe(element);
      }
    });

    return () => {
      console.log('[ScrollRevealHandler] Disconnecting observer');
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}