'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { getLogoUrl } from "../lib/config";

// --- DESIGN SYSTEM MAPPING ---
// Accent: #6495ED (Cornflower Blue)
// Primary-Light: #B0E0E6 (Powder Blue)
// Dark-Text: #333333 (Dark Gray) - Used as the Footer Background Color

const ACCENT_BLUE = "#6495ED";
const FOOTER_BG = "#333333";
const WHITE_TEXT_MUTED = "rgba(255, 255, 255, 0.7)"; // text-white/70
const WHITE_TEXT_FADE = "rgba(255, 255, 255, 0.5)"; // text-white/50
const WHITE_TEXT_FULL = "#FFFFFF";

// Style objects for icons
const SocialIconBaseStyle = {
  color: WHITE_TEXT_MUTED,
  transition: 'all 0.2s ease-in-out'
};

const IconStyle = {
  color: ACCENT_BLUE,
  marginRight: '0.5rem',
  flexShrink: 0
};

/**
 * Helper component for links to use inline styles for hover
 */
const FooterLink = ({
  href,
  children,
  defaultColor = WHITE_TEXT_MUTED,
  hoverColor = WHITE_TEXT_FULL,
  className = "",
}) => (
  <Link
    href={href}
    className={`hover:pl-1 transition-all duration-200 ease-in-out block hover:text-white ${className}`}
    style={{ color: defaultColor }}
  >
    {children}
  </Link>
);

/**
 * Footer Component
 * FIXED CONTRAST: Uses inline styles for background and text colors.
 * @returns {JSX.Element} Transformed Footer component.
 */
