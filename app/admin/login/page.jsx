"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { login } from "lib/actions";
import { getSession } from "lib/auth";
import { useToast } from "hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Alert from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import AdminLoginForm from "@/components/AdminLoginForm/AdminLoginForm";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

// --- Main Component ---
export default function AdminLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isRedirected, setIsRedirected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check if this is a redirect by looking for redirect query params or referrer
    const checkIfRedirected = () => {
      const redirectParam = searchParams.get('redirected');
      const referrer = document.referrer;
      const isFromAdminRoute = referrer && referrer.includes('/admin') && !referrer.includes('/admin/login');

      return redirectParam === 'true' || isFromAdminRoute;
    };

    async function checkSession() {
      try {
        // Small delay to ensure any redirect state is cleared
        await new Promise(resolve => setTimeout(resolve, 100));

        const session = await getSession();
        if (session && isMounted) {
          // Use replace to avoid adding to history stack
          router.replace("/admin/dashboard");
        } else if (isMounted) {
          setIsCheckingSession(false);

          // If this appears to be a redirect, mark it for special handling
          if (checkIfRedirected()) {
            setIsRedirected(true);
            // Force a router refresh to clear any stale state
            setTimeout(() => {
              if (isMounted) {
                router.refresh();
              }
            }, 200);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (isMounted) {
          setIsCheckingSession(false);
          if (checkIfRedirected()) {
            setIsRedirected(true);
            setTimeout(() => {
              if (isMounted) {
                router.refresh();
              }
            }, 200);
          }
        }
      }
    }

    checkSession();

    // Fallback mechanism: if we're still checking session after 3 seconds and this is a redirect,
    // force the form to appear
    const fallbackTimer = setTimeout(() => {
      if (isMounted && isCheckingSession && checkIfRedirected()) {
        console.log('Fallback: Forcing login form to appear after redirect');
        setIsCheckingSession(false);
        setIsRedirected(true);
        router.refresh();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, [router, pathname, searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.target);

    try {
      const result = await login(formData);
      if (result.success) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté à l'administration.",
        });
        // Use replace to avoid adding login page to history
        router.replace("/admin/dashboard");
      } else {
        setError(
          result.message || "Erreur de connexion. Vérifiez vos identifiants.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    // Uses the styled LoadingSpinner utility
    return <LoadingSpinner />;
  }

  // Uses the locally re-implemented AdminLoginForm component with Design System styles
  return (
    <AdminLoginForm
      key={isRedirected ? 'redirected' : 'normal'}
      error={error}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}
