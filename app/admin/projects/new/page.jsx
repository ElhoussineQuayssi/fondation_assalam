"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Move,
  Image,
  Type,
  List,
  Quote,
  AlertTriangle,
  Save,
  Eye,
  Loader2,
  Settings,
  Play,
  Users,
  BarChart3,
  Calendar,
  HelpCircle,
  Target,
  FileText,
  MapPin,
  Award,
  BookOpen,
  Heart,
  UserCheck,
  TrendingUp,
  Briefcase,
  X, // Added for close/remove
  ChevronDown, // Added for select/accordion
} from "lucide-react";
import BasicInformationBlock from "@/components/blocks/BasicInformationBlock";
import ContentBuilderBlock from "@/components/blocks/ContentBuilderBlock";
import SidebarBlocks from "@/components/blocks/SidebarBlocks";
import ContentBlock from "@/components/blocks/ContentBlock";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

// --- Design System Utility Components ---

/**
 * Utility: Outline Button (Secondary Action)
 */
const OutlineButton = ({ children, className = "", icon: Icon, ...props }) => {
  const baseClasses =
    "font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-center flex items-center justify-center";
  // Outline Button Pattern
  const outlineClasses = `text-[${ACCENT}] border border-[${ACCENT}] rounded-lg px-4 py-2 hover:bg-[${ACCENT}] hover:text-white`;

  return (
    <button
      type="button"
      className={`${baseClasses} ${outlineClasses} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5 mr-2" />}
      {children}
    </button>
  );
};

const contentTypes = [
  { type: "text", label: "Texte", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "list", label: "Liste", icon: List },
  { type: "quote", label: "Citation", icon: Quote },
  { type: "gallery", label: "Galerie", icon: Image },
  { type: "video", label: "Vidéo", icon: Play },
  { type: "testimonial", label: "Témoignage", icon: Users },
  { type: "stats", label: "Statistiques", icon: BarChart3 },
  { type: "timeline", label: "Chronologie", icon: Calendar },
  { type: "faq", label: "FAQ", icon: HelpCircle },
  { type: "cta", label: "Appel à l'action", icon: Target },
  { type: "file", label: "Fichier", icon: FileText },
  { type: "map", label: "Carte", icon: MapPin },
  { type: "award", label: "Récompense", icon: Award },
  { type: "programme", label: "Programme", icon: BookOpen },
  { type: "services", label: "Services", icon: Heart },
  { type: "sponsorship", label: "Parrainage", icon: UserCheck },
  { type: "impact", label: "Impact", icon: TrendingUp },
  { type: "team", label: "Équipe", icon: Briefcase },
];

// --- Main Component ---
export default function NewProject() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    status: "idle", // idle, submitting, success, error
    message: "",
  });
  const [projectData, setProjectData] = useState({
    title: "",
    excerpt: "",
    image: "",
    categories: [],
    startDate: "",
    location: "",
    peopleHelped: "",
    status: "Actif",
    content: [],
    goals: [],
    gallery: [],
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [newGoal, setNewGoal] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      // Simplified content initialization for the demo
      content:
        type === "text"
          ? { heading: "Nouveau titre", text: "Nouveau paragraphe..." }
          : type === "image"
            ? { src: "URL de l'image", alt: "Description", caption: "Légende" }
            : {},
    };
    setProjectData((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  };

  const updateContentBlock = (id, updates) => {
    setProjectData((prev) => ({
      ...prev,
      content: prev.content.map((block) =>
        block.id === id
          ? { ...block, content: { ...block.content, ...updates } }
          : block,
      ),
    }));
  };

  const removeContentBlock = (id) => {
    setProjectData((prev) => ({
      ...prev,
      content: prev.content.filter((block) => block.id !== id),
    }));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setProjectData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (index) => {
    setProjectData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !projectData.categories.includes(newCategory.trim())
    ) {
      setProjectData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (category) => {
    setProjectData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  // Gallery functions are now handled by GalleryFileUpload component
  // These functions are kept for backward compatibility but not used
  const addImage = (imageUrl) => {
    if (imageUrl.trim()) {
      setProjectData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, imageUrl.trim()],
      }));
    }
  };

  const removeImage = (index) => {
    setProjectData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newContent = [...projectData.content];
    const draggedContent = newContent[draggedItem];
    newContent.splice(draggedItem, 1);
    newContent.splice(dropIndex, 0, draggedContent);

    setProjectData((prev) => ({
      ...prev,
      content: newContent,
    }));
    setDraggedItem(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormState({ ...formState, status: "submitting", message: "" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = { success: true }; // Assume success for demo

      // const result = await saveNewProject(projectData); // Real call

      if (result.success) {
        setFormState({
          ...formState,
          status: "success",
          message: "Projet créé avec succès!",
        });
        setTimeout(() => {
          router.push("/admin/projects");
        }, 2000);
      } else {
        setFormState({
          ...formState,
          status: "error",
          message: "Une erreur s'est produite. Veuillez réessayer.",
        });
      }
    } catch (error) {
      console.error("Project save failed:", error);
      setFormState({
        ...formState,
        status: "error",
        message: "Une erreur s'est produite. Veuillez réessayer.",
      });
    }
  };

  const renderContentBlock = (block, index) => {
    return (
      <ContentBlock
        key={block.id}
        block={block}
        index={index}
        contentTypes={contentTypes}
        updateContentBlock={updateContentBlock}
        removeContentBlock={removeContentBlock}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      />
    );
  };

  // --- Transformed JSX (Minimalist Light Blue Design) ---
  return (
    <div className={`bg-[${BACKGROUND}] min-h-screen py-10 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 scroll-reveal">
          {/* H2 Typography Style for Title */}
          <h1
            className={`text-4xl font-bold text-[${DARK_TEXT}] pb-2 mb-1`}
            style={{ borderBottom: `3px solid ${ACCENT}` }}
          >
            Nouveau Projet
          </h1>
          <div className="flex gap-4">
            <OutlineButton
              onClick={() => setShowPreview(!showPreview)}
              icon={Eye}
            >
              {showPreview ? "Modifier" : "Aperçu"}
            </OutlineButton>
          </div>
        </div>

        {formState.status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{formState.message}</p>
          </div>
        )}

        {formState.status === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
            <p>{formState.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <BasicInformationBlock
                projectData={projectData}
                handleInputChange={handleInputChange}
              />

              <ContentBuilderBlock
                projectData={projectData}
                contentTypes={contentTypes}
                addContentBlock={addContentBlock}
                renderContentBlock={renderContentBlock}
              />
            </div>

            {/* Sidebar */}
            <SidebarBlocks
              projectData={projectData}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              addCategory={addCategory}
              removeCategory={removeCategory}
              newGoal={newGoal}
              setNewGoal={setNewGoal}
              addGoal={addGoal}
              removeGoal={removeGoal}
              formState={formState}
              submitButtonText="Créer le Projet"
              onSubmit={handleSubmit}
              handleInputChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
