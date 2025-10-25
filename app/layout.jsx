import "./globals.css";
import ClientWrapper from "./ClientWrapper";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import Script from "next/script";

export const metadata = {
  title: {
    default: "Fondation Assalam - Pour un avenir meilleur",
    template: "%s | Fondation Assalam",
  },
  description: "Fondation Assalam pour le Développement Social - Amélioration des conditions de vie, éducation et développement durable au Maroc depuis plus de 30 ans.",
  keywords: "solidarité, éducation, autonomisation, Maroc, ONG, développement social, femmes, enfants",
  authors: [{ name: "Fondation Assalam" }],
  creator: "Fondation Assalam",
  publisher: "Fondation Assalam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://assalam.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://assalam.org',
    title: 'Fondation Assalam - Pour un avenir meilleur',
    description: 'Fondation marocaine dédiée à l\'amélioration des conditions de vie, à l\'éducation et au développement durable au Maroc.',
    siteName: 'Fondation Assalam',
    images: [
      {
        url: 'https://assalam.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fondation Assalam - Pour un avenir meilleur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fondation Assalam - Pour un avenir meilleur',
    description: 'Fondation marocaine dédiée à l\'amélioration des conditions de vie, à l\'éducation et au développement durable au Maroc.',
    creator: '@FondationAssalam',
    images: ['https://assalam.org/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  other: {
    'contact': 'bn.assalam@gmail.com',
    'telephone': '+212-5377-02346',
    'address': '22 Bd Hassan II, Immeuble 83, 2\ème étage, Rabat, Maroc',
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    // FIX: Set language to French for semantic correctness
    <html lang="fr">
      <head>
        {/* Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
