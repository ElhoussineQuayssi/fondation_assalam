import React from "react";
import Image from "next/image";
import { generateBreadcrumbSchema } from "@/lib/seo";

import { getRandomGalleryImages } from "@/lib/utils";
import UnifiedHero from "@/components/UnifiedHero";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ContentGrid from "@/components/ContentGrid/ContentGrid";
import ContentCard from "@/components/ContentCard/ContentCard";
import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { LoadingError } from "@/components/ErrorFallback/ErrorFallback";
import { ProjectCardSkeleton } from "@/components/Loading/Loading";
import { FloatingShareButton } from "@/components/ShareButton/ShareButton";

export default async function ProjectsPage() {
  let projectsData = [];
  let error = null;

  function generateAltText(project) {
    const title = project.title.toLowerCase();
    if (title.includes('centre himaya')) {
      return "Women and children receiving support at the Centre Himaya facility for those in difficult situations";
    }
    if (title.includes('parrainage orphelins')) {
      return "Orphans receiving comprehensive support through the KAFALA sponsorship program";
    }
    if (title.includes('fataer al baraka')) {
      return "Women learning traditional Moroccan pastry making at the Fataer Al Baraka training center";
    }
    if (title.includes('nadi assalam')) {
      return "Women training in sewing and fashion design at the Nadi Assalam professional center";
    }
    if (title.includes('jardin enfants rihana')) {
      return "Young children engaged in educational activities at Jardin d'Enfants Rihana As-Salam preschool";
    }
    if (title.includes('parrainage imtiaz')) {
      return "Brilliant students from disadvantaged backgrounds receiving sponsorship through the Imtiaz program";
    }
    // Default fallback
    return `${project.title} - ${project.excerpt}`;
  }

  // SEO Breadcrumbs for Projects page
  const breadcrumbs = [
    { name: "Nos Projets", url: "https://assalam.org/projects" }
  ];

  // Projects page structured data
  const projectsPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nos Projets - Fondation Assalam",
    "description": "Découvrez nos projets principaux qui transforment des vies à travers le Maroc : éducation, autonomisation des femmes, protection des enfants.",
    "url": "https://assalam.org/projects",
    "breadcrumb": generateBreadcrumbSchema(breadcrumbs)
  };

  // Fetch data server-side
  try {
    // Fetch projects from API
    const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects?limit=50&offset=0`, {
      cache: 'no-store' // Ensure fresh data
    });

    if (!projectsResponse.ok) {
      throw new Error(`HTTP error! status: ${projectsResponse.status}`);
    }

    const projectsResult = await projectsResponse.json();
    projectsData = projectsResult.projects || [];
  } catch (err) {
    console.error("Erreur de chargement des projets côté serveur:", err);
    error = "Échec de la récupération des projets. Veuillez réessayer.";
  }

  // Get gallery images (this can be done server-side too)
  let illustrationImages = [];
  let imageError = null;

  try {
    illustrationImages = await getRandomGalleryImages(4);
  } catch (err) {
    console.error('Failed to fetch gallery images:', err);
    imageError = 'Impossible de charger les images. Utilisation des images par défaut.';
    illustrationImages = Array(4).fill('/placeholder.svg?height=400&width=600');
  }

  const projects = projectsData.map((project, index) => ({
    title: project.title,
    excerpt: project.excerpt,
    image: project.image || (illustrationImages.length === 0 ?
      '/placeholder.svg?height=400&width=600' :
      illustrationImages[index % illustrationImages.length]),
    link: `/projects/${project.slug}`,
    imageAlt: generateAltText(project),
  }));

  return (
    <main style={{ backgroundColor: "#FAFAFA" }} >
      {/* Image loading error display */}
      {imageError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 mx-6 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-yellow-700 font-medium">Avertissement</span>
          </div>
          <p className="text-yellow-600 text-sm mt-1">{imageError}</p>
        </div>
      )}

      {/* Error display for projects */}
      {error && (
        <Container className="py-16 text-center">
          <LoadingError
            message={error}
            // No retry function for server component
          />
        </Container>
      )}

      {/* Only render content if no error */}
      {!error && (
        <>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsPageSchema) }}
      />

      {/* Header Section */}
      <ErrorBoundary
        title="Erreur du header"
        message="Impossible de charger l'en-tête de la page. Veuillez rafraîchir la page."
      >
        <UnifiedHero
          title="Nos Projets"
          subtitle="Découvrez nos initiatives qui transforment des vies à travers le Maroc."
          images={illustrationImages.slice(0, 4)}
        />
      </ErrorBoundary>

      {/* Main Projects Section */}
      <div className="bg-blue-50 py-16 rounded-xl px-8">
        <ErrorBoundary
          title="Erreur des projets"
          message="Impossible de charger la section des projets. Veuillez réessayer."
        >
          <SectionHeader
            title="Nos Projets Principaux"
            subtitle="Découvrez nos initiatives qui transforment des vies à travers le Maroc"
            size="small"
            centered={true}
          />

          {/* Projects display */}
          {projectsData.length === 0 ? (
            <p className="text-center text-xl text-gray-600">
              Aucun projet n'est actuellement disponible.
            </p>
          ) : (
            <ContentGrid
              items={projects}
              columns={{ default: 1, md: 2, lg: 3 }}
              renderItem={(project, index) => (
                <ContentCard
                  key={index}
                  title={project.title}
                  excerpt={project.excerpt}
                  image={project.image}
                  imageAlt={project.imageAlt}
                  link={project.link}
                  index={index}
                />
              )}
            />
          )}
        </ErrorBoundary>
      </div>



      {/* Community Impact Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 rounded-xl shadow-lg">
        <ErrorBoundary
          title="Erreur de la section impact"
          message="Impossible de charger la section impact communautaire. Veuillez rafraîchir la page."
        >
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Impact Communautaire
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Nos projets ne se limitent pas à fournir des ressources, mais
                  visent également à renforcer les communautés locales. Grâce à
                  des initiatives collaboratives, nous créons des opportunités
                  durables pour les générations futures.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-64 flex items-center justify-center shadow-inner">
                <Image
                  src={illustrationImages.length === 0 ? '/placeholder.svg?height=400&width=600' : illustrationImages[0]}
                  alt="Community impact illustration"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </Container>
        </ErrorBoundary>
      </div>

      {/* Transforming Lives Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 rounded-xl shadow-lg">
        <ErrorBoundary
          title="Erreur de la section transformation"
          message="Impossible de charger la section transformation des vies. Veuillez rafraîchir la page."
        >
          <Container className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-blue-600 hover:text-blue-700 transition-colors duration-300">
              Transformer des Vies, Construire des Avenirs
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Nos initiatives majeures pour un développement durable et inclusif au Maroc
            </p>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-600">
                  Forage de Puits : L'Eau, Source de Vie
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Objectif : Briser la barrière de l'inaccessibilité à l'eau
                  potable dans les zones rurales isolées.
                </p>
                <ul className="text-gray-700 space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Études géologiques approfondies pour localiser les nappes phréatiques.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Construction de puits équipés de systèmes de pompage modernes.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Formation des habitants pour assurer l'entretien et la pérennité des installations.
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-600">
                  Construction d'Écoles : L'Éducation, un Droit pour Tous
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Objectif : Offrir aux enfants des zones rurales un accès à une
                  éducation de qualité.
                </p>
                <ul className="text-gray-700 space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Écoles primaires modernes, équipées en matériel pédagogique adapté.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Programmes de sensibilisation pour encourager la scolarisation,
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    en particulier des filles.
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Puits forés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                <div className="text-gray-600">Écoles construites</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Enfants scolarisés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                <div className="text-gray-600">Communautés rurales</div>
              </div>
            </div>
          </Container>
        </ErrorBoundary>
      </div>

      {/* Self-Sufficient Village Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 rounded-xl shadow-lg">
        <ErrorBoundary
          title="Erreur du village autosuffisant"
          message="Impossible de charger la section village autosuffisant. Veuillez rafraîchir la page."
        >
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Un Village Autosuffisant
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Le premier village orange au Maroc est un modèle innovant de
                  développement communautaire. Avec des infrastructures modernes
                  et des centres éducatifs, ce projet vise à autonomiser les
                  habitants des zones rurales.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-64 flex items-center justify-center md:order-1 shadow-inner">
                <Image
                  src={illustrationImages.length === 0 ? '/placeholder.svg?height=400&width=600' : illustrationImages[1]}
                  alt="Self-sufficient village illustration"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </Container>
        </ErrorBoundary>
      </div>

      {/* Call to Action Section */}
      <section className="text-center bg-blue-600 text-white p-12 rounded-lg shadow-lg">
        <ErrorBoundary
          title="Erreur de l'appel à l'action"
          message="Impossible de charger la section d'appel à l'action. Veuillez rafraîchir la page."
        >
          <Container>
            <h2 className="text-3xl font-bold mb-6">
              Rejoignez-Nous dans Cette Aventure Humanitaire
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Ensemble, nous pouvons transformer des vies, renforcer des
              communautés et apporter de l'espoir là où il est le plus nécessaire.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                href="/contact?type=donation"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Faire un Don
              </Button>
              <Button
                href="/contact?type=volunteer"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Devenir Bénévole
              </Button>
            </div>
          </Container>
        </ErrorBoundary>
      </section>

          {/* Floating Share Button */}
          <FloatingShareButton
            title="Nos Projets - Fondation Assalam"
            description="Découvrez nos projets principaux qui transforment des vies à travers le Maroc : éducation, autonomisation des femmes, protection des enfants."
            slug="/projects"
          />
        </>
      )}
    </main>
  );
}
