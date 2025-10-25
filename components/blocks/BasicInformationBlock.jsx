// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const DARK_TEXT = "#333333"; // Dark Gray
// const BACKGROUND = '#FAFAFA'; // Not needed in this component

import { Settings } from "lucide-react";

export default function BasicInformationBlock({
  projectData,
  handleInputChange,
}) {
  // Style object for inputs to apply consistent theming
  const inputStyle = {
    // Tailwind focus classes are overridden by inline styles for dynamic colors
    "--tw-ring-color": ACCENT,
    "--tw-border-color": ACCENT,
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent";

  return (
    // Content Card Pattern: bg-white, rounded-lg, shadow
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2
        className="text-lg font-semibold mb-4 flex items-center gap-2"
        style={{ color: DARK_TEXT }}
      >
        <Settings className="h-5 w-5" style={{ color: ACCENT }} />
        Informations de Base
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Titre du Projet */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: DARK_TEXT }}
          >
            Titre du Projet *
          </label>
          <input
            type="text"
            required
            className={inputClasses}
            style={inputStyle}
            value={projectData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>
        {/* Image Principale (URL) */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: DARK_TEXT }}
          >
            Image Principale
          </label>
          <input
            type="url"
            className={inputClasses}
            style={inputStyle}
            placeholder="URL de l'image principale"
            value={projectData.image}
            onChange={(e) => handleInputChange("image", e.target.value)}
          />
        </div>
        {/* Description Courte (Excerpt) */}
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: DARK_TEXT }}
          >
            Description Courte *
          </label>
          <textarea
            required
            rows="3"
            className={inputClasses}
            style={inputStyle}
            value={projectData.excerpt}
            onChange={(e) => handleInputChange("excerpt", e.target.value)}
          />
        </div>
        {/* Date de Début */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: DARK_TEXT }}
          >
            Date de Début
          </label>
          <input
            type="text"
            className={inputClasses}
            style={inputStyle}
            placeholder="Ex: 2020"
            value={projectData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
          />
        </div>
        {/* Lieu */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: DARK_TEXT }}
          >
            Lieu
          </label>
          <input
            type="text"
            className={inputClasses}
            style={inputStyle}
            value={projectData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
          />
        </div>
        {/* Bénéficiaires */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: DARK_TEXT }}
          >
            Bénéficiaires
          </label>
          <input
            type="text"
            className={inputClasses}
            style={inputStyle}
            placeholder="Ex: 150 personnes"
            value={projectData.peopleHelped}
            onChange={(e) => handleInputChange("peopleHelped", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
