"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Mail,
  Eye,
  LogOut,
  FolderOpen,
  ThumbsUp,
  Loader2, // Imported for local utility
  AlertTriangle, // Imported for local utility
} from "lucide-react";
import { useStats } from "hooks/use-admin";
import { useAuth } from "hooks/use-project";
import { useToast } from "hooks/use-toast";
import Alert from "@/components/Alert/Alert";

// Import the new dashboard card components
import RecentArticlesCard from "@/components/RecentArticlesCard/RecentArticlesCard.jsx";
import RecentProjectsCard from "@/components/RecentProjectsCard/RecentProjectsCard.jsx";
import RecentMessagesCard from "@/components/RecentMessagesCard/RecentMessagesCard.jsx";

// Static imports for previously dynamic components
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import AdminPageHeader from "@/components/AdminPageHeader/AdminPageHeader";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import AdminStatsCard from "@/components/AdminStatsCard/AdminStatsCard";
// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refresh: refreshStats,
  } = useStats();

  if (!authLoading && !isAuthenticated) {
    router.replace("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        toast({
          title: "Déconnexion réussie",
          description: "Vous avez été déconnecté avec succès.",
        });
        router.replace("/admin/login");
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la déconnexion. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  if (statsError) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-start pt-20">
        <Alert message={statsError} />
      </div>
    );
  }

  if (authLoading || statsLoading || !stats || !user) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const userRole = user.role;

  const {
    totalBlogs,
    newBlogsPercent,
    totalMessages,
    newMessagesPercent,
    totalViews,
    viewsChangePercent,
    recentBlogs,
  } = stats;

  const getRandomCards = (userRole) => {
    const availableCards = [];

    // Always add articles if data exists
    if (totalBlogs !== undefined && totalBlogs !== null) {
      availableCards.push({
        key: "articles",
        title: "Total des articles",
        value: totalBlogs,
      });
    }

    // Always add projects if data exists
    if (stats.totalProjects !== undefined && stats.totalProjects !== null) {
      availableCards.push({
        key: "projects",
        title: "Projets actifs",
        value: stats.totalProjects,
      });
    }

    // Always add messages if data exists
    if (totalMessages !== undefined && totalMessages !== null) {
      availableCards.push({
        key: "messages",
        title: "Messages",
        value: totalMessages,
      });
    }

    // Always add views if data exists
    if (totalViews !== undefined && totalViews !== null) {
      availableCards.push({
        key: "views",
        title: "Vues",
        value: totalViews,
      });
    }

    // Always add admins if data exists
    if (stats.totalAdmins !== undefined && stats.totalAdmins !== null) {
      availableCards.push({
        key: "admins",
        title: "Administrateurs",
        value: stats.totalAdmins,
      });
    }

    return availableCards;
  };

  const randomCards = getRandomCards(userRole);

  // Debug log to see what cards are being generated
  console.log("Available stats cards:", randomCards);
  console.log("Stats data:", stats);

  return (
    // Main canvas background
    <main className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Tableau de bord"
          subtitle="Vue d'ensemble de votre plateforme"
          actionButton={
            <button
              onClick={handleLogout}
              // Primary Button Pattern
              className={`bg-[${ACCENT}] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform shadow-xl hover:scale-[1.05] hover:shadow-2xl flex items-center`}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </button>
          }
        />

        {/* Stats Cards - Blueprint responsive grid pattern with ScrollReveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 overflow-hidden">
          {randomCards.length > 0 ? (
            randomCards.map((card, index) => (
              <ScrollReveal key={`${card.key}-${index}`} delay={index * 0.1}>
                <AdminStatsCard
                  title={card.title}
                  value={card.value}
                  type={card.key}
                />
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>Chargement des statistiques...</p>
            </div>
          )}
        </div>

        {/* Recent Activity and Messages - Blueprint content sections with ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {(userRole === "super_admin" || userRole === "content_manager") && (
            <>
              {/* Recent Articles Card - Using Component */}
              <RecentArticlesCard recentBlogs={recentBlogs} />

              {/* Recent Projects Card - Using Component */}
              <RecentProjectsCard recentProjects={stats.recentProjects} />
            </>
          )}

          {(userRole === "super_admin" || userRole === "messages_manager") && (
            // Recent Messages Card - Using Component
            <RecentMessagesCard recentMessages={stats.recentMessages} />
          )}
        </div>
      </div>
    </main>
  );
}
