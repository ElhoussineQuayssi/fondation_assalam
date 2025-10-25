"use client";

import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const elementRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only runs on client-side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const element = elementRef.current;
    if (!element) return;

    console.log('[ScrollReveal] Setting up observer for element:', element);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('[ScrollReveal] Intersection entry:', entry.isIntersecting, entry.target);
          if (entry.isIntersecting) {
            // Add delay if specified
            setTimeout(() => {
              entry.target.classList.add("animate-fade-in");
              entry.target.style.opacity = "1";
              console.log('[ScrollReveal] Animation applied to:', entry.target);
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
        console.log('[ScrollReveal] Observer disconnected');
      }
    };
  }, [delay, isClient]);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${className}`}
      style={{
        animationDelay: `${delay}s`,
        opacity: 1 // Always start visible to prevent hydration mismatch
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
