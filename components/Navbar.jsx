"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe } from "lucide-react"; // Imported Globe icon
import { usePathname } from "next/navigation";
import { getLogoUrl } from "../lib/config";

// --- Design System Constants ---
const ACCENT_BLUE = "#6495ED"; // Foundation Blue
const DARK_TEXT = "#333333";
const PRIMARY_LIGHT = "#B0E0E6"; // Light Blue/Cyan

// Animation keyframes for dropdown
const fadeInDownKeyframes = `
  @keyframes fade-in-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-down {
    animation: fade-in-down 0.3s ease-out;
  }
`;

// Define the available languages
const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

/**
 * LanguageSwitcher Component
 * Replaces the CTA button with a dynamic language selector.
 */
const LanguageSwitcher = ({ currentLang, onSwitch, isMobile = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedLang = LANGUAGES.find(l => l.code === currentLang);

  const handleSwitch = (code) => {
    onSwitch(code);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${isMobile ? 'mt-3 w-full' : 'ml-6'}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center justify-center space-x-2 px-3 py-2 text-sm font-bold rounded-full transition-all duration-300 transform hover:scale-[1.03] shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2`}
        style={{ 
          backgroundColor: PRIMARY_LIGHT + '40', // Light background for visibility
          color: DARK_TEXT,
          borderColor: ACCENT_BLUE,
          boxShadow: isDropdownOpen ? `0 0 0 2px ${ACCENT_BLUE}40` : 'none'
        }}
        aria-expanded={isDropdownOpen}
        aria-label="Language Switcher"
      >
        <Globe className="w-4 h-4" style={{ color: ACCENT_BLUE }} />
        <span className="hidden md:inline">{selectedLang?.code.toUpperCase() || 'FR'}</span>
      </button>

      {isDropdownOpen && (
        <div 
          className={`absolute ${isMobile ? 'left-0 right-0 mt-2' : 'right-0 mt-3 w-40'} 
            rounded-xl shadow-2xl overflow-hidden z-20 
            bg-white/90 backdrop-blur-sm border border-white/50 animate-fade-in-down`}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSwitch(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 
                ${lang.code === currentLang 
                  ? 'font-bold' 
                  : 'hover:bg-gray-100/70'
                }`}
              style={{ color: lang.code === currentLang ? ACCENT_BLUE : DARK_TEXT }}
            >
              {lang.label} ({lang.code.toUpperCase()})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


/**
 * Navbar Component (Header)
 * Enhanced with Glassmorphism, scroll dynamics, and Language Switcher.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Added state for current language
  const [currentLang, setCurrentLang] = useState('fr');
  const [logoUrl, setLogoUrl] = useState(null);
  const pathname = usePathname();

  // Scroll and Blur Logic - Client-side only to prevent hydration issues
   useLayoutEffect(() => {
     console.log('[Navbar] Setting up scroll listener');

     // Only run on client-side to prevent hydration mismatches
     if (typeof window === 'undefined') {
       console.log('[Navbar] Skipping scroll setup on server-side');
       return;
     }

     console.log('[Navbar] Running on client-side, setting up scroll listener');

     const handleScroll = () => {
       const scrolled = window.scrollY > 15;
       console.log('[Navbar] Scroll position:', window.scrollY, 'isScrolled:', scrolled);
       setIsScrolled(scrolled);
     };

     // Set initial state immediately
     handleScroll();

     window.addEventListener("scroll", handleScroll);

     return () => {
       console.log('[Navbar] Removing scroll listener');
       window.removeEventListener("scroll", handleScroll);
     };
   }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "À Propos", href: "/about" },
    { name: "Projets", href: "/projects" },
    { name: "Blog", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];
  
  const glassmorphismClasses = isScrolled
    ? "bg-white/40 backdrop-blur-md shadow-xl"
    : "bg-white/95 shadow-md";

  return (
    <>
      {/* Inject animation keyframes */}
      <style jsx>{fadeInDownKeyframes}</style>

      {/* Header Wrapper with Scroll Transition */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${glassmorphismClasses}`}
        style={{
          transition: 'background-color 300ms, box-shadow 300ms, backdrop-filter 300ms'
        }}
      >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-10 h-10 mr-2">
            <Image
              src={logoUrl || "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/logo.png"}
              alt="Logo Fondation Assalam"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <span
            className="font-bold text-2xl transition duration-300 group-hover:opacity-80"
            style={{ color: ACCENT_BLUE }}
          >
            Fondation Assalam
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap relative
                transition-all duration-300 ease-in-out group
                ${
                  pathname === item.href
                    ? `font-bold shadow-inner`
                    : `hover:bg-gray-50/50`
                }
              `}
              style={{ 
                color: pathname === item.href ? ACCENT_BLUE : DARK_TEXT,
                backgroundColor: pathname === item.href ? PRIMARY_LIGHT + '20' : 'transparent',
              }}
            >
              {item.name}
              {/* Animated Underline Effect on Hover */}
              <span 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 rounded-full group-hover:w-3/4 transition-all duration-300" 
                style={{ backgroundColor: ACCENT_BLUE }}
              />
            </Link>
          ))}
          
          {/* Language Switcher (Desktop) */}
          <LanguageSwitcher currentLang={currentLang} onSwitch={setCurrentLang} />

          
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
           {/* Mobile Language Switcher trigger for consistency */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md transition duration-150 focus:outline-none focus:ring-4 focus:ring-opacity-50"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            style={{ 
              color: DARK_TEXT,
              borderColor: ACCENT_BLUE,
              backgroundColor: isOpen ? PRIMARY_LIGHT + '40' : 'transparent',
              boxShadow: isOpen ? `0 0 0 2px ${ACCENT_BLUE}40` : 'none'
            }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out 
          ${isOpen ? 'max-h-screen opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'}
        `}
        style={{ 
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white' 
        }}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 shadow-inner" onClick={() => setIsOpen(false)}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                block px-4 py-2 rounded-lg text-base font-medium transition duration-200
              `}
              style={{
                color: pathname === item.href ? ACCENT_BLUE : DARK_TEXT,
                backgroundColor: pathname === item.href ? PRIMARY_LIGHT + '50' : 'transparent',
                fontWeight: pathname === item.href ? '600' : '500',
              }}
            >
              {item.name}
            </Link>
          ))}

          {/* Language Switcher (Mobile) - Full width block */}
          <div className="pt-2">
            <LanguageSwitcher currentLang={currentLang} onSwitch={setCurrentLang} isMobile={true} />
          </div>

        </div>
      </div>
    </header>
    </>
  );
}