/**
 * SEO Head Component
 * Renders structured data and SEO metadata for each page
 */

"use client";

import { usePathname } from 'next/navigation';
import Head from 'next/head';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema
} from '@/lib/seo';

export default function SEOHead({ title, description, image, type = 'website', breadcrumbs = [] }) {
  const pathname = usePathname();
  const baseUrl = 'https://assalam.org';
  const fullUrl = `${baseUrl}${pathname}`;

  // Generate structured data based on page type
  const structuredData = [];

  // Always include organization and website schema
  structuredData.push(generateOrganizationSchema());
  structuredData.push(generateWebsiteSchema());

  // Add breadcrumbs if provided
  if (breadcrumbs.length > 0) {
    structuredData.push(generateBreadcrumbSchema([
      { name: 'Accueil', url: baseUrl },
      ...breadcrumbs
    ]));
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="solidarité, éducation, autonomisation, Maroc, ONG, développement social, femmes, enfants" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || `${baseUrl}/og-image.jpg`} />
      <meta property="og:site_name" content="Fondation Assalam" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || `${baseUrl}/twitter-image.jpg`} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Fondation Assalam" />
      <meta name="publisher" content="Fondation Assalam" />
      <meta name="language" content="French" />
      <meta name="geo.region" content="MA" />
      <meta name="geo.country" content="Morocco" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}
