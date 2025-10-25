import React from "react";
import Link from "next/link";
import { Users, MapPin, FileText } from "lucide-react";
import { SocialShareButtons } from "@/components/ShareButton/ShareButton";

/**
 * Replacement for ProjectSidebar, using the ContentCard sticky pattern.
 * FIX: Replaced text-gray-700 and border-gray-100 with constants.
 */
const ProjectSidebar = ({ projectTitle, targetAudience, facilities, slug, description }) => (
  <aside className="md:col-span-1">
    <div
      className="sticky top-12 bg-white rounded-2xl p-8 shadow-xl border-t-8 scroll-reveal"
      style={{ borderColor: "#6495ED" }}
    >
      <h3 className="text-2xl font-bold mb-4 text-text-dark">
        Participer à la Réussite de {projectTitle}
      </h3>
      {/* FIX: Replaced text-gray-700 with MUTED_TEXT */}
      <p className="mb-6 text-text-muted">
        Votre soutien est la clé qui assure la pérennité et l'élargissement de
        cette œuvre de bienfaisance.
      </p>

      {/* CTA Buttons - Color logic handled by Button component */}
      <Link
        href="/contact?type=donation"
        className="flex items-center justify-center text-white rounded-full px-8 py-4 text-lg font-bold shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-50 mb-4 w-full bg-accent shadow-accent/50"
      >
        Faire un Don de Solidarité
      </Link>
      <Link
        href="/contact?type=volunteer"
        className="flex items-center justify-center border-2 rounded-lg px-6 py-3 font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 w-full bg-transparent text-accent border-accent"
      >
        Offrir Mon Temps (Bénévole)
      </Link>

      {/* Social Sharing Section */}
      {slug && (
        <div className="mt-8 pt-6 border-t border-primary-light">
          <h4 className="font-semibold text-lg mb-4 text-accent">
            Partager ce Projet d'Espoir
          </h4>
          <SocialShareButtons
            title={`${projectTitle} - Fondation Assalam`}
            description={description || `Découvrez le projet ${projectTitle} de la Fondation Assalam qui transforme des vies au Maroc.`}
            slug={`/projects/${slug}`}
            variant="compact"
            platforms={["facebook", "twitter", "linkedin", "whatsapp"]}
            className="justify-center"
          />
        </div>
      )}

      {/* Additional Info Block */}
      {/* FIX: Replaced border-gray-100 with PRIMARY_LIGHT */}
      <div
        className="mt-8 pt-6 border-t border-primary-light space-y-4"
      >
        <h4 className="font-semibold text-lg text-accent">
          Les Piliers du Projet
        </h4>
        {targetAudience.length > 0 && (
          <div className="flex items-center gap-3 text-text-muted">
            <Users
              className="h-5 w-5 flex-shrink-0 text-accent"
            />
            <span>**Communautés Servies:** {targetAudience.join(", ")}</span>
          </div>
        )}
        {facilities.length > 0 && (
          <div className="flex items-center gap-3 text-text-muted">
            <MapPin
              className="h-5 w-5 flex-shrink-0 text-accent"
            />
            <span>**Réalisations Concrètes:** {facilities.join(", ")}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-text-muted">
          <FileText
            className="h-5 w-5 flex-shrink-0 text-accent"
          />
          <Link
            href="#documentation"
            className="hover:underline font-semibold transition-colors duration-200 text-accent"
          >
            Accéder au Rapport d'Avancement
          </Link>
        </div>
      </div>
    </div>
  </aside>
);

export default ProjectSidebar;
