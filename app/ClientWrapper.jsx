"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PerformanceTracker from "@/components/PerformanceTracker";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { registerServiceWorker } from "@/lib/service-worker";
import { Toaster } from "react-hot-toast";

// --- Design System Configuration (Minimalist Light Blue) ---
const BACKGROUND = "#FAFAFA"; // Off-White (used for UI background)

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname ? pathname.startsWith("/admin") : false;

  console.log('[ClientWrapper] Rendering with pathname:', pathname, 'isAdmin:', isAdmin);

  useEffect(() => {
    // Register service worker for caching and offline support
    registerServiceWorker();
  }, []);


  return (
    <ErrorBoundary
      title="Erreur de l'application"
      message="Une erreur inattendue s'est produite dans l'application. Nos équipes ont été notifiées."
    >
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />

      {/* Performance tracking */}
      <PerformanceTracker />

      {/* FIX: Set language to French for semantic correctness */}
      {/* FIX: Replaced 'bg-background' Tailwind class with inline style using the BACKGROUND constant */}
      {/* Added proper height and positioning to prevent visual obstruction */}
      <div style={{ backgroundColor: BACKGROUND, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Design system reference: Header pattern from foundation-blueprint.html - sticky navbar for non-admin pages */}
        <ErrorBoundary
          title="Erreur de navigation"
          message="Un problème est survenu avec la navigation. Veuillez rafraîchir la page."
          fallback={(error, resetError) => (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">⚠️</span>
                <span className="text-red-700 font-medium">Erreur de navigation</span>
              </div>
              <p className="text-red-600 text-sm mt-1">
                Un problème est survenu avec la navigation. Veuillez rafraîchir la page.
              </p>
              <button
                onClick={resetError}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}
        >
          {!isAdmin && <Navbar />}
        </ErrorBoundary>

        <ErrorBoundary
          title="Erreur du contenu principal"
          message="Impossible de charger le contenu de cette page. Veuillez réessayer."
        >
          {children}
        </ErrorBoundary>

        <ErrorBoundary
          title="Erreur du pied de page"
          message="Un problème est survenu avec le pied de page. Veuillez rafraîchir la page."
          fallback={(error, resetError) => (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">⚠️</span>
                <span className="text-red-700 font-medium">Erreur du pied de page</span>
              </div>
              <p className="text-red-600 text-sm mt-1">
                Un problème est survenu avec le pied de page. Veuillez rafraîchir la page.
              </p>
              <button
                onClick={resetError}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}
        >
          {!isAdmin && <Footer />}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
