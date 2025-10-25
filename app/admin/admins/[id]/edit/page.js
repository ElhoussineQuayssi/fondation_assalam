"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAdmins, updateAdmin } from "lib/actions";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";

// Import extracted components
import Container from "@/components/Container/Container.jsx";
import Alert from "@/components/Alert/Alert.jsx";
import Button from "@/components/Button/Button.jsx";

// --- Design System Configuration (Minimalist Light Blue) ---
// Defined explicitly here to ensure consistency and self-containment.
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

export default function EditAdmin() {
  const router = useRouter();
  const { id } = useParams();
  const [formState, setFormState] = useState({
    status: "idle", // idle, submitting, success, error
    message: "",
  });
  const [admin, setAdmin] = useState({
    email: "",
    name: "",
    role: "super_admin",
    password: "",
  });

  // --- Original Data Fetching Logic Preserved ---
  useEffect(() => {
    async function fetchAdmin() {
      try {
        const result = await getAdmins();
        if (result.success) {
          const foundAdmin = result.data.find((a) => a.id.toString() === id);
          if (foundAdmin) {
            setAdmin({
              email: foundAdmin.email,
              name: foundAdmin.name,
              role: foundAdmin.role,
              password: "",
            });
          } else {
            setFormState({
              status: "error",
              message: "Administrateur introuvable.",
            });
          }
        } else {
          setFormState({
            status: "error",
            message: "Erreur lors de la récupération des administrateurs.",
          });
        }
      } catch (error) {
        setFormState({
          status: "error",
          message: `Une erreur s'est produite: ${error.message}`,
        });
      }
    }
    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ status: "submitting", message: "Mise à jour en cours..." });

    const formData = new FormData();
    formData.append("email", admin.email);
    formData.append("name", admin.name);
    formData.append("role", admin.role);
    if (admin.password) {
      formData.append("password", admin.password);
    }

    try {
      const result = await updateAdmin(id, formData);
      if (result.success) {
        setFormState({
          status: "success",
          message: result.message || "Administrateur mis à jour avec succès.",
        });
        // Redirect on success after a short delay to show the success message
        setTimeout(() => router.push("/admin/admins"), 500);
      } else {
        setFormState({
          status: "error",
          message: result.message || "Erreur lors de la mise à jour.",
        });
      }
    } catch (error) {
      setFormState({
        status: "error",
        message: `Une erreur s'est produite: ${error.message}`,
      });
    }
  };

  // --- Transformed JSX (Minimalist Light Blue Design) ---
  return (
    // Set main canvas background color using inline style for design system enforcement
    <main
      className="min-h-screen py-12"
      style={{ backgroundColor: BACKGROUND }}
    >
      <Container>
        {/* H1 Typography Pattern: Bold, Dark Text */}
        <h1 className="text-3xl font-bold mb-8" style={{ color: DARK_TEXT }}>
          Modifier l&apos;administrateur
        </h1>

        <Alert type={formState.status} message={formState.message} />

        {/* Form as Content Card Pattern (Accent Focus Ring, Shadow-xl) */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-2xl shadow-xl scroll-reveal"
        >
          {/* Email Field */}
          <div>
            {/* Label Typography Pattern: Body Text, Dark Text */}
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-dark-text mb-2"
              style={{ color: DARK_TEXT }}
            >
              Email *
            </label>
            {/* Input Styling: Accent Focus Ring, generous padding */}
            <input
              type="email"
              id="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              required
              // Custom utility classes for design system colors (focus:ring-accent) assumed
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm"
            />
          </div>

          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-dark-text mb-2"
              style={{ color: DARK_TEXT }}
            >
              Nom *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={admin.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm"
            />
          </div>

          {/* Role Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-lg font-semibold text-dark-text mb-2"
              style={{ color: DARK_TEXT }}
            >
              Rôle *
            </label>
            <select
              id="role"
              name="role"
              value={admin.role}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm appearance-none bg-white"
            >
              <option value="super_admin">Super Admin</option>
              <option value="content_manager">Content Manager</option>
              <option value="message_manager">Message Manager</option>
            </select>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-dark-text mb-2"
              style={{ color: DARK_TEXT }}
            >
              Nouveau mot de passe (laisser vide pour ne pas changer)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={admin.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm"
              placeholder="********"
            />
          </div>

          {/* Submit Button - Primary Button Pattern (Rounded-full, Accent, Hover Lift) */}
          <button
            type="submit"
            disabled={formState.status === "submitting"}
            className="w-full text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform shadow-xl hover:scale-[1.01] hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: ACCENT }}
          >
            {formState.status === "submitting" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Mise à jour...
              </span>
            ) : (
              "Mettre à jour"
            )}
          </button>
        </form>
      </Container>
    </main>
  );
}
