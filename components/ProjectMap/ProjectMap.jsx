"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Users, Calendar, Target, ExternalLink } from "lucide-react";
import { getProjects } from "@/lib/projects";
import Container from "@/components/Container/Container";
import SectionHeader from "@/components/SectionHeader/SectionHeader";

// --- Design System Constants ---
const ACCENT_COLOR = "#6495ED"; // Foundation Blue (Solidarity)
const TEXT_COLOR = "#333333";
const SECONDARY_COLOR = "#606060";

// Moroccan cities coordinates (approximate)
const MOROCCO_COORDINATES = {
  'casablanca': { lat: 33.5731, lng: -7.5898, name: 'Casablanca' },
  'rabat': { lat: 34.0209, lng: -6.8416, name: 'Rabat' },
  'marrakech': { lat: 31.6295, lng: -7.9811, name: 'Marrakech' },
  'fès': { lat: 34.0372, lng: -5.0076, name: 'Fès' },
  'tanger': { lat: 35.7595, lng: -5.8339, name: 'Tanger' },
  'agadir': { lat: 30.4278, lng: -9.5981, name: 'Agadir' },
  'meknès': { lat: 33.8935, lng: -5.5473, name: 'Meknès' },
  'oujda': { lat: 34.6867, lng: -1.9114, name: 'Oujda' },
  'kenitra': { lat: 34.2610, lng: -6.5802, name: 'Kénitra' },
  'tétouan': { lat: 35.5785, lng: -5.3684, name: 'Tétouan' }
};

/**
 * ProjectMap - Interactive map showing project locations
 * Displays projects geographically with filtering and details
 */
export const ProjectMap = ({ height = 500, showFilters = true, showProjectCards = true }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();
        // Filter projects with location data
        const projectsWithLocation = projectData.filter(project =>
          project.location && project.location.trim() !== ''
        );
        setProjects(projectsWithLocation);
        setFilteredProjects(projectsWithLocation);
      } catch (err) {
        console.error('Error loading projects for map:', err);
        setError('Impossible de charger les projets pour la carte');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Extract unique categories from projects
  const availableCategories = Array.from(
    new Set(projects.flatMap(project => project.categories || []))
  );

  // Filter projects by selected categories
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project =>
          project.categories?.some(category =>
            selectedCategories.includes(category)
          )
        )
      );
    }
  }, [selectedCategories, projects]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getProjectCoordinates = (location) => {
    if (!location) return null;

    const locationLower = location.toLowerCase();

    // Try to find matching city coordinates
    for (const [cityKey, coords] of Object.entries(MOROCCO_COORDINATES)) {
      if (locationLower.includes(cityKey) || locationLower.includes(coords.name.toLowerCase())) {
        return coords;
      }
    }

    // Default to Casablanca if no match found
    return MOROCCO_COORDINATES.casablanca;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'actif': return '#10B981'; // green
      case 'terminé': return '#3B82F6'; // blue
      case 'en cours': return '#F59E0B'; // yellow
      default: return '#6B7280'; // gray
    }
  };

  if (!mounted || loading) {
    return (
      <Container>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-gray-200 rounded-lg" style={{ height: `${height}px` }}></div>
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
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Aucun projet avec données de localisation disponibles</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="space-y-6">
      <Container>
        <SectionHeader
          title="Carte Interactive des Projets"
          subtitle="Explorez géographiquement l'impact de nos initiatives à travers le Maroc"
          size="small"
          centered={true}
        />

        {/* Category Filters */}
        {showFilters && availableCategories.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filtrer par catégorie :</h4>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedCategories.includes(category)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {category}
                </button>
              ))}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-3 py-1 text-sm rounded-full border border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Tout effacer
                </button>
              )}
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border-2 border-blue-100"
             style={{ height: `${height}px` }}>
          {/* Morocco SVG Background */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* Simplified Morocco outline */}
              <path
                d="M200 100 L600 80 L650 200 L620 400 L400 500 L200 450 L150 300 Z"
                fill="currentColor"
                className="text-green-600"
              />
            </svg>
          </div>

          {/* Project Markers */}
          <div className="absolute inset-0">
            {filteredProjects.map((project, index) => {
              const coords = getProjectCoordinates(project.location);
              if (!coords) return null;

              // Calculate position based on coordinates (simplified projection)
              const x = ((coords.lng + 13) / 26) * 100; // Morocco longitude range approx -13 to 13
              const y = ((50 - coords.lat) / 30) * 100; // Morocco latitude range approx 20 to 50

              return (
                <button
                  key={project.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10"
                  style={{
                    left: `${Math.max(5, Math.min(95, x))}%`,
                    top: `${Math.max(5, Math.min(95, y))}%`,
                  }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                    style={{
                      backgroundColor: getStatusColor(project.status),
                    }}
                  >
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h5 className="font-medium text-sm mb-2">Légende</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Actif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Terminé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>En cours</span>
              </div>
            </div>
          </div>

          {/* Project Counter */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-sm font-medium">
              {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} affiché{filteredProjects.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </Container>

      {/* Project Details Modal/Card */}
      {selectedProject && (
        <Container>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedProject.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {selectedProject.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {selectedProject.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedProject.location}</span>
                      </div>
                    )}
                    {selectedProject.start_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedProject.start_date}</span>
                      </div>
                    )}
                    {selectedProject.people_helped && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedProject.people_helped}</span>
                      </div>
                    )}
                  </div>

                  {selectedProject.categories && selectedProject.categories.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.categories.map(category => (
                          <span
                            key={category}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="flex gap-3">
                <a
                  href={`/projects/${selectedProject.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir le projet
                </a>
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* Project Cards Grid */}
      {showProjectCards && (
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {project.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                    <div
                      className="absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    ></div>
                  </div>
                )}

                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {project.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{project.location}</span>
                    <span>{project.start_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      )}
    </div>
  );
};

export default ProjectMap;
