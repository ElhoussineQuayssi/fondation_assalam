import "../globals.css";

export const metadata = {
  title: "À Propos de Nous",
  description: "Découvrez l'histoire, la mission et les valeurs de la Fondation Assalam, créée en 1992 pour améliorer les conditions de vie des Marocains.",
  openGraph: {
    title: "À Propos de la Fondation Assalam",
    description: "Découvrez l'histoire, la mission et les valeurs de la Fondation Assalam, créée en 1992 pour améliorer les conditions de vie des Marocains.",
    type: "website",
    url: "https://assalam.org/about",
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
