/**
 * Admin Projects page - Transformed using foundation-blueprint.html design system
 * Displays project management interface with blueprint-compliant cards and AdminStatsCard
 */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Users } from "lucide-react";
import { getProjects, deleteProject } from "@/lib/projects";
import { formatDate } from "@/lib/utils";
import AdminPageHeader from "@/components/AdminPageHeader/AdminPageHeader";
import AdminStatsCard from "@/components/AdminStatsCard/AdminStatsCard";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await getProjects();
      if (result.success) {
        setProjects(result.data);
      } else {
        console.error("Error loading projects:", result.message);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const handleDeleteProject = useCallback(async (projectId) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer ce projet ?",
      )
    ) {
      try {
        const result = await deleteProject(projectId);
        if (result.success) {
          // Refresh the projects list
          loadProjects();
          alert("Projet supprimé avec succès!");
        } else {
          alert(
            result.message ||
              "Erreur lors de la suppression du projet",
          );
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Erreur lors de la suppression du projet");
      }
    }
  }, []);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "Actif").length;
    const totalBeneficiaries = projects.reduce(
      (acc, p) =>
        acc + (p.peopleHelped ? parseInt(p.peopleHelped) || 0 : 0),
      0,
    );
    const totalContentSections = projects.reduce(
      (acc, p) => acc + (p.content?.length || 0),
      0,
    );

    return {
      totalProjects,
      activeProjects,
      totalBeneficiaries,
      totalContentSections,
    };
  }, [projects]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    // Blueprint container pattern: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminPageHeader
        title="Gestion des Projets"
        subtitle="Gérer vos projets et initiatives"
        actionButton={
          <Link
            href="/admin/projects/new"
            className="px-8 py-4 rounded-full bg-accent text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Projet
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div className="card-lift bg-white rounded-xl shadow-lg p-12 text-center scroll-reveal">
          <div className="text-accent mb-4">
            <Plus className="h-24 w-24 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">
            Aucun projet trouvé
          </h2>
          <p className="text-dark-text/70 mb-6">
            Commencez par créer votre premier projet en utilisant le bouton
            ci-dessus.
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Créer le Premier Projet
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="card-lift bg-white rounded-xl shadow-lg overflow-hidden scroll-reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-dark-text mb-2">
                      {project.title}
                    </h2>
                    <p className="text-dark-text/70 mb-3 line-clamp-2">
                      {truncateText(project.excerpt, 50)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.categories?.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 bg-primary-light/70 text-accent text-sm font-medium rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="p-2 text-dark-text/50 hover:text-accent transition-colors"
                      title="Voir le projet"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="p-2 text-dark-text/50 hover:text-accent transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      className="p-2 text-dark-text/50 hover:text-accent transition-colors"
                      title="Supprimer"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-dark-text/70 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>Créé le {formatDate(project.createdAt)}</span>
                  </div>
                  {project.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.peopleHelped && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span>{project.peopleHelped} bénéficiaires</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-light/70 text-accent">
                        {project.status || "Actif"}
                      </span>
                      <span className="text-dark-text/70">
                        {project.content?.length || 0} sections de contenu
                      </span>
                      {project.goals?.length > 0 && (
                        <span className="text-dark-text/70">
                          {project.goals.length} objectif
                          {project.goals.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-dark-text/50">
                      ID: {project.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats - Blueprint stats cards */}
      {projects.length > 0 && (
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="scroll-reveal">
            <AdminStatsCard
              title="Projets Total"
              value={stats.totalProjects}
              type="total"
            />
          </div>
          <div className="scroll-reveal" style={{ animationDelay: "0.1s" }}>
            <AdminStatsCard
              title="Projets Actifs"
              value={stats.activeProjects}
              type="total"
            />
          </div>
          <div className="scroll-reveal" style={{ animationDelay: "0.2s" }}>
            <AdminStatsCard
              title="Bénéficiaires Total"
              value={stats.totalBeneficiaries}
              type="users"
            />
          </div>
          <div className="scroll-reveal" style={{ animationDelay: "0.3s" }}>
            <AdminStatsCard
              title="Sections de Contenu"
              value={stats.totalContentSections}
              type="blogs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
