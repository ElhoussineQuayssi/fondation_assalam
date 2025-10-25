import {
  Plus,
  Type,
  Image,
  List,
  Quote,
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

export default function ContentBuilderBlock({
  projectData,
  contentTypes,
  addContentBlock,
  renderContentBlock,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Éditeur de Contenu : Construire notre Récit d'Impact
      </h2>{" "}
      {/* Enhanced Content */}
      {/* Add Content Blocks */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un nouvel élément de notre histoire
        </label>{" "}
        {/* Enhanced Content */}
        <div className="flex flex-wrap gap-2">
          {contentTypes.map((type) => (
            <button
              key={type.type}
              type="button"
              onClick={() => addContentBlock(type.type)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <type.icon className="h-4 w-4" />
              {/* NOTE: We assume type.label is consistently managed in the contentTypes array. */}
              {type.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content Blocks */}
      <div className="space-y-4">
        {projectData.content.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>
              Aucun contenu pour le moment. Cliquez sur les boutons ci-dessus
              pour ajouter le premier chapitre de notre projet de solidarité.
            </p>{" "}
            {/* Enhanced Content */}
          </div>
        ) : (
          projectData.content.map((block, index) =>
            renderContentBlock(block, index),
          )
        )}
      </div>
    </div>
  );
}
