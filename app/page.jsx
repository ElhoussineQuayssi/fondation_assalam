"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useProjects } from "@/hooks/use-project";
import { getRandomGalleryImages } from "@/lib/utils";
import { ErrorFallback, LoadingError } from "@/components/ErrorFallback/ErrorFallback";
import { ProjectCardSkeleton, LoadingSpinner } from "@/components/Loading/Loading";
import { InlineError } from "@/components/ErrorFallback/ErrorFallback";
import { FloatingShareButton } from "@/components/SimpleSocialShare";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import ScrollRevealHandler from "@/components/ScrollRevealHandler";
import Container from "@/components/Container/Container.jsx";
import SectionHeader from "@/components/SectionHeader/SectionHeader.jsx";
import { Timeline, TimelineItem, TimelineCard, TimelineTitle,TimelineTime, TimelineDescription } from "@/components/Timeline/Timeline";
import ContentGrid from "@/components/ContentGrid/ContentGrid.jsx";
import ImageTextSection from "@/components/ImageTextSection/ImageTextSection.jsx";
import UnifiedHero from "@/components/UnifiedHero.jsx";
import TestimonialCard from "@/components/TestimonialCard/TestimonialCard.jsx";
import ContentCard from "@/components/ContentCard/ContentCard.jsx";
import StatsCard from "@/components/StatsCard/StatsCard.jsx";
import { FlipCard } from "@/components/FlipCard.jsx";

import { getBlogs } from "@/lib/blogs";


  // Design System Configuration
  const DESIGN_SYSTEM = {
    spacing: {
      sectionPadding: "py-16 px-6",
    },
    typography: {
      h2: "text-2xl font-bold",
      body: "text-base",
    },
  };

  // Color constants (matching the design system)
  const ACCENT = "#6495ED"; // Cornflower Blue
  const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
  const DARK_TEXT = "#333333"; // Dark Gray

// Check if HeroSection component exists, if not create import
// Based on memory, HeroSection doesn't exist, so we need to create it
// But first, let's remove the inline component definitions and use existing ones

/**
 * @returns {JSX.Element} Enhanced home page with comprehensive error handling
 */
