"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Users, Target, ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/projects";
import {
  Timeline,
  TimelineItem,
  TimelineTime,
  TimelineCard,
  TimelineTitle,
  TimelineDescription,
} from "@/components/Timeline/Timeline";
import ContentCard from "@/components/ContentCard/ContentCard";
import Container from "@/components/Container/Container";
import SectionHeader from "@/components/SectionHeader/SectionHeader";

// --- Design System Constants ---
const ACCENT_COLOR = "#6495ED"; // Foundation Blue (Solidarity)
const TEXT_COLOR = "#333333";
const SECONDARY_COLOR = "#606060";

/**
 * ProjectTimeline - Interactive timeline showing projects chronologically
 * Filters and sorts projects by start_date, displays them in a beautiful timeline
 */
export const ProjectTimeline = ({ maxProjects = 10, showProjectLinks = true }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();
        // Filter projects with start dates and sort chronologically
        const projectsWithDates = projectData
          .filter(project => project.start_date)
          .sort((a, b) => {
            // Handle different date formats
            const parseDate = (dateStr) => {
              if (!dateStr) return new Date(0);

              // Handle French month names
              const monthMap = {
                'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
                'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
              };

              // Try to parse as year first (e.g., "2013")
              if (/^\d{4}$/.test(dateStr.trim())) {
                return new Date(parseInt(dateStr), 0, 1);
              }

              // Try to parse as month year (e.g., "Février")
              const monthMatch = dateStr.toLowerCase().match(/(\w+)/);
              if (monthMatch && monthMap[monthMatch[1]]) {
                const year = new Date().getFullYear(); // Use current year if not specified
                return new Date(year, monthMap[monthMatch[1]], 1);
              }

              // Fallback: try standard date parsing
              return new Date(dateStr);
            };

            return parseDate(b.start_date) - parseDate(a.start_date);
          });

        setProjects(projectsWithDates.slice(0, maxProjects));
      } catch (err) {
        console.error('Error loading projects for timeline:', err);
        setError('Impossible de charger les projets pour la timeline');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [maxProjects]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date inconnue';

    // Handle year format (e.g., "2013")
    if (/^\d{4}$/.test(dateStr.trim())) {
      return dateStr;
    }

    // Handle month format (e.g., "Février")
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1).toLowerCase();
  };

  const getProjectStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'actif':
        return { label: 'Actif', color: 'bg-green-100 text-green-800' };
      case 'terminé':
        return { label: 'Terminé', color: 'bg-blue-100 text-blue-800' };
      case 'en cours':
        return { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'Actif', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (!mounted || loading) {
    return (
      <Container>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Réessayer
          </button>
        </div>
      </Container>
    );
  }

  if (projects.length === 0) {
    return (
      <Container>
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Aucun projet avec dates disponibles pour la timeline</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader
        title="Évolution de Nos Projets"
        subtitle="Découvrez l'historique et l'impact de nos initiatives au fil du temps"
        size="small"
        centered={true}
      />

      <Timeline>
        {projects.map((project, index) => {
          const status = getProjectStatus(project.status);

          return (
            <TimelineItem key={project.id} index={index}>
              <TimelineCard>
                <div className="flex items-start justify-between mb-3">
                  <TimelineTime date={formatDate(project.start_date)} />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <TimelineTitle>{project.title}</TimelineTitle>
                <TimelineDescription>{project.excerpt}</TimelineDescription>

                {/* Project metadata */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  {project.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                      <span>{project.location}</span>
                    </div>
                  )}

                  {project.people_helped && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                      <span>{project.people_helped}</span>
                    </div>
                  )}

                  {project.categories && project.categories.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                      <span>{project.categories.slice(0, 2).join(', ')}</span>
                    </div>
                  )}
                </div>

                {showProjectLinks && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
                      style={{ color: ACCENT_COLOR }}
                    >
                      En savoir plus
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </TimelineCard>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Container>
  );
};

export default ProjectTimeline;
