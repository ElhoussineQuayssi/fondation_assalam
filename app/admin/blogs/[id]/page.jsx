import { getBlogById } from "lib/actions";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Tag,
  AlertTriangle,
  Edit,
  Trash2,
} from "lucide-react";

// Import extracted components
import AdminPageHeader from "@/components/AdminPageHeader/AdminPageHeader.jsx";
import Button from "@/components/Button/Button.jsx";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

// Calcul des couleurs transparentes pour les fonds subtils
const PRIMARY_LIGHT_TRANS = `${PRIMARY_LIGHT}4D`; // PRIMARY_LIGHT with ~30% opacity
const RED_600 = "#DC2626"; // Equivalent Tailwind red-600
const RED_50 = "#FEF2F2"; // Equivalent Tailwind red-50

export default async function BlogPost({ params }) {
  const { id } = await params;
  const result = await getBlogById(id);

  if (!result.success) {
    // Error State Transformed using inline styles
    return (
      <div
        className="min-h-screen p-10 flex justify-center items-center"
        style={{ backgroundColor: BACKGROUND }}
      >
        <div
          className="border-l-4 border-red-500 text-red-800 p-6 rounded-xl shadow-md flex items-center gap-3"
          style={{ backgroundColor: RED_50 }}
        >
          <AlertTriangle className="h-6 w-6 flex-shrink-0" />
          <p className="text-lg font-medium">
            Erreur: {result.message || "Article introuvable."}
          </p>
        </div>
      </div>
    );
  }

  const blog = result.data;

  // --- Transformed JSX (Minimalist Light Blue Design) ---
  return (
    // Main canvas background
    <main
      className="min-h-screen py-10 px-4 md:px-8"
      style={{ backgroundColor: BACKGROUND }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-10">
          <AdminPageHeader
            title="Détails de l'Article"
            subtitle="Visualisez et gérez cet article de blog"
          />
          <div className="mt-6 scroll-reveal">
            {/* Outline Button Pattern (uses refactored Button) */}
            <Button
              href="/admin/blogs"
              variant="outlineLight"
              className="inline-flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour à la liste des articles
            </Button>
          </div>
        </div>

        {/* Article Content - Content Card Pattern */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden scroll-reveal">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-100">
            {/* Title - H2 Typography style used for article title */}
            <h1
              className="text-4xl font-bold mb-5 leading-snug"
              style={{ color: DARK_TEXT }}
            >
              {blog.title}
            </h1>

            {/* Metadata (Date and Category) */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" style={{ color: ACCENT }} />
                <span className="text-base">
                  Publié le{" "}
                  {new Date(blog.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {blog.category && (
                <div className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" style={{ color: ACCENT }} />
                  {/* Category Badge - Uses PRIMARY_LIGHT_TRANS for subtle background */}
                  <span
                    className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: PRIMARY_LIGHT_TRANS,
                      color: ACCENT,
                    }}
                  >
                    {blog.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Article Image */}
          {blog.image && (
            <div className="relative h-96 w-full bg-gray-100">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
            <div
              // Use Tailwind Prose plugin's CSS variables to apply Design System colors
              className="prose prose-lg max-w-none prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700"
              style={{
                "--tw-prose-headings": DARK_TEXT,
                "--tw-prose-links": ACCENT,
                "--tw-prose-bold": DARK_TEXT,
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        {/* Excerpt - Subtle Information Card Pattern */}
        {blog.excerpt && (
          <div
            className="mt-8 border rounded-xl p-6 shadow-md scroll-reveal"
            style={{
              backgroundColor: PRIMARY_LIGHT_TRANS,
              borderColor: PRIMARY_LIGHT,
            }}
          >
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: DARK_TEXT }}
            >
              Résumé (Extrait)
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {blog.excerpt}
            </p>
          </div>
        )}

        {/* Action Buttons - Primary and Danger Button Patterns */}
        <div className="mt-10 flex flex-wrap gap-4 scroll-reveal">
          <Link href={`/admin/blogs/${id}/edit`} passHref legacyBehavior>
            <Button variant="primary" className="inline-flex items-center">
              <Edit className="w-5 mr-2" />
              Modifier l'article
            </Button>
          </Link>
          {/* Note: In a real app, this should be a client-side button with an onClick handler for confirmation/deletion */}
          <Button variant="danger" className="inline-flex items-center">
            <Trash2 className="w-5 mr-2" />
            Supprimer l'article
          </Button>
        </div>
      </div>
    </main>
  );
}
