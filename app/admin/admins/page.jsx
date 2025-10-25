"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Required for Link component used in refactored Button
import { getAdmins, deleteAdmin } from "lib/actions";
import {
  Users,
  AlertTriangle,
  Edit,
  Trash2,
  Search,
  Loader2,
  CheckCircle,
} from "lucide-react";
// Components are now self-contained, so these imports are removed:
// import { AdminPageHeader, AdminTable, AdminActionButtons, Alert, Button } from "components/unified";
import { usePagination, useSearch } from "hooks/use-admin";
import { useToast } from "hooks/use-toast";

// Import extracted components
import Container from "@/components/Container/Container.jsx";
import Button from "@/components/Button/Button.jsx";
import Alert from "@/components/Alert/Alert.jsx";
import AdminPageHeader from "@/components/AdminPageHeader/AdminPageHeader.jsx";
import AdminActionButtons from "@/components/AdminActionButtons/AdminActionButtons.jsx";
import AdminTable from "@/components/AdminTable/AdminTable.jsx";

// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White
const ACCENT_10 = `${ACCENT}1A`; // 10% opacity of ACCENT for subtle backgrounds

// --- Original Page Logic (with integrated components) ---

export default function AdminsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  // Use search hook for filtering admins
  const { query, debouncedQuery, setQuery, clearSearch } = useSearch("", 300);

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    getVisiblePages,
    setCurrentPage,
  } = usePagination(filteredAdmins.length, 10); // Note: Use filteredAdmins.length

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const result = await getAdmins();
        if (result.success) {
          setAdmins(result.data);
        } else {
          setError(
            result.message ||
              "Erreur lors de la récupération des administrateurs.",
          );
        }
      } catch {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    }
    fetchAdmins();
  }, []);

  // Filter admins based on search query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          admin.role.toLowerCase().includes(debouncedQuery.toLowerCase()),
      );
      setFilteredAdmins(filtered);
    }
  }, [admins, debouncedQuery]);

  // Update pagination when filtered data changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [debouncedQuery]);

  const handleDelete = async (adminId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      try {
        const result = await deleteAdmin(adminId);
        if (result.success) {
          const updatedAdmins = admins.filter((admin) => admin.id !== adminId);
          setAdmins(updatedAdmins);
          toast({
            title: "Administrateur supprimé",
            description: "L'administrateur a été supprimé avec succès.",
          });
        } else {
          toast({
            title: "Erreur",
            description: result.message || "Erreur lors de la suppression.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la suppression.",
          variant: "destructive",
        });
      }
    }
  };

  // Get paginated data
  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

  const columns = [
    {
      key: "name",
      label: "Nom",
      render: (value, item) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-gray-500">{item.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rôle",
      render: (value) => {
        let style = {};
        let classes =
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        let label = value;

        if (value === "super_admin") {
          style = { backgroundColor: ACCENT_10, color: ACCENT };
          classes += " font-bold";
          label = "Super Admin";
        } else if (value === "content_manager") {
          style = { backgroundColor: PRIMARY_LIGHT, color: DARK_TEXT };
          label = "Gestionnaire Contenu";
        } else if (value === "messages_manager") {
          style = { backgroundColor: "#F3F4F6", color: "#4B5563" }; // bg-gray-100, text-gray-800
          label = "Gestionnaire Messages";
        } else {
          style = { backgroundColor: "#F3F4F6", color: "#4B5563" };
        }

        return (
          <span className={classes} style={style}>
            {label}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date de création",
      render: (value) => new Date(value).toLocaleDateString("fr-FR"),
    },
    {
      key: "status",
      label: "Statut",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
          style={
            value === "active"
              ? { backgroundColor: ACCENT_10, color: ACCENT }
              : { backgroundColor: "#F3F4F6", color: "#4B5563" }
          }
        >
          {value === "active" ? "Actif" : "Inactif"}
        </span>
      ),
    },
  ];

  const actionButtons = [
    {
      key: "edit",
      icon: Edit,
      href: (item) => `/admin/admins/${item.id}/edit`,
      className: "text-accent hover:text-accent/80",
      title: "Modifier",
      style: { color: ACCENT }, // Explicit color definition
    },
    {
      key: "delete",
      icon: Trash2,
      onClick: handleDelete,
      className: "text-red-600 hover:text-red-900",
      title: "Supprimer",
    },
  ];

  return (
    // Main canvas background - Design System background color
    <main
      className="min-h-screen p-4 md:p-10"
      style={{ backgroundColor: BACKGROUND }}
    >
      <Container className="max-w-7xl">
        <AdminPageHeader
          title="Gestion des Administrateurs"
          subtitle="Gérez les comptes administrateurs et leurs permissions"
          actionButton={
            <Button href="/admin/admins/new" variant="primary">
              <Users className="h-5 w-5 mr-2" />
              Nouvel Admin
            </Button>
          }
        />

        {/* Search Bar - Accent Focus State */}
        <div className="mb-8 scroll-reveal">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou rôle..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              // Input Styling: Accent Focus Ring
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 shadow-sm"
              style={{
                "--tw-ring-color": ACCENT,
                "--tw-focus-ring-color": ACCENT,
              }} // Explicitly setting focus ring color
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                title="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>
          {debouncedQuery && (
            <p className="text-sm text-gray-600 mt-3 ml-2">
              {filteredAdmins.length} résultat
              {filteredAdmins.length > 1 ? "s" : ""} pour "{debouncedQuery}"
            </p>
          )}
        </div>

        {error && <Alert type="error" message={error} className="mb-8" />}

        {/* Admin Table - Content Card Pattern */}
        <AdminTable
          columns={columns}
          data={paginatedAdmins}
          renderActions={(item) => (
            <AdminActionButtons item={item} actions={actionButtons} />
          )}
        />

        {/* Pagination - Outline Button Pattern */}
        {filteredAdmins.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 bg-white rounded-xl shadow-lg px-6 scroll-reveal">
            <div className="text-sm text-gray-700 font-medium">
              Affichage de {startIndex + 1} à{" "}
              {Math.min(endIndex, filteredAdmins.length)} sur{" "}
              {filteredAdmins.length} administrateurs
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={!hasPrevPage}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white"
              >
                Précédent
              </button>

              <div className="flex items-center gap-1">
                {getVisiblePages().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" ? goToPage(page) : null
                    }
                    disabled={page === "..."}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                      page === currentPage
                        ? "text-white shadow-md"
                        : page === "..."
                          ? "text-gray-500 cursor-default"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
                    style={
                      page === currentPage ? { backgroundColor: ACCENT } : {}
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={!hasNextPage}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
