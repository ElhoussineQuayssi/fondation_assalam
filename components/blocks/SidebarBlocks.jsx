import { Plus, Trash2, Save, Image, Upload } from "lucide-react";
import GalleryFileUpload from "@/components/FileUpload/GalleryFileUpload";

export default function SidebarBlocks({
  projectData,
  newCategory,
  setNewCategory,
  addCategory,
  removeCategory,
  newGoal,
  setNewGoal,
  addGoal,
  removeGoal,
  formState,
  submitButtonText,
  onSubmit,
  handleInputChange,
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Domaines d'Action et Catégories
        </h3>{" "}
        {/* Enhanced Content */}
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nouveau domaine d'intervention (Ex: Éducation)" // Enhanced Content
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCategory())
              }
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              title="Ajouter un domaine" // Enhanced Content
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {projectData.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="text-blue-600 hover:text-blue-800"
                title="Retirer ce domaine" // Enhanced Content
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Objectifs et Résultats Souhaités
        </h3>{" "}
        {/* Enhanced Content */}
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nouveau résultat attendu" // Enhanced Content
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addGoal())
              }
            />
            <button
              type="button"
              onClick={addGoal}
              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              title="Ajouter un objectif" // Enhanced Content
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {projectData.goals.map((goal, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-green-50 p-2 rounded"
            >
              <span className="text-sm text-green-800">{goal}</span>
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="text-green-600 hover:text-green-800"
                title="Supprimer ce résultat" // Enhanced Content
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Images */}
      <GalleryFileUpload
        title="Galerie d'Images (Témoignages Visuels)"
        gallery={projectData.gallery}
        onGalleryChange={(newGallery) => {
          handleInputChange('gallery', newGallery);
        }}
        maxFiles={10}
      />

      {/* Submit Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          type="submit"
          disabled={formState.status === "submitting"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {formState.status === "submitting"
            ? "Enregistrement de notre œuvre..."
            : submitButtonText}{" "}
          {/* Enhanced Content */}
        </button>
      </div>
    </div>
  );
}
