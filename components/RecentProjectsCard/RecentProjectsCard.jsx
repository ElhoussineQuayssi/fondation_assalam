import React from 'react';
import Link from 'next/link';
import { FolderOpen, Users } from 'lucide-react';

// Placeholder for the custom scroll animation component
const ScrollReveal = ({ children, delay }) => {
    const style = { animationDelay: `${delay}s` };
    return <div className="scroll-reveal" style={style}>{children}</div>;
};

/**
 * Renders a card displaying a list of recent projects, utilizing the 'Content Card'
 * and 'Card Components' patterns from the Design System.
 *
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.recentProjects - Array of project objects.
 * @returns {JSX.Element} Transformed Recent Projects Card component.
 */
const RecentProjectsCard = ({ recentProjects }) => {
    // Design Decision: Implementing Content Card pattern (p-8, rounded-xl, shadow-lg, border-top-accent)
    const cardHoverEffect = "transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1";

    return (
        <ScrollReveal delay={0.1}>
            {/* Main Content Card Container */}
            <div
                className={`
                    bg-white p-5 rounded-lg shadow-lg h-full
                    border-t-4
                    ${cardHoverEffect}
                `}
                style={{ borderTopColor: "#6495ED" }}
                aria-labelledby="recent-projects-title"
            >
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                    <div className="flex-1">
                        {/* Title: H2 Section Title adaptation (enhanced font-size for card context) */}
                        <h2
                            id="recent-projects-title"
                            className="text-lg font-bold text-gray-900 mb-1"
                        >
                            Projets récents
                        </h2>
                        {/* Supportive text: Body text scale (text-sm) */}
                        <p className="text-xs text-gray-600 mt-1">
                            Derniers projets ajoutés
                        </p>
                    </div>

                    {/* View All Link: Secondary CTA Style (Outline Button adaptation) */}
                    <Link
                        href="/admin/projects"
                        className={`
                            bg-[#6495ED] text-white font-semibold py-1.5 px-3 rounded-md text-sm shadow-md
                            hover:bg-[#5a87d4] transition duration-300
                            transform hover:scale-[1.02]
                        `}
                        aria-label="Voir tous les projets"
                    >
                        Voir tous
                    </Link>
                </div>

                {/* List Container with Scrolling Area */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {recentProjects && recentProjects.length > 0 ? (
                        recentProjects.slice(0, 4).map((project, index) => (
                            <ScrollReveal key={project.id} delay={index * 0.15}>
                                {/* List Item: Content Card pattern applied to list item */}
                                <div
                                    className={`
                                        bg-white p-3 rounded-lg shadow-md border border-gray-100
                                        ${cardHoverEffect}
                                    `}
                                    role="listitem"
                                >
                                    <div className="flex items-center">
                                        {/* Icon Container: Primary Color for background, Accent Color for icon */}
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: "#B0E0E6" }}
                                            aria-hidden="true"
                                        >
                                            <FolderOpen className="h-5 w-5" style={{ color: "#6495ED" }} />
                                        </div>

                                        <div className="ml-3 flex-1 min-w-0">
                                            {/* Project Title: H3/Card Title adaptation */}
                                            <h3 className="font-medium text-xs text-gray-900 mb-1 truncate">
                                                {project.title || "Titre non disponible"}
                                            </h3>

                                            <div className="flex justify-between items-center text-xs">
                                                {/* Date: Body text style (text-sm/xs) */}
                                                <p className="text-gray-500 truncate text-xs">
                                                    {project.date || "Date non disponible"}
                                                </p>

                                                {/* People Helped Pill: Subtle Accent/Background */}
                                                {project.peopleHelped && (
                                                    <div
                                                        className="flex items-center text-gray-600 px-1.5 py-0.5 rounded-full text-xs"
                                                        style={{ backgroundColor: "rgba(176, 224, 230, 0.5)" }}
                                                    >
                                                        <Users className="h-3 w-3 mr-1" />
                                                        {project.peopleHelped}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500 font-medium text-xs">
                            Aucun projet récent
                        </div>
                    )}
                </div>
            </div>
        </ScrollReveal>
    );
};

export default RecentProjectsCard;
