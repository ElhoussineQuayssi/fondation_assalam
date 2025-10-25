"use client";

import { motion } from "framer-motion";

// --- DESIGN SYSTEM MAPPING ---
// Accent: #6495ED (Cornflower Blue)
// Dark-Text: #333333 (Dark Gray)

const ACCENT_BLUE = "#6495ED";
const DARK_TEXT = "#333333";

/**
 * Signature Component
 * Implements the design system's Dark Text color for high-contrast readability,
 * and uses Accent Blue for the interactive element (the name) with enhanced animations.
 * Functionality (framer-motion) is preserved and enhanced.
 * @returns {JSX.Element} Transformed Signature component.
 */
export default function Signature() {
  return (
    <motion.div
      // Color System: Use Dark Text color for the main signature text with enhanced opacity
      className={`flex justify-center items-center mt-4 text-sm font-medium text-[${DARK_TEXT}]/80`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Animation System: Transition duration aligned with design system's easeOut
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.span
        className="tracking-wide"
        whileHover={{
          // Color Application: Hover on main text uses the Accent Blue from design system
          color: ACCENT_BLUE,
          scale: 1.05,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        Developed with ❤️ by{" "}
        <motion.span
          // Typography System: Enhanced bold/semibold text with design system colors
          className={`font-semibold text-[${ACCENT_BLUE}]`}
          whileHover={{
            // Color Transition: Maintain Accent Blue but add scale effect for emphasis
            scale: 1.08,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          whileTap={{
            scale: 0.95, // Subtle tap feedback
          }}
        >
          Quayssi
        </motion.span>
      </motion.span>
    </motion.div>
  );
}
