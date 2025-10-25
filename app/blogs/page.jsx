import React from "react";
import Link from "next/link";
import Image from "next/image";
export const revalidate = 600; // Revalidate every 10 minutes

// Import getBlogs from lib/blogs.js
import { getBlogs } from "@/lib/blogs";
import { getRandomGalleryImages } from "@/lib/utils";
import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";
import UnifiedHero from "@/components/UnifiedHero";
import FeaturedPost from "@/components/FeaturedPost/FeaturedPost";
import ContentCard from "@/components/ContentCard/ContentCard";
import ContentGrid from "@/components/ContentGrid/ContentGrid";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import ShareButton from "@/components/ShareButton/ShareButton";
import Pagination from "@/components/Pagination/Pagination";
import { generateBreadcrumbSchema } from "@/lib/seo";

// Design System Configuration
const BACKGROUND = "#FAFAFA"; // Off-White background
const ACCENT = "#404040"; // Accent color

export const metadata = {
  title: "Actualités & Blog",
  description: "Restez informé de nos dernières activités, nouvelles et récits d'impact de la Fondation Assalam à travers le Maroc.",
  openGraph: {
    title: "Actualités & Blog - Fondation Assalam",
    description: "Restez informé de nos dernières activités, nouvelles et récits d'impact de la Fondation Assalam à travers le Maroc.",
    type: "website",
    url: "https://assalam.org/blogs",
  },
};

export default async function Blogs({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || null;
  const page = parseInt(params?.page || "1", 10);
  const blogsPerPage = 6;

  const result = await getBlogs();
  const images = await getRandomGalleryImages(4);
  const allBlogs = result.success ? result.data : [];

  // Filter to only published blogs
  const publishedBlogs = allBlogs.filter(blog => blog.status === 'published');

  // Filter blogs by category if a category is selected
  const filteredBlogs = category
    ? publishedBlogs.filter((blog) => blog.category === category)
    : publishedBlogs;

  // Paginate blogs
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    page * blogsPerPage,
  );

  const categories = [...new Set(publishedBlogs.map((blog) => blog.category))];

  // SEO Breadcrumbs
  const breadcrumbs = [
    { name: "Accueil", url: "https://assalam.org" },
    { name: "Actualités & Blog", url: "https://assalam.org/blogs" }
  ];

  return (
    <main style={{ backgroundColor: BACKGROUND }}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Actualités & Blog - Fondation Assalam",
            "description": "Restez informé de nos dernières activités, nouvelles et récits d'impact de la Fondation Assalam à travers le Maroc.",
            "url": "https://assalam.org/blogs",
            "breadcrumb": {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": breadcrumb.name,
                "item": breadcrumb.url
              }))
            }
          })
        }}
      />

      {/* Header Section */}
      <UnifiedHero
        title="Récits d'Impact et Actualités"
        subtitle="Explorez les histoires d'espoir, les actualités et les avancées de la Fondation Assalam à travers le Maroc."
        images={images}
      />

      {/* Featured Post */}
      {paginatedBlogs[0] && <FeaturedPost post={paginatedBlogs[0]} />}

      {/* Categories */}
      <CategoryFilter
        categories={categories}
        activeCategory={category}
        basePath="/blogs"
      />

      {/* All Posts */}
      <section>
        {paginatedBlogs.length > 1 && ( // Only show sub-grid if there are more than 1 post (to avoid featuring the same one twice)
          <ContentGrid
            // Use slice(1) to skip the featured post if it was the first one on the page
            items={paginatedBlogs.slice(1)}
            columns={{ default: 1, md: 2, lg: 3 }}
            renderItem={(blog) => (
              <ContentCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                image={blog.image}
                imageAlt={blog.title}
                link={`/blogs/${blog.slug}`}
                category={blog.category}
                date={blog.createdAt}
                index={blog.index}
              />
            )}
          />
        )}

        {paginatedBlogs.length === 0 && (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg mx-auto max-w-xl">
            <h3
              className="text-2xl font-semibold mb-2"
              style={{ color: ACCENT }}
            >
              Oups, rien ici.
            </h3>
            <p>
              Aucun récit ne correspond à cette catégorie pour le moment.
              Revenez bientôt !
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/blogs"
          activeCategory={category}
        />
      </section>
    </main>
  );
}
