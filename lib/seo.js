/**
 * SEO Utilities for Structured Data
 * Provides JSON-LD structured data for better SEO
 */

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Fondation Assalam pour le Développement Social",
  "alternateName": "Fondation Assalam",
  "url": "https://assalam.org",
  "logo": "https://assalam.org/logo.png",
  "description": "Fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc depuis plus de 30 ans.",
  "foundingDate": "1992",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 Bd Hassan II, Immeuble 83, 2ème étage",
    "addressLocality": "Rabat",
    "addressCountry": "MA",
    "postalCode": "10000"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+212-5377-02346",
    "email": "bn.assalam@gmail.com",
    "contactType": "customer service",
    "availableLanguage": ["French", "Arabic"]
  },
  "sameAs": [
    "https://www.facebook.com/assalam.anfa",
    "https://www.instagram.com/fondationassalam",
    "https://twitter.com/fondationassalam"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Morocco"
  },
  "knowsAbout": [
    "Social Development",
    "Education",
    "Women's Empowerment",
    "Child Protection",
    "Sustainable Development",
    "Social Solidarity",
    "Moroccan Culture"
  ],
  "mission": "Contribuer au bien-être et à la dignité des personnes vivant dans des conditions précaires à travers l'autonomisation sociale, éducative et économique.",
  "founder": {
    "@type": "Person",
    "name": "Fondateurs de la Fondation Assalam"
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Fondation Assalam",
  "alternateName": "Assalam Foundation",
  "url": "https://assalam.org",
  "description": "Site web officiel de la Fondation Assalam pour le Développement Social au Maroc",
  "publisher": {
    "@type": "NGO",
    "name": "Fondation Assalam pour le Développement Social"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://assalam.org/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "fr-FR"
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const generateProjectSchema = (project) => ({
  "@context": "https://schema.org",
  "@type": "Project",
  "name": project.title,
  "description": project.excerpt,
  "url": `https://assalam.org/projects/${project.slug}`,
  "image": project.image,
  "startDate": project.start_date,
  "location": {
    "@type": "Place",
    "name": project.location,
    "addressCountry": "MA"
  },
  "funder": {
    "@type": "NGO",
    "name": "Fondation Assalam pour le Développement Social"
  },
  "about": project.categories.map(category => ({
    "@type": "Thing",
    "name": category
  }))
});

export const generateBlogPostSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.image,
  "datePublished": post.createdAt,
  "dateModified": post.updatedAt,
  "author": {
    "@type": "Organization",
    "name": "Fondation Assalam"
  },
  "publisher": {
    "@type": "NGO",
    "name": "Fondation Assalam pour le Développement Social",
    "logo": {
      "@type": "ImageObject",
      "url": "https://assalam.org/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://assalam.org/blogs/${post.slug}`
  },
  "keywords": post.category,
  "articleSection": "Social Development"
});
