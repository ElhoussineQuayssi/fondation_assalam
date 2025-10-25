import "../globals.css";

export const metadata = {
  title: "Nos Projets",
  description: "Découvrez nos projets principaux qui transforment des vies à travers le Maroc : éducation, autonomisation des femmes, protection des enfants.",
  openGraph: {
    title: "Nos Projets - Fondation Assalam",
    description: "Découvrez nos projets principaux qui transforment des vies à travers le Maroc : éducation, autonomisation des femmes, protection des enfants.",
    type: "website",
    url: "https://assalam.org/projects",
  },
};

export default function ProjectsLayout({ children }) {
  return <>{children}</>;
}
