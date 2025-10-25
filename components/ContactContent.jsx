'use client';

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
// Assuming the path to the server action is correct
import { saveMessage } from "lib/actions";
import { getRandomGalleryImages } from "@/lib/utils";
import {
  Check,
  AlertTriangle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import FileUpload from "@/components/FileUpload/FileUpload";
import UnifiedHero from "@/components/UnifiedHero";
// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

function ContactContent() {
  const searchParams = useSearchParams();
  const [clientType, setClientType] = useState('contact');

  useEffect(() => {
    setClientType(searchParams.get('type') || 'contact');
  }, [searchParams]);

  const projects = [
    { value: "rihana-as-salam", label: "Rihana As Salam - Programme de soutien pour les femmes en difficulté" },
    { value: "programme-kafala", label: "Programme Kafala - Parrainage pour les orphelins" },
    { value: "programme-imtiaz", label: "Programme Imtiaz - Parrainage des étudiants brillants issus de milieux défavorisés" },
    { value: "fataer-al-baraka", label: "Fataer Al Baraka - Centre de formation en pâtisserie marocaine pour femmes" },
    { value: "centre-himaya", label: "Centre Himaya - Centre pluridisciplinaire de soutien aux femmes et enfants" },
    { value: "nadi-assalam", label: "Nadi Assalam - Un avenir cousu d'espoir" },
    { value: "general", label: "Don général pour tous les projets" },
  ];

  const [volunteerFiles, setVolunteerFiles] = useState([]);
  const [donationFiles, setDonationFiles] = useState([]);
  const [formState, setFormState] = useState({ status: "idle", message: "" });
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await getRandomGalleryImages(4);
      setHeroImages(images);
    };
    fetchImages();
  }, []);


   const handleSubmit = async (event) => {
    event.preventDefault();
    setFormState({ status: "submitting", message: "" });

    const formData = new FormData(event.target);
    formData.append("type", clientType);

    // Add uploaded files to FormData
    if (type === "volunteer") {
      volunteerFiles.forEach((file, index) => {
        formData.append(`volunteer_file_${index}`, file);
      });
    } else if (type === "donation") {
      donationFiles.forEach((file, index) => {
        formData.append(`donation_file_${index}`, file);
      });
    }

    try {
      // Assuming 'saveMessage' is the server action function
      const result = await saveMessage(formData);
      if (result.success) {
        setFormState({
          status: "success",
          message:
            "Votre message a été transmis à notre équipe. Nous vous répondrons dans les plus brefs délais, Insha'Allah.", // Enhanced Success Message
        });
        event.target.reset();
        // Reset file uploads on successful submission
        setVolunteerFiles([]);
        setDonationFiles([]);
      } else {
        setFormState({
          ...formState,
          status: "error",
          message:
            result.message ||
            "Un problème est survenu lors de l'envoi. Veuillez vérifier les informations et réessayer.", // Enhanced Error Message
        });
      }
    } catch (e) {
      setFormState({
        ...formState,
        status: "error",
        message:
          "Une erreur technique s'est produite. Veuillez réessayer plus tard ou nous contacter par téléphone.", // Enhanced Catch Error Message
      });
    }
  };

  const contactOptions = useMemo(
    () => [
      { value: "contact", label: "Demande Générale" }, // Enhanced Tab Label
      { value: "donation", label: "Soutenir un Projet" }, // Enhanced Tab Label
      { value: "volunteer", label: "Rejoindre l'Équipe (Bénévole)" }, // Enhanced Tab Label
    ],
    [],
  );

  const buttonText = useMemo(() => {
    if (formState.status === "submitting") return "Envoi de votre intention..."; // Enhanced Loading Text
    if (clientType === "donation") return "Soumettre ma promesse de don"; // Enhanced Button Text
    if (clientType === "volunteer") return "Envoyer ma candidature bénévole"; // Enhanced Button Text
    return "Envoyer mon message de contact"; // Enhanced Button Text
  }, [formState.status, clientType]);

  const introText = useMemo(() => {
    if (clientType === "donation")
      return "Chaque don est un acte de solidarité qui transforme des vies. Sélectionnez un projet spécifique à soutenir ou faites un don général pour appuyer toutes nos initiatives."; // Enhanced Intro Text
    if (clientType === "volunteer")
      return "Votre temps et vos compétences sont précieux. Rejoignez la communauté Assalam et participez activement à nos actions sur le terrain."; // Enhanced Intro Text
    return "Nous sommes là pour répondre à vos questions sur nos actions, partenariats ou toute autre demande. Votre engagement commence ici."; // Enhanced Intro Text
  }, [clientType]);

  const socialColors = useMemo(
    () => ({
      facebook: "#1877F2",
      twitter: "#1DA1F2",
      linkedin: "#0A66C2",
      instagram: "#E4405F",
    }),
    [],
  );

  return (
    <div>
      <UnifiedHero
        title="Contactez-Nous"
        subtitle="Nous sommes là pour répondre à vos questions sur nos actions, partenariats ou toute autre demande. Votre engagement commence ici."
        images={heroImages}
      />
      {/* Layout Architecture: Max-width container and generous vertical spacing (py-24) */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        style={{ backgroundColor: BACKGROUND }}
      >
      {/* GLOBAL STYLE INJECTION FOR INPUT FOCUS - Moved to globals.css */}

      <div className="text-center mb-16 pb-2">
        {/* Typography System: H2 (Section Title) pattern */}
        <h2 className="text-4xl font-bold mb-4" style={{ color: DARK_TEXT }}>
          L'Espace de Communication et d'Engagement
        </h2>{" "}
        {/* Enhanced Title */}
        {/* Typography System: Body text (text-lg) and Dark Text color */}
        <p
          className="text-lg max-w-3xl mx-auto"
          style={{ color: `${DARK_TEXT}D9` }}
        >
          {introText}
        </p>
      </div>
        </div>
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        {/* Contact Form - Component Pattern: ContentCard with Scroll Reveal */}
        <div
          className="bg-white rounded-2xl shadow-xl p-8 scroll-reveal card-lift"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Form Status Messages */}
          {formState.status === "success" && (
            <Alert
              type="success"
              title="Merci de votre engagement !" // Enhanced Alert Title
              message={formState.message}
              className="mb-6"
            />
          )}

          {formState.status === "error" && (
            <Alert
              type="error"
              title="Échec de l'envoi" // Enhanced Alert Title
              message={formState.message}
              className="mb-6"
            />
          )}

          {/* Form Tabs - Typography and Color System Application */}
          <div
            className="flex border-b mb-8 pb-4"
            style={{ borderColor: PRIMARY_LIGHT }}
          >
            {contactOptions.map((option) => (
              <Link
                key={option.value}
                href={`/contact?type=${option.value}`}
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none`}
                style={{
                  color: clientType === option.value ? ACCENT : "#6B7280", // Gray-500
                  borderBottom:
                    clientType === option.value
                      ? `2px solid ${ACCENT}`
                      : "2px solid transparent",
                }}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                name="firstName"
                required
                placeholder="Votre prénom"
              />
              <Input
                label="Nom"
                name="lastName"
                required
                placeholder="Votre nom"
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              required
              placeholder="votre.email@exemple.com"
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              placeholder="+212 5 XX XX XX XX (Optionnel)" // Enhanced Placeholder
            />

            {clientType === "donation" && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: DARK_TEXT }}>
                  Projet à soutenir (Optionnel)
                </label>
                <select
                  name="project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200"
                  style={{
                    focusRingColor: ACCENT,
                    borderColor: `${ACCENT}40`,
                  }}
                  defaultValue=""
                >
                  <option value="">Sélectionnez un projet spécifique (optionnel)</option>
                  {projects.map((project) => (
                    <option key={project.value} value={project.value}>
                      {project.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm mt-1" style={{ color: `${DARK_TEXT}B3` }}>
                  Si vous ne sélectionnez pas de projet spécifique, votre don ira au fonds général pour soutenir tous nos projets.
                </p>
              </div>
            )}

            {clientType === "volunteer" && (
              <Input
                label="Vos Compétences et Domaine d'expertise" // Enhanced Label
                name="skills"
                required
                placeholder="Ex: Enseignement, Santé, Communication, Aide logistique..." // Enhanced Placeholder
              />
            )}

            <Textarea
              label="Votre Message / Détails de votre demande" // Enhanced Label
              name="message"
              required
              rows={5}
              placeholder="Expliquez-nous brièvement comment vous souhaitez contribuer ou votre question spécifique..." // Enhanced Placeholder
            />

            {clientType === "volunteer" && (
              <div className="space-y-4">
                <FileUpload
                  title="Documents pour votre candidature (CV, certificats, lettres de motivation)"
                  files={volunteerFiles}
                  onFilesChange={setVolunteerFiles}
                  acceptedFileTypes=".pdf,.doc,.docx,image/*"
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  maxFiles={5}
                />
                <p className="text-sm" style={{ color: `${DARK_TEXT}B3` }}>
                  Formats acceptés: PDF, Word, Images • Taille maximale: 5MB par fichier
                </p>
              </div>
            )}

            {clientType === "donation" && (
              <div className="space-y-4">
                <FileUpload
                  title="Documents justificatifs (reçus, attestations, ou autres documents)"
                  files={donationFiles}
                  onFilesChange={setDonationFiles}
                  acceptedFileTypes=".pdf,.doc,.docx,image/*"
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  maxFiles={3}
                />
                <p className="text-sm" style={{ color: `${DARK_TEXT}B3` }}>
                  Formats acceptés: PDF, Word, Images • Taille maximale: 5MB par fichier
                </p>
              </div>
            )}

            {/* Primary Button Pattern: rounded-full, bg-accent, hover:scale-102, shadow-xl */}
            <button
              type="submit"
              className={`w-full text-white font-bold rounded-full px-8 py-4 text-lg shadow-xl transition-all duration-300 transform flex items-center justify-center space-x-2
              ${
                formState.status === "submitting"
                  ? "disabled:cursor-not-allowed"
                  : "hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50"
              }`}
              style={{
                backgroundColor:
                  formState.status === "submitting" ? `${ACCENT}B3` : ACCENT, // 70% opacity for disabled state
                cursor:
                  formState.status === "submitting" ? "not-allowed" : "pointer",
                boxShadow:
                  formState.status === "submitting"
                    ? "none"
                    : "0 10px 15px -3px rgba(100, 149, 237, 0.5), 0 4px 6px -2px rgba(100, 149, 237, 0.05)", // Accent-based shadow
              }}
              disabled={formState.status === "submitting"}
            >
              {formState.status === "submitting" && (
                <Loader2 className="animate-spin h-5 w-5" />
              )}
              <span>{buttonText}</span>
            </button>
          </form>
        </div>

        {/* Contact Info Section - Staggered Scroll Reveal */}
        <div
          className="space-y-8 scroll-reveal"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Contact Info Card - Subtle Background, Accent Styling */}
          <div
            className="rounded-2xl p-8 border shadow-lg"
            style={{
              backgroundColor: PRIMARY_LIGHT,
              borderColor: `${ACCENT}40`,
            }}
          >
            {/* Typography: H3 Card Title pattern */}
            <h3
              className="text-xl font-semibold mb-6"
              style={{ color: ACCENT }}
            >
              Notre Siège Social au Maroc
            </h3>{" "}
            {/* Enhanced Title */}
            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  title: "Adresse du Siège:",
                  details:
                    "22 Bd Hassan II, Immeuble 83, 2ème étage, Rabat, Maroc",
                  isLink: false,
                }, // Enhanced Title
                {
                  icon: Mail,
                  title: "Email de Contact:",
                  details: "bn.assalam@gmail.com",
                  href: "mailto:bn.assalam@gmail.com",
                  isLink: true,
                }, // Enhanced Title
                {
                  icon: Phone,
                  title: "Ligne Directe:",
                  details: "05377-02346",
                  href: "tel:0537702346",
                  isLink: true,
                }, // Enhanced Title
                {
                  icon: () => (
                    <div
                      className="h-6 w-6 text-accent flex-shrink-0"
                      style={{ color: ACCENT }}
                    >
                      🕒
                    </div>
                  ),
                  title: "Horaires d'Accueil:",
                  details: "Lundi - Vendredi: 9h00 - 17h00 (Heure Marocaine)",
                  isLink: false,
                }, // Enhanced Title & Detail
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <IconComponent
                      className="h-6 w-6 mt-1 flex-shrink-0"
                      style={{ color: ACCENT }}
                    />
                    <div className="text-lg">
                      <p className="font-semibold" style={{ color: DARK_TEXT }}>
                        {item.title}
                      </p>
                      {item.isLink ? (
                        <a
                          href={item.href}
                          className="transition-colors duration-200 hover:opacity-80"
                          style={{ color: ACCENT }}
                        >
                          {item.details}
                        </a>
                      ) : (
                        <p style={{ color: `${DARK_TEXT}B3` }}>
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Section */}
          <div
            className="rounded-2xl overflow-hidden h-80 relative shadow-lg border"
            style={{
              borderColor: `${ACCENT}40`,
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.1997262964037!2d-7.6442179999999995!3d33.57416320000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62d6b070965af%3A0x21387d47b3a8450d!2sFondation%20Assalam%20Casa%20Anfa!5e0!3m2!1sfr!2sma!4v1760712300629!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation de la Fondation Assalam"
            />
          </div>

          {/* Social Media - Use platform specific colors via inline styles */}
          <div className="mt-6">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: DARK_TEXT }}
            >
              Suivez nos Actions de Solidarité
            </h3>{" "}
            {/* Enhanced Title */}
            <div className="flex gap-4 pb-4">
              {[
                { icon: Facebook, href: "https://web.facebook.com/Assalamcasaanfa", platform: "facebook", label: "Page Facebook Fondation Assalam" },
                { icon: Twitter, href: "#", platform: "twitter", label: "Compte Twitter Fondation Assalam" },
                { icon: Linkedin, href: "https://ma.linkedin.com/in/fondation-assalam-casaanfa-395132149", platform: "linkedin", label: "Profil LinkedIn Fondation Assalam" },
                { icon: Instagram, href: "#", platform: "instagram", label: "Compte Instagram Fondation Assalam" },
              ].map(({ icon: Icon, href, platform, label }, index) => (
                <a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  // Hover effect applied directly for the required interaction pattern
                  className={`text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                  style={{ backgroundColor: socialColors[platform] }}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactContent;