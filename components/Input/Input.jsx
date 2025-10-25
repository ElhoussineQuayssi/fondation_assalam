import React from "react";

/**
 * Input Component with Accent Focus Styling.
 * Uses a global CSS injection to ensure the focus ring/border is ACCENT color.
 */
const Input = ({ label, name, required, placeholder, type = "text", min }) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="block text-sm font-semibold"
      style={{ color: "#333333" }}
    >
      {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      required={required}
      placeholder={placeholder}
      min={min}
      // Added 'contact-form-input' class for global focus styling
      className="contact-form-input p-3 border border-gray-300 rounded-lg focus:ring-2 block w-full transition duration-150 shadow-sm text-lg"
      style={{ color: "#333333" }}
    />
  </div>
);

export default Input;
