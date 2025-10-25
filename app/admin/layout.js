"use client";

import React from "react";
import { useAuth } from "hooks/use-project";
import { useLocalStorage } from "hooks/use-enhanced";
import { useToast } from "hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * AdminLayout - Authentication wrapper for admin pages with design system integration
 * Uses foundation-blueprint.html color scheme and animation patterns
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Admin layout with authentication handling
 */
const AdminLayout = ({ children }) => {
  // Design system colors from foundation-blueprint.html
  const ACCENT = "#6495ED"; // Cornflower Blue - Vibrant Accent (--color-accent)
  const BACKGROUND = "#FAFAFA"; // Off-White/Light Gray Background (--color-background)

  // All hooks must be called unconditionally at the top level
  const { user, loading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // User preferences with localStorage persistence
  const [theme, setTheme] = useLocalStorage("adminTheme", "light");

  // Redirect to login if not authenticated (but only if we're not already on login page)
  useEffect(() => {
    if (
      !loading &&
      !isAuthenticated &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login")
    ) {
      // Design system reference: destructive toast variant for errors
      toast({
        title: "Accès refusé",
        description:
          "Vous devez vous connecter pour accéder à l'administration.",
        variant: "destructive",
      });
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, router, toast]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Check if we're on the login page
  const isLoginPage =
    typeof window !== "undefined" &&
    window.location.pathname === "/admin/login";

  // Determine what to render based on authentication state
  if (loading) {
    return (
      // Design system reference: background color and accent spinner
      <div
        className={`flex items-center justify-center min-h-screen bg-background scroll-reveal`}
      >
        {/* Spinner using Accent Blue color from design system */}
        <Loader2
          className={`h-12 w-12 animate-spin text-accent`}
          style={{ color: ACCENT }}
        />
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null; // Will redirect via useEffect
  }

  // If not authenticated and on login page, just render children (login page)
  if (!isAuthenticated && isLoginPage) {
    return <>{children}</>;
  }

  // For authenticated users, render children directly - sidebars are handled by individual section layouts
  return <>{children}</>;
};

export default AdminLayout;
