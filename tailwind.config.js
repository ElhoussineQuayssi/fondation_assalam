const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./app/**/*.{js,jsx,mdx}",
    "*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Design System - Essential colors only
        primary: "#B0E0E6", // Powder Blue
        accent: "#6495ED", // Cornflower Blue
        dark: "#333333", // Dark Gray
        background: "#FAFAFA", // Off-White

        // Custom colors for inline style conversion
        'text-dark': "#333333",
        'primary-light': "#B0E0E6",
        'text-muted': "#767676",

        // Simplified brand colors - only essential ones
        brand: {
          primary: "#5D8FBD", // Main brand color
          secondary: "#A0C4E1", // Secondary brand color
          accent: "#A11721", // Accent for highlights
        },

        // UI colors - streamlined
        muted: "#767676", // For secondary text
        border: "#E5E5E5", // For borders
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;
