"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateProject } from "lib/actions";
import BasicInformationBlock from "@/components/blocks/BasicInformationBlock";
import ContentBuilderBlock from "@/components/blocks/ContentBuilderBlock";
import SidebarBlocks from "@/components/blocks/SidebarBlocks";
import ContentBlock from "@/components/blocks/ContentBlock";
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
  Users as UsersIcon,
  UserCheck,
  TrendingUp,
  Briefcase,
} from "lucide-react";

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

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
  const [loading, setLoading] = useState(true);

  // Content block types
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

  // Load existing project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        console.log("Fetching project with ID:", id);
        const response = await fetch(`/api/projects/${id}`);
        console.log("Response status:", response.status);

        if (response.ok) {
          const project = await response.json();
          console.log("Loaded project data:", project); // Debug log
          setProjectData({
            title: project.title || "",
            excerpt: project.excerpt || "",
            image: project.image || "",
            categories: Array.isArray(project.categories)
              ? project.categories
              : [],
            startDate: project.startDate || "",
            location: project.location || "",
            peopleHelped: project.peopleHelped || "",
            status: project.status || "Actif",
            content: Array.isArray(project.content) ? project.content : [],
            goals: Array.isArray(project.goals) ? project.goals : [],
            gallery: Array.isArray(project.gallery) ? project.gallery : [],
          }); // Debug log
        } else {
          console.error(
            "Failed to load project:",
            response.status,
            response.statusText,
          );
          const errorText = await response.text();
          console.error("Error response:", errorText);
          setFormState({
            status: "error",
            message: `Erreur lors du chargement du projet. Statut: ${response.status} ${response.statusText}.`,
          });
        }
      } catch (error) {
        console.error("Error loading project:", error);
        setFormState({
          status: "error",
          message: "Erreur lors du chargement du projet.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

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
      content:
        type === "text"
          ? { heading: "", text: "" }
          : type === "image"
            ? { src: "", alt: "", caption: "" }
            : type === "list"
              ? { title: "", items: [""] }
              : type === "quote"
                ? { text: "", author: "" }
                : type === "gallery"
                  ? { title: "", images: [""] }
                  : type === "video"
                    ? { url: "", title: "", description: "" }
                    : type === "testimonial"
                      ? { name: "", role: "", content: "", image: "" }
                      : type === "stats"
                        ? { title: "", stats: [{ label: "", value: "" }] }
                        : type === "timeline"
                          ? {
                              title: "",
                              events: [
                                { year: "", title: "", description: "" },
                              ],
                            }
                          : type === "faq"
                            ? {
                                title: "",
                                questions: [{ question: "", answer: "" }],
                              }
                            : type === "cta"
                              ? {
                                  title: "",
                                  description: "",
                                  buttonText: "",
                                  buttonUrl: "",
                                }
                              : type === "file"
                                ? {
                                    title: "",
                                    description: "",
                                    fileUrl: "",
                                    fileName: "",
                                  }
                                : type === "map"
                                  ? { title: "", address: "", embedUrl: "" }
                                  : type === "award"
                                    ? {
                                        title: "",
                                        description: "",
                                        issuer: "",
                                        year: "",
                                        image: "",
                                      }
                                    : type === "programme"
                                      ? {
                                          title: "",
                                          duration: "",
                                          modules: [],
                                          certification: "",
                                        }
                                      : type === "services"
                                        ? { title: "", categories: [] }
                                        : type === "sponsorship"
                                          ? { title: "", options: [] }
                                          : type === "impact"
                                            ? {
                                                title: "",
                                                impacts: [],
                                                sdgs: [],
                                              }
                                            : type === "team"
                                              ? { title: "", members: [] }
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
      const result = await updateProject(id, projectData);
      if (result.success) {
        setFormState({
          ...formState,
          status: "success",
          message: "Projet mis à jour avec succès!",
        });
        setTimeout(() => {
          router.push("/admin/projects");
        }, 2000);
      } else {
        setFormState({
          ...formState,
          status: "error",
          message:
            result.message || "Une erreur s'est produite. Veuillez réessayer.",
        });
      }
    } catch (error) {
      console.error("Project update failed:", error);
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    // Main canvas background - Design System background color
    <main className="bg-background min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 scroll-reveal">
          {/* H2 Typography Style for Title */}
          <h1
            className="text-4xl font-bold text-dark-text pb-2 mb-1"
            style={{ borderBottom: "3px solid var(--color-accent)" }}
          >
            Modifier le Projet
          </h1>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              // Outline Button Pattern
              className="text-accent border border-accent rounded-lg px-4 py-2 hover:bg-accent hover:text-white transition-all duration-300 flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              {showPreview ? "Modifier" : "Aperçu"}
            </button>
          </div>
        </div>

        {formState.status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{formState.message}</p>
          </div>
        )}

        {formState.status === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
            <p>{formState.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (lg:col-span-2) */}
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

            {/* Sidebar (lg:col-span-1) */}
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
              submitButtonText="Mettre à Jour le Projet"
              onSubmit={handleSubmit}
              handleInputChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
