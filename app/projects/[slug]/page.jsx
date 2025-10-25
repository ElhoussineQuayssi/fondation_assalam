import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Award,
  Play,
  FileText,
  Target,
  ChevronRight,
  Clock,
} from "lucide-react";
// Preservation of the original data fetching function
import { getProject } from "lib/projects";
import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import Alert from "@/components/Alert/Alert";
import UnifiedHero from "@/components/UnifiedHero";
import StyledProjectInfoCard from "@/components/StyledProjectInfoCard/StyledProjectInfoCard";
import ProjectContentSection from "@/components/ProjectContentSection/ProjectContentSection";
import ProjectGallery from "@/components/ProjectGallery/ProjectGallery";
import ProjectSidebar from "@/components/ProjectSidebar/ProjectSidebar";
import { FloatingShareButton } from "@/components/ShareButton/ShareButton";

// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White (used for UI background)
const MUTED_TEXT = "#767676"; // Dusty Gray (used for secondary/muted text)

// --- Original Logic Preservation ---

export async function generateMetadata({ params }) {
  const { slug } = await params;
  console.log('generateMetadata - slug from params:', { slug, type: typeof slug });

  // NOTE: getProject is assumed to be a server-side function
  const project = await getProject(slug);

  if (!project) {
    console.log('generateMetadata - no project found for slug:', slug);
    return {
      title: "Projet non trouvé", // Fixed Content
    };
  }

  return {
    title: `${project.title} | Fondation Assalam`,
    description: project.excerpt,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  console.log('ProjectPage - slug from params:', { slug, type: typeof slug });

  const project = await getProject(slug);

  if (!project) {
    console.log('ProjectPage - no project found for slug:', slug);
    notFound();
  }

  const projectInfo = [
    {
      type: "date",
      label: "Date de lancement",
      value: project.startDate || "N/A",
      icon: CalendarDays,
    }, // Enhanced & Fixed Content
    {
      type: "location",
      label: "Localisation",
      value: project.location || "N/A",
      icon: MapPin,
    }, // Fixed Content
    {
      type: "people",
      label: "Vies impactées",
      value: project.peopleHelped ? `${project.peopleHelped}+` : "N/A",
      icon: Users,
    }, // Enhanced & Fixed Content
    {
      type: "status",
      label: "Étape actuelle",
      value: project.status || "Actif",
      icon: Award,
    }, // Enhanced & Fixed Content
  ];

  return (
    // Main background fix
    <main className="min-h-screen" style={{ backgroundColor: BACKGROUND }}>
      {/* 1. Hero Section (Styled with constants) */}
      <UnifiedHero
        title={project.title}
        subtitle={project.excerpt}
        images={project.gallery}
      />

      <Container className="pb-20">
        {/* 2. Project Info Cards (Styled with constants) */}
        <section className="mb-16 -mt-20 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectInfo.map((item, index) => (
              <StyledProjectInfoCard
                key={item.type}
                label={item.label}
                value={item.value}
                icon={item.icon}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* 3. Main Content & Sidebar Grid */}
        <section className="grid md:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-12">
            {/* About Section - Text Blocks & Goals (Styled with Design System Typography & Colors) */}
            <ProjectContentSection
              title="Le Récit de notre Action"
              className="scroll-reveal"
            >
              {" "}
              {/* Enhanced & Fixed Content */}
              <div className={`text-lg space-y-8`} style={{ color: DARK_TEXT }}>
                {project.content
                  ?.filter((block) => block.type === "text")
                  .map((block, index) => {
                    if (block.content?.text || block.content?.heading) {
                      return (
                        <div key={index}>
                          {block.content.heading && (
                            // H3 Typography Pattern: Use inline style for accent color
                            <h3
                              className={`text-xl font-semibold mb-4`}
                              style={{ color: ACCENT }}
                            >
                              {block.content.heading}
                            </h3>
                          )}
                          {block.content.text && (
                            // FIX: Replaced text-gray-700 with MUTED_TEXT
                            <p
                              className="leading-relaxed"
                              style={{ color: MUTED_TEXT }}
                            >
                              {block.content.text}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
              {/* Goals Block - Subtle Background with Accent List Markers (Content Card Style) */}
              {project.goals && project.goals.length > 0 && (
                <div
                  className={`mt-8 p-6 rounded-xl border shadow-inner scroll-reveal`}
                  // FIX: Replaced border-gray-100 with PRIMARY_LIGHT
                  style={{
                    backgroundColor: `${PRIMARY_LIGHT}80`,
                    borderColor: PRIMARY_LIGHT,
                  }}
                >
                  {/* FIX: Replaced border-gray-100 with PRIMARY_LIGHT */}
                  <h3
                    className={`text-xl font-bold mb-4 border-b pb-2`}
                    style={{ color: ACCENT, borderColor: PRIMARY_LIGHT }}
                  >
                    <Target className="inline h-5 w-5 mr-2 -mt-1" />
                    L'Horizon de l'Espoir (Nos Objectifs){" "}
                    {/* Enhanced Content */}
                  </h3>
                  <ul className="space-y-3">
                    {project.goals.map((goal, index) => (
                      <li
                        key={index}
                        className="flex items-start"
                        style={{ color: MUTED_TEXT }}
                      >
                        {/* Accent Colored Marker */}
                        <div
                          className={`text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4 text-sm font-bold shadow-md`}
                          style={{ backgroundColor: ACCENT }}
                        >
                          {index + 1}
                        </div>
                        <p className="leading-relaxed">{goal}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ProjectContentSection>

            {/* Gallery Section */}
            {project.gallery && project.gallery.length > 0 && (
              <ProjectGallery
                images={project.gallery}
                projectTitle={project.title}
                className="mt-12"
              />
            )}

            {/* Additional Content Blocks (Refactored for Design System) */}
            {project.content?.map((block, index) => {
              switch (block.type) {
                case "text":
                  return (
                    <div key={index} className="mb-8 scroll-reveal">
                      {block.content?.heading && (
                        <h3
                          className={`text-xl font-semibold mb-4`}
                          style={{ color: ACCENT }}
                        >
                          {block.content.heading}
                        </h3>
                      )}
                      {block.content?.text && (
                        // FIX: Replaced text-gray-700 with MUTED_TEXT
                        <p
                          className="mb-4 leading-relaxed"
                          style={{ color: MUTED_TEXT }}
                        >
                          {block.content.text}
                        </p>
                      )}
                    </div>
                  );

                case "image":
                  return block.content?.src ? (
                    <div key={index} className="mb-8 scroll-reveal relative">
                      <Image
                        src={block.content.src}
                        alt={block.content.alt || ""}
                        fill
                        // FIX: Replaced border-gray-100 with PRIMARY_LIGHT
                        className="object-cover rounded-xl shadow-lg border"
                        style={{ borderColor: PRIMARY_LIGHT }}
                      />
                      {block.content.caption && (
                        // FIX: Replaced text-gray-600 with MUTED_TEXT
                        <p
                          className="text-sm mt-3 italic text-center"
                          style={{ color: MUTED_TEXT }}
                        >
                          {block.content.caption}
                        </p>
                      )}
                    </div>
                  ) : null;

                case "list":
                  return block.content?.title ||
                    (block.content?.items && block.content.items.length > 0) ? (
                    <ProjectContentSection
                      key={index}
                      title={block.content.title || "Liste des actions"}
                      className="scroll-reveal"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        {block.content.items?.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            // FIX: Replaced border-gray-100 with ACCENT inline style
                            className={`flex items-start card-lift p-4 bg-white rounded-lg shadow-sm border-l-4 transition-all duration-300 hover:border-l-4`}
                            style={{ borderColor: ACCENT }}
                          >
                            <div
                              className={`rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3`}
                              style={{ color: ACCENT }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </div>
                            {/* FIX: Replaced text-gray-700 with MUTED_TEXT */}
                            <p style={{ color: MUTED_TEXT }}>{item}</p>
                          </div>
                        ))}
                      </div>
                    </ProjectContentSection>
                  ) : null;

                case "quote":
                  return block.content?.text ? (
                    <div
                      key={index}
                      className={`border-l-4 p-6 rounded-r-xl shadow-md mb-8 scroll-reveal`}
                      style={{
                        backgroundColor: `${PRIMARY_LIGHT}80`,
                        borderColor: ACCENT,
                      }}
                    >
                      <blockquote
                        className={`text-xl italic mb-3`}
                        style={{ color: DARK_TEXT }}
                      >
                        &ldquo;{block.content.text}&rdquo;
                      </blockquote>
                      {block.content.author && (
                        // FIX: Replaced text-gray-600 with MUTED_TEXT
                        <cite
                          className="text-sm font-semibold"
                          style={{ color: MUTED_TEXT }}
                        >
                          \u2014 {block.content.author}
                        </cite>
                      )}
                    </div>
                  ) : null;

                case "video":
                  return block.content?.videoUrl ? (
                    <div
                      key={index}
                      className="mb-8 card-lift bg-white rounded-xl shadow-lg p-6 scroll-reveal"
                    >
                      <h3
                        className={`text-xl font-semibold mb-4 flex items-center gap-2`}
                        style={{ color: ACCENT }}
                      >
                        <Play className="h-6 w-6" />
                        {block.content.title ||
                          "Témoignage Vidéo de l'Action"}{" "}
                        {/* Enhanced & Fixed Content */}
                      </h3>
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        <iframe
                          src={block.content.videoUrl}
                          title={block.content.title || "Vidéo"} // Fixed Content
                          className="w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {block.content.description && (
                        // FIX: Replaced text-gray-700 with MUTED_TEXT
                        <p style={{ color: MUTED_TEXT }}>
                          {block.content.description}
                        </p>
                      )}
                    </div>
                  ) : null;

                case "testimonial":
                  return block.content?.content ? (
                    <div
                      key={index}
                      className={`border rounded-xl p-6 mb-8 scroll-reveal`}
                      style={{
                        backgroundColor: `${PRIMARY_LIGHT}80`,
                        borderColor: `${ACCENT}4D`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {block.content.image && (
                          <Image
                            src={block.content.image}
                            alt={block.content.name || "Témoignage"} // Fixed Content
                            width={56}
                            height={56}
                            className="object-cover rounded-full flex-shrink-0 shadow-md border-2 border-white"
                          />
                        )}
                        <div className="flex-1">
                          <blockquote
                            className={`italic mb-2 leading-relaxed`}
                            style={{ color: DARK_TEXT }}
                          >
                            "{block.content.content}"
                          </blockquote>
                          <cite
                            className={`text-sm font-semibold`}
                            style={{ color: ACCENT }}
                          >
                            \u2014 {block.content.name}
                            {block.content.role && `, ${block.content.role}`}
                          </cite>
                        </div>
                      </div>
                    </div>
                  ) : null;

                case "stats":
                  return block.content?.title ||
                    (block.content?.stats && block.content.stats.length > 0) ? (
                    <ProjectContentSection
                      key={index}
                      title={block.content.title || "Chiffres Clés de l'Impact"}
                      className="scroll-reveal"
                    >
                      {" "}
                      {/* Enhanced & Fixed Content */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {block.content.stats?.map((stat, statIndex) => (
                          <div
                            key={statIndex}
                            className={`bg-white p-4 rounded-xl shadow-md border-t-4 border-opacity-70 text-center card-lift transition-all duration-300`}
                            style={{ borderColor: `${ACCENT}B3` }}
                          >
                            <div
                              className={`text-3xl font-extrabold mb-1`}
                              style={{ color: ACCENT }}
                            >
                              {stat.value}
                            </div>
                            {/* FIX: Replaced text-gray-600 with MUTED_TEXT */}
                            <div
                              className="text-sm font-medium"
                              style={{ color: MUTED_TEXT }}
                            >
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ProjectContentSection>
                  ) : null;

                case "timeline":
                  return block.content?.title ||
                    (block.content?.events &&
                      block.content.events.length > 0) ? (
                    <ProjectContentSection
                      key={index}
                      title={
                        block.content.title || "Notre Parcours (Chronologie)"
                      }
                      className="scroll-reveal"
                    >
                      {" "}
                      {/* Enhanced & Fixed Content */}
                      {/* FIX: Replaced border-gray-200 with PRIMARY_LIGHT */}
                      <ol
                        className={`relative border-l ml-4`}
                        style={{ borderColor: PRIMARY_LIGHT }}
                      >
                        {block.content.events?.map((event, eventIndex) => (
                          <li
                            key={eventIndex}
                            className="mb-10 ml-6 scroll-reveal"
                            style={{ animationDelay: `${eventIndex * 0.15}s` }}
                          >
                            <span
                              // FIX: Replaced ring-8 ring-[${BACKGROUND}] with custom box-shadow to simulate ring
                              className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 text-white shadow-lg`}
                              style={{
                                backgroundColor: ACCENT,
                                // Simulate ring-8 ring-BACKGROUND
                                boxShadow: `0 0 0 8px ${BACKGROUND}, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
                              }}
                            >
                              <Clock className="w-4 h-4" />
                            </span>
                            <h4
                              className={`font-bold text-lg mb-1`}
                              style={{ color: DARK_TEXT }}
                            >
                              {event.title}
                            </h4>
                            <time
                              className={`block mb-2 text-sm font-normal leading-none`}
                              style={{ color: ACCENT }}
                            >
                              {event.year}
                            </time>
                            {/* FIX: Replaced text-gray-700 with MUTED_TEXT */}
                            <p
                              className="text-base font-normal"
                              style={{ color: MUTED_TEXT }}
                            >
                              {event.description}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </ProjectContentSection>
                  ) : null;

                case "faq":
                  return block.content?.title ||
                    (block.content?.questions &&
                      block.content.questions.length > 0) ? (
                    <ProjectContentSection
                      key={index}
                      title={block.content.title || "Vos Interrogations (FAQ)"}
                      className="scroll-reveal"
                    >
                      {" "}
                      {/* Enhanced & Fixed Content */}
                      <div className="space-y-4">
                        {block.content.questions?.map(
                          (question, questionIndex) => (
                            <div
                              key={questionIndex}
                              className={`card-lift bg-white border-l-4 rounded-xl p-4 shadow-md transition-all duration-300 hover:shadow-lg`}
                              style={{ borderColor: `${ACCENT}80` }}
                            >
                              {/* FIX: Replaced text-gray-900 with DARK_TEXT */}
                              <h4
                                className={`font-semibold mb-2 text-lg`}
                                style={{ color: DARK_TEXT }}
                              >
                                {question.question}
                              </h4>
                              {/* FIX: Replaced text-gray-700 with MUTED_TEXT */}
                              <p style={{ color: MUTED_TEXT }}>
                                {question.answer}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </ProjectContentSection>
                  ) : null;

                case "cta":
                  return block.content?.title || block.content?.description ? (
                    <div
                      key={index}
                      className={`border rounded-2xl p-8 mb-8 text-center shadow-xl scroll-reveal`}
                      style={{
                        backgroundColor: `${PRIMARY_LIGHT}B3`,
                        borderColor: `${ACCENT}4D`,
                      }}
                    >
                      <h3
                        className={`text-3xl font-bold mb-3`}
                        style={{ color: DARK_TEXT }}
                      >
                        {block.content.title}
                      </h3>
                      {/* FIX: Replaced text-gray-700 with MUTED_TEXT */}
                      <p className="text-lg mb-6" style={{ color: MUTED_TEXT }}>
                        {block.content.description}
                      </p>
                      {block.content.buttonText && block.content.buttonUrl && (
                        <Button
                          href={block.content.buttonUrl}
                          variant="primary"
                          className="inline-flex"
                        >
                          {block.content.buttonText}
                        </Button>
                      )}
                    </div>
                  ) : null;

                case "file":
                  return block.content?.title || block.content?.fileUrl ? (
                    <div
                      key={index}
                      // FIX: Replaced border-gray-200 with PRIMARY_LIGHT
                      className={`border rounded-xl p-6 mb-8 card-lift scroll-reveal`}
                      style={{
                        backgroundColor: `${PRIMARY_LIGHT}80`,
                        borderColor: PRIMARY_LIGHT,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4
                            className={`font-bold text-lg mb-1`}
                            style={{ color: DARK_TEXT }}
                          >
                            {block.content.title}
                          </h4>
                          {block.content.description && (
                            // FIX: Replaced text-gray-700 with MUTED_TEXT
                            <p
                              className="mb-3 text-sm"
                              style={{ color: MUTED_TEXT }}
                            >
                              {block.content.description}
                            </p>
                          )}
                        </div>
                        {block.content.fileUrl && (
                          <a
                            href={block.content.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-semibold text-sm flex-shrink-0 shadow-md`}
                            style={{ backgroundColor: ACCENT }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Télécharger le Document{" "}
                            {/* Enhanced & Fixed Content */}
                          </a>
                        )}
                      </div>
                    </div>
                  ) : null;

                case "map":
                  return block.content?.title || block.content?.address ? (
                    <ProjectContentSection
                      key={index}
                      title={
                        block.content.title || "Localisation sur le Terrain"
                      }
                      className="scroll-reveal"
                    >
                      {" "}
                      {/* Enhanced Content */}
                      <div
                        className="bg-white rounded-xl shadow-lg p-4"
                        style={{ borderBottom: `4px solid ${ACCENT}` }}
                      >
                        {block.content.embedUrl ? (
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                            <iframe
                              src={block.content.embedUrl}
                              title={block.content.title || "Localisation"}
                              className="w-full h-full"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          // FIX: Replaced text-gray-500 with MUTED_TEXT
                          <div
                            className="text-center py-8"
                            style={{ color: MUTED_TEXT }}
                          >
                            <MapPin
                              className={`h-12 w-12 mx-auto mb-4`}
                              style={{ color: `${ACCENT}B3` }}
                            />
                            <p>{block.content.address}</p>
                          </div>
                        )}
                      </div>
                    </ProjectContentSection>
                  ) : null;

                case "award":
                  return block.content?.title || block.content?.description ? (
                    <div
                      key={index}
                      className={`bg-white border-l-8 rounded-xl p-6 mb-8 card-lift shadow-lg scroll-reveal`}
                      style={{ borderColor: ACCENT }}
                    >
                      <div className="flex items-start gap-4">
                        {block.content.image && (
                          <Image
                            src={block.content.image}
                            alt={block.content.title || "Reconnaissance"} // Fixed Content
                            width={64}
                            height={64}
                            className="object-cover rounded-lg flex-shrink-0 shadow-md"
                          />
                        )}
                        <div className="flex-1">
                          <h3
                            className={`text-xl font-bold mb-2 flex items-center gap-2`}
                            style={{ color: ACCENT }}
                          >
                            <Award className="h-5 w-5" />
                            {block.content.title ||
                              "Reconnaissance et Distinction"}{" "}
                            {/* Enhanced & Fixed Content */}
                          </h3>
                          {/* FIX: Replaced text-gray-700 with MUTED_TEXT */}
                          <p className="mb-2" style={{ color: MUTED_TEXT }}>
                            {block.content.description}
                          </p>
                          {/* FIX: Replaced text-gray-600 with MUTED_TEXT and border-gray-100 with PRIMARY_LIGHT */}
                          <div
                            className="flex gap-4 text-sm pt-2 border-t"
                            style={{
                              color: MUTED_TEXT,
                              borderColor: PRIMARY_LIGHT,
                            }}
                          >
                            {block.content.issuer && (
                              <span>
                                <strong>Organisme Émetteur:</strong>{" "}
                                {block.content.issuer}
                              </span>
                            )}{" "}
                            {/* Enhanced & Fixed Content */}
                            {block.content.year && (
                              <span>
                                <strong>Année:</strong> {block.content.year}
                              </span>
                            )}{" "}
                            {/* Fixed Content */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;

                default:
                  return null;
              }
            })}
          </div>

          {/* Sidebar */}
          <ProjectSidebar
            projectTitle={project.title}
            targetAudience={
              project.content
                ?.filter((b) => b.type === "programme")
                ?.map((b) => b.content?.duration) || ["Communautés rurales"]
            } // Fixed Content
            facilities={
              project.content
                ?.filter((b) => b.type === "map")
                ?.map((b) => b.content?.address) || [
                "École construite",
                "Centre de santé",
              ]
            } // Fixed Content
            slug={slug}
            description={project.excerpt}
          />
        </section>

        {/* Floating Share Button */}
        <FloatingShareButton
          title={`${project.title} - Fondation Assalam`}
          description={project.excerpt}
          slug={`/projects/${slug}`}
        />
      </Container>
    </main>
  );
}
