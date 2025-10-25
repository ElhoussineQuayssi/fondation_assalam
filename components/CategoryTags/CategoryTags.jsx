import { Plus, Trash2 } from "lucide-react";

export default function CategoryTags({
  title,
  items,
  newItem,
  setNewItem,
  addItem,
  removeItem,
  placeholder,
  addButtonColor = "bg-blue-500 hover:bg-blue-600",
  tagColor = "bg-blue-100 text-blue-800",
  inputClassName = "",
  maxItems = null,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
            placeholder={placeholder}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addItem())
            }
          />
          <button
            type="button"
            onClick={addItem}
            className={`px-3 py-2 text-white rounded-md transition-colors ${addButtonColor}`}
            title={`Ajouter ${title.toLowerCase()}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full ${tagColor}`}
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="text-current hover:opacity-75"
              title={`Retirer ${title.toLowerCase()}`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          Aucun élément ajouté.
        </p>
      )}
    </div>
  );
}
