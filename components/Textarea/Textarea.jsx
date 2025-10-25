import React from "react";

/**
 * Textarea Component with Accent Focus Styling.
 * Uses a global CSS injection to ensure the focus ring/border is ACCENT color.
 */
const Textarea = ({ label, name, required, placeholder, rows }) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="block text-sm font-semibold"
      style={{ color: "#333333" }}
    >
      {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    <textarea
      name={name}
      id={name}
      required={required}
      rows={rows}
      placeholder={placeholder}
      // Added 'contact-form-input' class for global focus styling
      className="contact-form-input p-3 border border-gray-300 rounded-lg focus:ring-2 block w-full transition duration-150 shadow-sm text-lg"
      style={{ color: "#333333" }}
    />
  </div>
);

export default Textarea;
