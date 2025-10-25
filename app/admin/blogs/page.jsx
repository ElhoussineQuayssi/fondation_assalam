"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus, Eye, Loader2 } from "lucide-react";
import { getBlogs, deleteBlog } from "lib/actions";

// Import extracted components
import AdminPageHeader from "@/components/AdminPageHeader/AdminPageHeader.jsx";
import Button from "@/components/Button/Button.jsx";
import AdminActionButtons from "@/components/AdminActionButtons/AdminActionButtons.jsx";
import AdminTable from "@/components/AdminTable/AdminTable.jsx";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White
const PRIMARY_LIGHT_TRANS = "#B0E0E680"; // PRIMARY_LIGHT with ~50% opacity for table header
const ACCENT_TRANS = "#6495ED1A"; // ACCENT with ~10% opacity for badge background
const RED_600 = "#DC2626"; // Equivalent Tailwind red-600
const RED_800 = "#991B1B"; // Equivalent Tailwind red-800
const BLUE_700 = "#1D4ED8"; // Equivalent Tailwind blue-700

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState({}); // Track loading state for each action
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const result = await getBlogs();
        if (result.success) {
          setBlogs(result.data);
          setFilteredBlogs(result.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Filter and search blogs
  useEffect(() => {
    let filtered = blogs;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [blogs, statusFilter, searchTerm]);

  const handleDelete = async (blogId) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.",
      )
    ) {
      // Set loading state for this specific delete action
      setLoadingActions(prev => ({ ...prev, [`delete-${blogId}`]: true }));

      try {
        const result = await deleteBlog(blogId);
        if (result.success) {
          // Refresh the list after successful deletion
          setBlogs((currentBlogs) =>
            currentBlogs.filter((blog) => blog.id !== blogId),
          );
        } else {
          console.error("Error deleting blog:", result.message);
          alert("Erreur lors de la suppression: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Une erreur s'est produite lors de la suppression.");
      } finally {
        // Remove loading state for this specific delete action
        setLoadingActions(prev => ({ ...prev, [`delete-${blogId}`]: false }));
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage);

  const columns = [
    { key: "title", label: "Titre" },
    {
      key: "category",
      label: "Catégorie",
      render: (value) => (
        // Category Badge - Subtle Accent Styling
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: ACCENT_TRANS, color: ACCENT }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            value === "published"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value === "published" ? "Publié" : "Brouillon"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString("fr-FR"),
    },
    {
      key: "views",
      label: "Vues",
      render: (value) => (
        <span className="font-medium text-gray-700">{value || 0}</span>
      ),
    },
  ];

  const actionButtons = [
    {
      key: "view",
      icon: Eye,
      href: (item) => `/admin/blogs/${item.id}`,
      // hover effect handled by AdminActionButtons utility
      className: `text-gray-600`,
      title: "Voir l'article",
    },
    {
      key: "edit",
      icon: Edit,
      href: (item) => `/admin/blogs/${item.id}/edit`,
      // hover effect handled by AdminActionButtons utility
      className: ``,
      title: "Modifier l'article",
    },
    {
      key: "delete",
      icon: Trash2,
      onClick: handleDelete,
      // hover effect handled by AdminActionButtons utility
      className: "",
      title: "Supprimer l'article",
    },
  ];

  return (
    // Main canvas background
    <main
      className="min-h-screen py-10 px-4 md:px-8"
      style={{ backgroundColor: BACKGROUND }}
    >
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Gestion des Articles"
          subtitle="Gérez vos articles et publications"
          actionButton={
            <Button
              href="/admin/blogs/new"
              className="inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvel Article
            </Button>
          }
        />

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par titre ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>

        {/* AdminTable container with scroll-reveal for animation */}
        <div className="scroll-reveal">
          <AdminTable
            columns={columns}
            data={paginatedBlogs}
            renderActions={(item) => (
              <AdminActionButtons
                item={item}
                actions={actionButtons}
                loadingActions={loadingActions}
              />
            )}
            loading={loading}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Results summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} trouvé{filteredBlogs.length !== 1 ? 's' : ''}
          {statusFilter !== "all" && ` (filtré par statut: ${statusFilter === "published" ? "Publié" : "Brouillon"})`}
          {searchTerm && ` (recherche: "${searchTerm}")`}
        </div>
      </div>
    </main>
  );
}
