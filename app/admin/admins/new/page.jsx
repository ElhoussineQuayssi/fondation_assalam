"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdmin } from "lib/actions";
import { AlertTriangle, Loader2 } from "lucide-react";

// Import extracted components
import Container from "@/components/Container/Container.jsx";
import Alert from "@/components/Alert/Alert.jsx";

// --- Design System Configuration (Minimalist Light Blue) ---
// Defined explicitly here for self-containment and strict adherence.
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue (Not used here, but good practice to keep)
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

export default function NewAdmin() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    status: "idle", // idle, submitting, success, error
    message: "",
  });

  // --- Original Form Submission Logic Preserved ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormState({ status: "submitting", message: "Ajout en cours..." });

    const formData = new FormData(event.target);

    try {
      const result = await createAdmin(formData);
      if (result.success) {
        // Redirect on success
        router.push("/admin/admins");
      } else {
        setFormState({
          status: "error",
          message:
            result.message || "Une erreur s'est produite. Veuillez réessayer.",
        });
      }
    } catch (error) {
      console.error("Failed to create admin:", error);
      setFormState({
        status: "error",
        message: "Une erreur s'est produite. Veuillez réessayer.",
      });
    }
  };

  // --- Transformed JSX (Minimalist Light Blue Design) ---
  return (
    // Set main canvas background color using inline style
    <main
      className="min-h-screen py-12"
      style={{ backgroundColor: BACKGROUND }}
    >
      <Container>
        {/* H1 Typography Pattern: Bold, Dark Text */}
        <h1 className="text-3xl font-bold mb-8" style={{ color: DARK_TEXT }}>
          Ajouter un administrateur
        </h1>

        <Alert type={formState.status} message={formState.message} />

        {/* Form as Content Card Pattern */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl space-y-6 scroll-reveal"
        >
          {/* Name Field */}
          <div>
            {/* Label Typography Pattern: Body Text, Dark Text */}
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="name"
              style={{ color: DARK_TEXT }}
            >
              Nom *
            </label>
            {/* Input Styling: Accent Focus Ring, generous padding */}
            <input
              type="text"
              id="name"
              name="name"
              required
              // Note: Assumes `focus:ring-accent` and `focus:border-accent` are configured in Tailwind to use the design system accent color.
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="email"
              style={{ color: DARK_TEXT }}
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="password"
              style={{ color: DARK_TEXT }}
            >
              Mot de passe *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm"
              placeholder="Minimum 8 caractères"
            />
          </div>

          {/* Role Field */}
          <div>
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="role"
              style={{ color: DARK_TEXT }}
            >
              Rôle *
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm appearance-none bg-white"
            >
              <option value="super_admin">Super Administrateur</option>
              <option value="content_manager">Gestionnaire de contenu</option>
              <option value="messages_manager">
                Gestionnaire des messages
              </option>
            </select>
          </div>

          {/* Submit Button - Primary Button Pattern (Rounded-full, Accent, Hover Lift) */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={formState.status === "submitting"}
              className="w-full text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform shadow-xl hover:scale-[1.01] hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT }}
            >
              {formState.status === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Ajout en cours...
                </span>
              ) : (
                "Ajouter l'administrateur"
              )}
            </button>
          </div>
        </form>
      </Container>
    </main>
  );
}
