"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMessages } from "lib/actions";
import {
  AlertTriangle,
  Loader2,
  MessageSquare,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

// Import extracted components
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner.jsx";
import Alert from "@/components/Alert/Alert.jsx";
import Button from "@/components/Button/Button.jsx";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

export default function ViewMessage() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMessage() {
      try {
        const result = await getMessages();
        if (result.success) {
          // Note: Assuming message IDs are integers for comparison based on original code logic
          const foundMessage = result.data.find((m) => m.id === parseInt(id));
          if (foundMessage) {
            setMessage(foundMessage);
          } else {
            setError("Message introuvable.");
          }
        } else {
          setError(
            result.message || "Erreur lors de la récupération du message.",
          );
        }
      } catch (err) {
        setError(
          `Une erreur s'est produite: ${err.message}. Veuillez réessayer.`,
        );
      }
    }
    fetchMessage();
  }, [id]);

  if (error) {
    return (
      <div className={`bg-[${BACKGROUND}] min-h-screen py-10 px-4 md:px-8`}>
        <Alert message={error} />
      </div>
    );
  }

  if (!message) {
    return <LoadingSpinner />;
  }

  // Helper to format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // --- Transformed JSX (Minimalist Light Blue Design) ---
  return (
    <div className={`bg-[${BACKGROUND}] min-h-screen py-10 px-4 md:px-8`}>
      <div className="max-w-4xl mx-auto scroll-reveal">
        {/* H2 Typography Style for Title */}
        <h1
          className={`text-3xl font-bold text-[${DARK_TEXT}] mb-8 pb-2`}
          style={{ borderBottom: `3px solid ${ACCENT}` }}
        >
          Détails du message
        </h1>

        {/* Message Details - Content Card Pattern */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <div className="flex items-center mb-1">
                <MessageSquare className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm font-medium text-gray-500">Nom</p>
              </div>
              <p className={`text-xl font-semibold text-[${DARK_TEXT}]`}>
                {message.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center mb-1">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm font-medium text-gray-500">Email</p>
              </div>
              <p className={`text-xl font-semibold text-[${DARK_TEXT}]`}>
                {message.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center mb-1">
                <Phone className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
              </div>
              <p className={`text-xl font-semibold text-[${DARK_TEXT}]`}>
                {message.phone || "N/A"}
              </p>
            </div>

            {/* Type */}
            <div>
              <div className="flex items-center mb-1">
                <p className="text-sm font-medium text-gray-500">Type</p>
              </div>
              {/* Accent Badge for Type */}
              <span
                className={`text-base px-4 py-1 rounded-full font-semibold bg-[${ACCENT}/10] text-[${ACCENT}]`}
              >
                {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
              </span>
            </div>
          </div>

          {/* Message Content */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center mb-2">
              <p className="text-sm font-medium text-gray-500">
                Contenu du message
              </p>
            </div>
            <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200`}>
              <p
                className={`text-lg leading-relaxed text-[${DARK_TEXT}] whitespace-pre-wrap`}
              >
                {message.message}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="pt-4">
            <div className="flex items-center mb-1">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              <p className="text-sm font-medium text-gray-500">
                Date de réception
              </p>
            </div>
            <p className={`text-lg font-medium text-[${DARK_TEXT}]`}>
              {formatDate(message.createdAt)}
            </p>
          </div>

          {/* Back Button - Primary Button Pattern */}
          <div className="pt-6">
            <Button
              onClick={() => router.push("/admin/messages")}
              className="mt-4"
            >
              Retour à la liste des messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