export default function Home() {
   const { projects: projectsData, loading, error, retry, retryCount } = useProjects();

   // DEBUG: Log the raw data from the hook
   console.log('[DEBUG] useProjects hook result:', {
     projectsData,
     loading,
     error,
     retryCount,
     projectsDataLength: projectsData?.length,
     projectsDataType: typeof projectsData
   });

  // State for random gallery images
  const [fallbackImages, setFallbackImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageError, setImageError] = useState(null);
  const [heroImages, setHeroImages] = useState([]);

  // Enhanced image fetching with better error handling
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setImageError(null);
        // Get 6 random images for the fallback projects
        const images = await getRandomGalleryImages(6);
        setFallbackImages(images);
        // Get 6 random images for the hero
        const heroImgs = await getRandomGalleryImages(6);
        setHeroImages(heroImgs);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        setImageError('Impossible de charger les images. Utilisation des images par défaut.');
        // Fallback to placeholder
        setFallbackImages(Array(6).fill('/placeholder.svg?height=400&width=600'));
        setHeroImages(Array(4).fill('/placeholder.svg?height=400&width=600'));
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, []);

  // Memoize the projects array to avoid unnecessary re-renders
  const projects = useMemo(() => {
    console.log('[DEBUG] useMemo projects calculation:', {
      loading,
      loadingImages,
      error,
      projectsDataLength: projectsData?.length,
      projectsDataType: typeof projectsData,
      fallbackImagesLength: fallbackImages?.length
    });

    if (loading || loadingImages) {
      console.log('[DEBUG] Returning loading skeletons');
      // Show loading skeletons
      return Array(6).fill(null);
    }

    if (error) {
      console.log('[DEBUG] Returning error state');
      // Show error state
      return 'error';
    }

    if (!projectsData || projectsData.length === 0) {
      console.log('[DEBUG] No projects data, using fallback projects');
      // Use fallback images if loaded, otherwise use placeholders
      const imagesToUse = fallbackImages.length > 0 ? fallbackImages : Array(6).fill('/placeholder.svg?height=400&width=600');
      return [
        {
          title: "Rihana As Salam",
          excerpt: "Programme de soutien pour les femmes en difficulté.",
          image: imagesToUse[0] || '/placeholder.svg?height=400&width=600',
          link: "/projects/rihana-as-salam",
          imageAlt: "Women in difficult situations receiving comprehensive support through the Rihana As Salam program",
        },
        {
          title: "Programme Kafala",
          excerpt: "Programme de parrainage pour les orphelins.",
          image: imagesToUse[1] || '/placeholder.svg?height=400&width=600',
          link: "/projects/programme-kafala",
          imageAlt: "Orphans receiving comprehensive support through the KAFALA sponsorship program",
        },
        {
          title: "Programme Imtiaz",
          excerpt:
            "Parrainage des étudiants brillants issus de milieux défavorisés.",
          image: imagesToUse[2] || '/placeholder.svg?height=400&width=600',
          link: "/projects/programme-imtiaz",
          imageAlt: "Brilliant students from disadvantaged backgrounds receiving sponsorship through the Imtiaz program",
        },
        {
          title: "Fataer Al Baraka",
          excerpt: "Centre de formation en pâtisserie marocaine pour femmes.",
          image: imagesToUse[3] || '/placeholder.svg?height=400&width=600',
          link: "/projects/fataer-al-baraka",
          imageAlt: "Women learning traditional Moroccan pastry making at the Fataer Al Baraka training center",
        },
        {
          title: "Centre Himaya",
          excerpt: "Centre pluridisciplinaire de soutien aux femmes et enfants.",
          image: imagesToUse[4] || '/placeholder.svg?height=400&width=600',
          link: "/projects/centre-himaya",
          imageAlt: "Women and children receiving support at the Centre Himaya facility for those in difficult situations",
        },
        {
          title: "Nadi Assalam",
          excerpt: "Un avenir cousu d'espoir.",
          image: imagesToUse[5] || '/placeholder.svg?height=400&width=600',
          link: "/projects/nadi-assalam",
          imageAlt: "Women training in sewing and fashion design at the Nadi Assalam professional center",
        },
      ];
    }

    console.log('[DEBUG] Mapping database projects:', projectsData?.map(p => ({ title: p.title, slug: p.slug })));
    // Map database projects to the expected format
    return projectsData?.map((project) => ({
      title: project.title,
      excerpt: project.excerpt,
      image: project.image || '/placeholder.svg?height=400&width=600', // Use database image URL or fallback
      link: `/projects/${project.slug}`,
      imageAlt: project.title + " - " + project.excerpt, // Generate alt text
    }));
  }, [projectsData, fallbackImages, loading, loadingImages, error]);



  // Fetch blog data from database
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsError(null);
        const result = await getBlogs();
        if (result.success) {
          // Filter to only published blogs and take first 3
          const publishedBlogs = result.data.filter(blog => blog.status === 'published').slice(0, 3);
          setBlogs(publishedBlogs);
        } else {
          console.error('Failed to fetch blogs:', result.message);
          setBlogsError('Impossible de charger les articles.');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogsError('Impossible de charger les articles.');
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Minimal loading state for full-page loading (only when projects haven't been fetched yet)
  const isPageLoading = loading && projectsData === null;

  // Full-page loading state (only for initial project data fetch)
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Chargement des données initiales..." />
      </div>
    );
  }

  // Removed full-page error check - ErrorBoundary handles project errors gracefully
  // This prevents blocking other sections (CTA, Timeline, etc.) when projects fail

  return (
    // FIX: Replace bg-background with inline style
    <div style={{ backgroundColor: "#FAFAFA", minHeight: '100vh', position: 'relative', zIndex: 1 }} className="min-h-screen">
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

      {/* Hero Section - Blueprint pattern with primary-light background */}
      {console.log('[DEBUG] Rendering Hero Section, heroImages length:', heroImages.length)}
      <ErrorBoundary
        title="Erreur du hero"
        message="Impossible de charger la section hero. Veuillez rafraîchir la page."
        fallback={(error, resetError) => {
          console.log('[DEBUG] Hero ErrorBoundary fallback triggered:', error);
          return (
            <div className="bg-blue-50 py-16 px-6 text-center">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Assalam - Ensemble pour un avenir meilleur
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Une fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc.
                </p>
                <div className="space-x-4">
                  <Link href="/projects" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Nos Projets
                  </Link>
                  <Link href="/contact" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-100 transition-colors">
                    Faire un Don
                  </Link>
                </div>
                <button
                  onClick={resetError}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Réessayer de charger la section
                </button>
              </div>
            </div>
          );
        }}
      >
        <UnifiedHero
          title={
            "Assalam - Ensemble pour un avenir meilleur"
          }
          subtitle="Une fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc."
          slug=""
          description="Fondation Assalam - Une fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc depuis plus de 30 ans."
          actions={[
            {
              text: "Nos Projets",
              href: "/projects",
            },
            {
              text: "Faire un Don",
              href: "/contact",
            },
          ]}
          images={heroImages}
        />
      </ErrorBoundary>

      {/* Stats Section (No background color change, only structural classes) */}
      <section className={`${DESIGN_SYSTEM.spacing.sectionPadding}`}>
        <Container>
          <SectionHeader
            title="Nos Chiffres Clés"
            subtitle="L'impact mesuré de nos actions sur la société marocaine"
          />

          <ContentGrid
            items={[
              { value: "6+", title: "Projets Actifs" },
              { value: "1000+", title: "Bénéficiaires Aidés" },
              { value: "98%", title: "Taux de Satisfaction" },
            ]}
            columns={{ default: 1, md: 3 }}
            renderItem={(stat, index) => (
              <StatsCard key={index} value={stat.value} title={stat.title} />
            )}
          />
        </Container>
      </section>

      {/* Projects Section - Enhanced with blueprint content cards */}
      {/* FIX: Replace bg-primary-light/50 with inline style (PRIMARY_LIGHT + 50% opacity) */}
      {console.log('[DEBUG] Rendering Projects Section, projects:', projects, 'loading:', loading, 'error:', error)}
      <section
        className={`${DESIGN_SYSTEM.spacing.sectionPadding}`}
        style={{ backgroundColor: `${PRIMARY_LIGHT}80` }}
      >
        <ErrorBoundary
          title="Erreur des projets"
          message="Impossible de charger la section des projets. Veuillez réessayer."
          fallback={(error, resetError) => {
            console.log('[DEBUG] Projects ErrorBoundary fallback triggered:', error);
            return (
              <LoadingError
                message="Erreur lors du chargement des projets"
                onRetry={resetError}
              />
            );
          }}
        >
          <Container>
            <SectionHeader
              title="Nos Projets Principaux"
              subtitle="Découvrez nos initiatives principales qui transforment des vies à travers le Maroc"
            />

            {/* Projects loading state */}
            {loading || loadingImages ? (
              <ContentGrid
                items={Array(6).fill(null)}
                columns={{ default: 1, md: 2, lg: 3 }}
                renderItem={(item, index) => (
                  <ProjectCardSkeleton key={index} />
                )}
              />
            ) : error ? (
              /* Projects error state */
              <div className="text-center py-12">
                <LoadingError
                  message={`Erreur lors du chargement des projets: ${error}`}
                  onRetry={retry}
                />
                {retryCount > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Tentatives: {retryCount}
                  </p>
                )}
              </div>
            ) : projects === 'error' ? (
              /* Fallback projects error state */
              <div className="text-center py-12">
                <LoadingError
                  message="Utilisation des projets par défaut en raison d'une erreur de chargement"
                  onRetry={retry}
                />
              </div>
            ) : (
              /* Projects success state */
              <>
                {console.log('[DEBUG] Rendering projects success state, projects:', projects)}
                <ContentGrid
                  items={projects}
                  columns={{ default: 1, md: 2, lg: 3 }}
                  renderItem={(project, index) => {
                    console.log('[DEBUG] Rendering project card:', index, project.title);
                    return (
                      <FlipCard
                        key={index}
                        index={index}
                        frontContent={
                          <div className="w-full h-full bg-white rounded-xl p-6 shadow-lg border-t-4 border-opacity-70 text-center transition-all duration-300" style={{ borderColor: "#6495ED" }}>
                            <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                              <Image
                                src={project.image}
                                alt={project.imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: "cover" }}
                                className="grayscale hover:grayscale-0 transition-all duration-300"
                                priority={index === 0}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                              />
                            </div>
                            <h4 className="text-xl font-bold mb-2" style={{ color: "#333333" }}>
                              {project.title}
                            </h4>
                            <p className="text-gray-700 text-sm mb-4">{project.excerpt}</p>
                            <p className="text-xs text-gray-500">Cliquez pour en savoir plus</p>
                          </div>
                        }
                        backContent={
                          <div className="w-full h-full bg-white rounded-xl p-6 shadow-lg border-t-4 border-opacity-70 text-center transition-all duration-300 flex flex-col justify-center" style={{ borderColor: "#6495ED" }}>
                            <h4 className="text-xl font-bold mb-4" style={{ color: "#333333" }}>
                              {project.title}
                            </h4>
                            <p className="text-gray-700 text-sm mb-6 flex-grow">{project.excerpt}</p>
                            <Link
                              href={project.link}
                              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                              style={{ backgroundColor: "#6495ED", color: "white" }}
                            >
                              Voir le projet complet
                            </Link>
                          </div>
                        }
                      />
                    );
                  }}
                />
              </>
            )}

            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
                // FIX: Replaced bg-accent text-white with inline styles
                style={{ backgroundColor: ACCENT, color: "white" }}
              >
                Voir tous les projets <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </Container>
        </ErrorBoundary>
      </section>

      {/* ImageText Section - Blueprint pattern with parallax background */}
      {console.log('[DEBUG] Rendering ImageTextSection')}
      <ImageTextSection
        title="Pourquoi Nous Faire Confiance"
        // ENHANCEMENT: Refined subtitle for stronger mission alignment
        subtitle="Fondée en 1992, notre action s'ancre dans une **expertise locale** et une **transparence totale**. Nous créons des changements durables en investissant dans la **dignité** et l'**autonomie**."
        features={[
          // ENHANCEMENT: Added feature highlighting 30+ years of experience
          "Une expérience de plus de **30 ans** au service de la solidarité nationale.",
          "Expertise locale et connaissance approfondie des besoins marocains.",
          "**Transparence totale** dans l'utilisation des fonds (valeur clé).",
          "Approche collaborative avec les communautés locales.",
          "Impact mesurable et suivi rigoureux des résultats.",
        ]}
        buttonText="En Savoir Plus sur notre Mission"
        buttonHref="/about"
      />

      {/* Testimonials Section (No background color change, only structural classes) */}
      {console.log('[DEBUG] Rendering Testimonials Section')}
      <section className={`${DESIGN_SYSTEM.spacing.sectionPadding}`}>
        <ErrorBoundary
          title="Erreur des témoignages"
          message="Impossible de charger la section des témoignages. Veuillez rafraîchir la page."
          fallback={(error, resetError) => {
            console.log('[DEBUG] Testimonials ErrorBoundary fallback triggered:', error);
            return (
              <div className="text-center py-12">
                <LoadingError
                  message="Erreur lors du chargement des témoignages"
                  onRetry={resetError}
                />
              </div>
            );
          }}
        >
          <Container>
            <SectionHeader
              title="Témoignages de l'Impact"
              subtitle="Leurs mots, notre preuve : l'effet réel de la solidarité sur les vies"
            />

            <ContentGrid
              items={[
                {
                  name: "Amina El Mansouri",
                  role: "Bénéficiaire du projet Rayhana",
                  // ENHANCEMENT: Refined quote for stronger emotional impact and core value integration
                  quote:
                    "Le projet **Rayhana** a été un tournant. J'ai retrouvé ma **dignité** et l'**autonomie** nécessaire pour bâtir un avenir stable pour mes enfants. C'est plus qu'une aide, c'est une nouvelle vie pleine d'espoir.",
                },
                {
                  name: "Karim Benali",
                  role: "Bénéficiaire du projet Imtiaz",
                  // ENHANCEMENT: Refined quote for stronger emotional impact and core value integration
                  quote:
                    "**Imtiaz** a illuminé mon parcours. Il m'a permis de me concentrer sur mes études et de transformer la précarité en **opportunité**. Ce parrainage est la preuve que la **solidarité** peut changer un destin.",
                },
              ]}
              columns={{ default: 1, md: 2 }}
              renderItem={(testimonial) => (
                <TestimonialCard
                  key={testimonial.name}
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                />
              )}
            />
          </Container>
        </ErrorBoundary>
      </section>

      {/* Timeline Section - Blueprint pattern with primary line and accent dots */}
      {/* FIX: Replace bg-primary-light/30 with inline style (PRIMARY_LIGHT + 30% opacity) */}
      {console.log('[DEBUG] Rendering Timeline Section')}
      <section
        className={`${DESIGN_SYSTEM.spacing.sectionPadding}`}
        style={{ backgroundColor: `${PRIMARY_LIGHT}4D` }}
      >
        <ErrorBoundary
          title="Erreur de la timeline"
          message="Impossible de charger la section timeline. Veuillez rafraîchir la page."
          fallback={(error, resetError) => {
            console.log('[DEBUG] Timeline ErrorBoundary fallback triggered:', error);
            return (
              <div className="text-center py-12">
                <LoadingError
                  message="Erreur lors du chargement de la timeline"
                  onRetry={resetError}
                />
              </div>
            );
          }}
        >
          <Container>
            <SectionHeader
              title="Notre Processus Simple"
              subtitle="Une approche claire et efficace pour réaliser nos projets"
            />

            <Timeline>
              <TimelineItem index={0}>
                <TimelineCard>
                  <TimelineTime date="Étape 1" />
                  <TimelineTitle>1. Évaluation des Besoins</TimelineTitle>
                  <TimelineDescription>
                    Analyse approfondie des besoins réels de la communauté cible pour identifier les problématiques majeures et établir des priorités d'intervention.
                  </TimelineDescription>
                </TimelineCard>
              </TimelineItem>

              <TimelineItem index={1}>
                <TimelineCard>
                  <TimelineTime date="Étape 2" />
                  <TimelineTitle>2. Conception du Projet</TimelineTitle>
                  <TimelineDescription>
                    Développement d'une stratégie sur mesure, intégrant l'expertise locale et la participation active des partenaires communautaires pour garantir la pertinence et la durabilité.
                  </TimelineDescription>
                </TimelineCard>
              </TimelineItem>

              <TimelineItem index={2}>
                <TimelineCard>
                  <TimelineTime date="Étape 3" />
                  <TimelineTitle>3. Mise en Œuvre</TimelineTitle>
                  <TimelineDescription>
                    Déploiement opérationnel avec un suivi rigoureux, une transparence totale et une adaptation continue aux réalités du terrain pour maximiser l'efficacité.
                  </TimelineDescription>
                </TimelineCard>
              </TimelineItem>

              <TimelineItem index={3}>
                <TimelineCard>
                  <TimelineTime date="Étape 4" />
                  <TimelineTitle>4. Évaluation & Impact</TimelineTitle>
                  <TimelineDescription>
                    Mesure quantitative et qualitative des résultats obtenus, analyse des leçons apprises et ajustements stratégiques pour un impact toujours plus grand et durable.
                  </TimelineDescription>
                </TimelineCard>
              </TimelineItem>
            </Timeline>
          </Container>
        </ErrorBoundary>
      </section>

      {/* Blog Section */}
      {console.log('[DEBUG] Blog Section condition check - blogsLoading:', blogsLoading, 'blogsError:', blogsError, 'blogs.length:', blogs.length)}
      {!blogsLoading && (
        <section className={`${DESIGN_SYSTEM.spacing.sectionPadding}`}>
          <ErrorBoundary
            title="Erreur du blog"
            message="Impossible de charger la section blog. Veuillez rafraîchir la page."
            fallback={(error, resetError) => {
              console.log('[DEBUG] Blog ErrorBoundary fallback triggered:', error);
              return (
                <div className="text-center py-12">
                  <LoadingError
                    message="Erreur lors du chargement du blog"
                    onRetry={resetError}
                  />
                </div>
              );
            }}
          >
            <Container>
              <SectionHeader
                title="Actualités & Blog"
                subtitle="Restez informé de nos dernières activités et nouvelles"
              />

              {blogsError ? (
                /* Blog error state */
                <div className="text-center py-12">
                  <LoadingError
                    message={blogsError}
                    onRetry={() => window.location.reload()}
                  />
                </div>
              ) : blogs.length > 0 ? (
                /* Blog success state */
                <>
                  <ContentGrid
                    items={blogs}
                    columns={{ default: 1, md: 2, lg: 3 }}
                    renderItem={(blog, index) => (
                      <ContentCard
                        key={blog.id}
                        title={blog.title}
                        excerpt={blog.excerpt}
                        image={blog.image}
                        link={`/blogs/${blog.slug}`}
                        category={blog.category}
                        date={blog.created_at}
                        index={index}
                      />
                    )}
                  />

                  <div className="text-center mt-12">
                    <Link
                      href="/blogs"
                      className="inline-flex items-center px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
                      // FIX: Replaced bg-accent text-white with inline styles
                      style={{ backgroundColor: ACCENT, color: "white" }}
                    >
                      Voir tous les articles <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </>
              ) : (
                /* Blog empty state - fallback content */
                <div className="text-center py-16">
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                      <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Bientôt Disponible
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Notre section d'actualités est en préparation. Restez connecté pour découvrir nos dernières nouvelles et initiatives.
                    </p>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        📝 Articles sur nos projets en cours<br/>
                        📰 Mises à jour de la fondation<br/>
                        💡 Histoires inspirantes de notre communauté
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center px-6 py-3 rounded-full font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
                        style={{ backgroundColor: ACCENT, color: "white" }}
                      >
                        Être informé des nouvelles <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </Container>
          </ErrorBoundary>
        </section>
      )}


      {/* CTA Section - Blueprint pattern with accent background */}
      {console.log('[DEBUG] Rendering CTA Section')}
      <section
        className={`${DESIGN_SYSTEM.spacing.sectionPadding} py-20 px-6 rounded-xl border-2 shadow-2xl scroll-reveal`}
        // FIX: Replaced border-accent/50 bg-white and text-dark-text (implicitly for children) with inline styles
        style={{
          backgroundColor: "white",
          borderColor: `${ACCENT}80`, // 80 is 50% opacity
          color: DARK_TEXT,
        }}
      >
        <ErrorBoundary
          title="Erreur de l'appel à l'action"
          message="Impossible de charger la section d'appel à l'action. Veuillez rafraîchir la page."
          fallback={(error, resetError) => {
            console.log('[DEBUG] CTA ErrorBoundary fallback triggered:', error);
            return (
              <div className="text-center">
                <LoadingError
                  message="Erreur lors du chargement de l'appel à l'action"
                  onRetry={resetError}
                />
              </div>
            );
          }}
        >
          <Container className="text-center">
            {/* </ENHANCEMENT: Refined title and subtitle for maximum engagement */}
            <h2 className={`${DESIGN_SYSTEM.typography.h2} mb-4`}>
              Devenez le **Pilier de l'Espoir** et Rejoignez Notre Mission de
              **Solidarité**
            </h2>
            <p
              className={`${DESIGN_SYSTEM.typography.body} mb-8 max-w-2xl mx-auto`}
            >
              Chaque don, chaque heure de bénévolat est un investissement direct
              dans la **dignité** et l'**autonomie** des communautés vulnérables
              au Maroc. Votre action crée un impact **durable**.
            </p>
            <Link
              href="/contact"
              className="px-10 py-4 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 inline-block"
              // FIX: Replaced bg-accent text-white with inline styles
              style={{ backgroundColor: ACCENT, color: "white" }}
            >
              Soutenir la Fondation
            </Link>
          </Container>
        </ErrorBoundary>
      </section>

      {/* Floating Share Button */}
      {console.log('[DEBUG] Rendering FloatingShareButton')}
      <FloatingShareButton
        title="Fondation Assalam - Pour un avenir meilleur"
        description="Fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc depuis plus de 30 ans."
        slug="/"
      />

      {/* Client-side DOM manipulation handler */}
      <ScrollRevealHandler />
    </div>
  );
}