export default function Footer() {
  const [logoUrl, setLogoUrl] = useState(null);

  // Fetch logo URL on component mount
  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const url = await getLogoUrl();
        setLogoUrl(url);
      } catch (error) {
        console.error('Error fetching logo URL:', error);
      }
    };

    fetchLogoUrl();
  }, []);
  const footerLinks = [
    { name: "Accueil", href: "/" },
    { name: "À Propos", href: "/about" },
    { name: "Nos Projets", href: "/projects" },
    { name: "Blog & Actualités", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];

  const projectLinks = [
    { name: "Rayhana Assalam", slug: "rihana-as-salam" },
    { name: "Centre Himaya", slug: "centre-himaya" },
    { name: "Fataer Al Baraka", slug: "fataer-al-baraka" },
    { name: "Programme Imtiaz", slug: "programme-imtiaz" },
    { name: "Programme Kafala", slug: "programme-kafala" },
    { name: "Nadi Assalam", slug: "nadi-assalam" },
  ];

  const socialMediaLinks = {
    facebook: "https://www.facebook.com/fondationassalam",
    twitter: "https://twitter.com/fondationassalam",
    instagram: "https://www.instagram.com/fondationassalam",
    linkedin: "https://www.linkedin.com/company/fondation-assalam",
  };

  const socialMediaLabels = {
    facebook: "Facebook",
    twitter: "X (Twitter)",
    instagram: "Instagram",
    linkedin: "LinkedIn",
  };

  return (
    // FIX: Use inline style for guaranteed background color and text contrast
    <footer
      style={{ backgroundColor: FOOTER_BG, color: WHITE_TEXT_FULL }}
      className="shadow-2xl"
    >
      {/* Layout Architecture: Container System with Enhanced Spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Grid Patterns: Responsive columns with improved gap and visual hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo and Intro with Enhanced Branding */}
          <div>
            <Link href="/" className="flex items-center mb-6 group">
              {/* Logo: Enhanced with hover effects */}
              <div className="relative w-12 h-12 mr-2">
                {/* Image has been inverted for visibility on dark background */}
                <Image
                  src={logoUrl || "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/logo.png"}
                  alt="Logo Fondation Assalam"
                  fill
                  sizes="48px"
                  className="object-contain transition duration-300 invert group-hover:scale-105"
                />
              </div>
              {/* FIX: Use inline style for text color and hover */}
              <span
                className="font-bold text-2xl transition duration-300 hover:text-blue-400"
                style={{ color: WHITE_TEXT_FULL }}
              >
                Assalam
              </span>
            </Link>
            {/* Body Text: Enhanced readability */}
            <p
              style={{ color: WHITE_TEXT_MUTED }}
              className="text-base mb-6 leading-relaxed"
            >
              La **Fondation Assalam pour le Développement Social** œuvre au
              Maroc **depuis 1992** pour **améliorer et renforcer les conditions
              de vie des individus et familles vulnérables**, en se concentrant
              sur l'**autonomisation, l'éducation, et la solidarité sociale.**
            </p>
            {/* Social Icons: Enhanced hover states and accessibility */}
            <div className="flex space-x-4">
              {Object.entries(socialMediaLinks).map(([platform, url]) => {
                const Icon = platform === 'facebook' ? Facebook :
                            platform === 'twitter' ? Twitter :
                            platform === 'instagram' ? Instagram : Linkedin;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-200 hover:bg-white/10 hover:text-blue-400"
                    style={SocialIconBaseStyle}
                    aria-label={`Suivez-nous sur ${socialMediaLabels[platform]}`}
                    title={`Suivez-nous sur ${socialMediaLabels[platform]}`}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links with Enhanced Typography */}
          <div>
            {/* H3 Title: Enhanced styling */}
            <h3
              className="text-xl font-semibold mb-6 pb-2"
              style={{ borderBottom: `2px solid ${ACCENT_BLUE}4D` }}
            >
              Liens Rapides
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <FooterLink href={item.href}>{item.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Projects with Enhanced Layout */}
          <div>
            {/* H3 Title: Enhanced styling */}
            <h3
              className="text-xl font-semibold mb-6 pb-2"
              style={{ borderBottom: `2px solid ${ACCENT_BLUE}4D` }}
            >
              Nos Projets
            </h3>
            <ul className="space-y-3">
              {projectLinks.map((project) => (
                <li key={project.slug}>
                  <FooterLink href={`/projects/${project.slug}`}>
                    {project.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact with Enhanced Interactive Elements */}
          <div>
            {/* H3 Title: Enhanced styling */}
            <h3
              className="text-xl font-semibold mb-6 pb-2"
              style={{ borderBottom: `2px solid ${ACCENT_BLUE}4D` }}
            >
              Contact
            </h3>
            <ul className="space-y-4">
              {/* Contact Info: Enhanced with better spacing and hover effects */}
              <li className="flex items-start group">
                <MapPin style={IconStyle} />
                <span
                  style={{ color: WHITE_TEXT_MUTED }}
                  className="group-hover:text-white transition duration-200 text-base leading-relaxed"
                >
                  **22 Bd Hassan II, Immeuble 83, 2ème étage, Rabat, Maroc**
                </span>
              </li>
              <li className="flex items-center group">
                <Phone style={IconStyle} />
                <a
                  href="tel:0537702346"
                  style={{ color: WHITE_TEXT_MUTED }}
                  className="transition-colors text-base group-hover:text-blue-400"
                >
                  **05377-02346**
                </a>
              </li>
              <li className="flex items-center group">
                <Mail style={IconStyle} />
                <a
                  href="mailto:bn.assalam@gmail.com"
                  style={{ color: WHITE_TEXT_MUTED }}
                  className="transition-colors text-base group-hover:text-blue-400"
                >
                  **bn.assalam@gmail.com**
                </a>
              </li>
            </ul>

            <div className="mt-8">
              {/* FIX: Use inline style for guaranteed button color */}
              <Link
                href="/contact"
                className={`inline-flex items-center font-semibold
                           hover:bg-[${ACCENT_BLUE}]/80 text-white
                           px-6 py-3 rounded-full shadow-lg hover:shadow-xl
                           transition duration-300 ease-in-out
                           transform hover:scale-[1.02] active:scale-100
                           focus:outline-none focus:ring-4 focus:ring-[${ACCENT_BLUE}] focus:ring-opacity-50`}
                style={{ backgroundColor: ACCENT_BLUE, color: WHITE_TEXT_FULL }}
              >
                Nous Contacter <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Divider */}
        <hr className="my-10 border-white/20" />

        {/* Bottom Footer: Enhanced Copyright & Signature */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* FIX: Use explicit color for muted text */}
          <p style={{ color: WHITE_TEXT_FADE }} className="mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Fondation Assalam. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
