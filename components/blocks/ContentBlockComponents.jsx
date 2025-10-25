import { Trash2, Plus, Move, Upload, Image as ImageIcon, X } from "lucide-react";
import { useState, useRef } from "react";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const DARK_TEXT = "#333333"; // Dark Gray
const DELETE_COLOR = "#EF4444"; // Standard Red for error/delete

// --- Shared Input Styling ---
// This style object is used to inject the ACCENT color into the Tailwind focus rings
const focusedInputStyle = {
  // These custom properties allow the Tailwind utility classes (like focus:ring-2) to use our ACCENT color
  "--tw-ring-color": ACCENT,
  "--tw-border-opacity": 1,
  borderColor: ACCENT,
  transition: "border-color 0.15s, box-shadow 0.15s",
};
const inputClasses =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2";
const checkboxClasses = "rounded border-gray-300 focus:ring-2";

// --- Content Block Components (Refactorisé) ---

export function TextBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre principal (Ex: Notre Mission pour la Dignité)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.heading || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { heading: e.target.value })
        }
      />
      <textarea
        placeholder="Rédigez le contenu chaleureux et informatif..." // Enhanced Content
        rows="4"
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.text || ""}
        onChange={(e) => updateContentBlock(block.id, { text: e.target.value })}
      ></textarea>
    </div>
  );
}

export function ImageBlock({ block, updateContentBlock, removeContentBlock }) {
   const [isUploading, setIsUploading] = useState(false);
   const [uploadError, setUploadError] = useState(null);
   const fileInputRef = useRef(null);

   const handleFileUpload = async (file) => {
     if (!file) return;

     // Validate file type
     if (!file.type.startsWith('image/')) {
       setUploadError('Seuls les fichiers image sont autorisés.');
       return;
     }

     // Validate file size (5MB)
     if (file.size > 5 * 1024 * 1024) {
       setUploadError('Le fichier est trop volumineux (max 5MB).');
       return;
     }

     setIsUploading(true);
     setUploadError(null);

     try {
       const formData = new FormData();
       formData.append('image', file);

       const response = await fetch('/api/upload', {
         method: 'POST',
         body: formData,
       });

       const result = await response.json();

       if (!response.ok) {
         throw new Error(result.error || 'Erreur lors du téléchargement');
       }

       // Update the block's src with the uploaded URL
       updateContentBlock(block.id, { src: result.filePath });
     } catch (error) {
       console.error('Upload error:', error);
       setUploadError(error.message);
     } finally {
       setIsUploading(false);
     }
   };

   const handleFileSelect = (e) => {
     const file = e.target.files[0];
     if (file) {
       handleFileUpload(file);
     }
     // Reset input
     e.target.value = '';
   };

   const handleDrop = (e) => {
     e.preventDefault();
     const file = e.dataTransfer.files[0];
     if (file) {
       handleFileUpload(file);
     }
   };

   const handleDragOver = (e) => {
     e.preventDefault();
   };

   const openFileDialog = () => {
     fileInputRef.current?.click();
   };

   const removeImage = () => {
     updateContentBlock(block.id, { src: '' });
   };

   return (
     <div className="space-y-3">
       {/* Image Upload/Preview Section */}
       <div className="space-y-2">
         <label className="block text-sm font-medium text-gray-700">
           Image (Téléchargez ou remplacez l'image)
         </label>

         {block.content.src ? (
           <div className="relative">
             <img
               src={block.content.src}
               alt={block.content.alt || "Aperçu de l'image"}
               className="w-full h-48 object-cover rounded-md border border-gray-300"
             />
             <button
               type="button"
               onClick={removeImage}
               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
               title="Retirer l'image"
             >
               <X className="h-4 w-4" />
             </button>
           </div>
         ) : (
           <div
             className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
             onDrop={handleDrop}
             onDragOver={handleDragOver}
             onClick={openFileDialog}
           >
             <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
             <p className="text-sm text-gray-600">
               Cliquez pour sélectionner ou glissez une image ici
             </p>
             <p className="text-xs text-gray-500 mt-1">
               Formats acceptés: JPG, PNG, GIF • Taille max: 5MB
             </p>
           </div>
         )}

         <input
           ref={fileInputRef}
           type="file"
           accept="image/*"
           onChange={handleFileSelect}
           className="hidden"
         />

         {isUploading && (
           <div className="flex items-center justify-center py-4">
             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
             <span className="ml-2 text-sm text-gray-600">Téléchargement en cours...</span>
           </div>
         )}

         {uploadError && (
           <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
             {uploadError}
           </div>
         )}

         {block.content.src && (
           <button
             type="button"
             onClick={openFileDialog}
             className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
           >
             <Upload className="h-4 w-4" />
             Remplacer l'image
           </button>
         )}
       </div>

       {/* Alt Text Input */}
       <input
         type="text"
         placeholder="Description de l'image pour l'accessibilité" // Enhanced Content
         className={inputClasses}
         style={focusedInputStyle}
         value={block.content.alt || ""}
         onChange={(e) => updateContentBlock(block.id, { alt: e.target.value })}
       />

       {/* Caption Input */}
       <input
         type="text"
         placeholder="Légende du visuel (racontez l'histoire)" // Enhanced Content
         className={inputClasses}
         style={focusedInputStyle}
         value={block.content.caption || ""}
         onChange={(e) =>
           updateContentBlock(block.id, { caption: e.target.value })
         }
       />
     </div>
   );
 }

export function ListBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre de la section (Ex: Nos Projets Clés)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      {block.content.items?.map((item, itemIndex) => (
        <div key={itemIndex} className="flex gap-2">
          <input
            type="text"
            placeholder={`Détail du point clé`} // Enhanced Content
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={focusedInputStyle}
            value={item}
            onChange={(e) => {
              const newItems = [...block.content.items];
              newItems[itemIndex] = e.target.value;
              updateContentBlock(block.id, { items: newItems });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const newItems = block.content.items.filter(
                (_, i) => i !== itemIndex,
              );
              updateContentBlock(block.id, { items: newItems });
            }}
            className="px-2 hover:text-red-600 transition-colors duration-150"
            style={{ color: DELETE_COLOR }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newItems = [...(block.content.items || []), ""];
          updateContentBlock(block.id, { items: newItems });
        }}
        className="text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
        style={{ color: ACCENT }}
      >
        <Plus className="h-4 w-4" /> Ajouter un point clé{" "}
        {/* Enhanced Content */}
      </button>
    </div>
  );
}

export function QuoteBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <textarea
        placeholder="Citation inspirante sur la solidarité..." // Enhanced Content
        rows="3"
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.text || ""}
        onChange={(e) => updateContentBlock(block.id, { text: e.target.value })}
      />
      <input
        type="text"
        placeholder="Source de la citation (Bénéficiaire, Partenaire, Fondateur)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.author || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { author: e.target.value })
        }
      />
    </div>
  );
}

export function TestimonialBlock({
  block,
  updateContentBlock,
  removeContentBlock,
}) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Nom du Bénéficiaire/Témoin" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.name || ""}
        onChange={(e) => updateContentBlock(block.id, { name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Qualité (Ex: Mère de famille, Étudiant, Partenaire)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.role || ""}
        onChange={(e) => updateContentBlock(block.id, { role: e.target.value })}
      />
      <textarea
        placeholder="Récit d'impact personnel et d'espoir..." // Enhanced Content
        rows="4"
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.content || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { content: e.target.value })
        }
      />
      <input
        type="url"
        placeholder="Photo du Bénéficiaire (optionnel)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.image || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { image: e.target.value })
        }
      />
    </div>
  );
}

export function StatsBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre : Notre Impact en Chiffres" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      {block.content.stats?.map((stat, statIndex) => (
        <div key={statIndex} className="flex gap-2">
          <input
            type="text"
            placeholder="Description de l'impact (Ex: Familles aidées)" // Enhanced Content
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={focusedInputStyle}
            value={stat.label || ""}
            onChange={(e) => {
              const newStats = [...block.content.stats];
              newStats[statIndex] = {
                ...newStats[statIndex],
                label: e.target.value,
              };
              updateContentBlock(block.id, { stats: newStats });
            }}
          />
          <input
            type="text"
            placeholder="Chiffre ou Montant" // Enhanced Content
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={focusedInputStyle}
            value={stat.value || ""}
            onChange={(e) => {
              const newStats = [...block.content.stats];
              newStats[statIndex] = {
                ...newStats[statIndex],
                value: e.target.value,
              };
              updateContentBlock(block.id, { stats: newStats });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const newStats = block.content.stats.filter(
                (_, i) => i !== statIndex,
              );
              updateContentBlock(block.id, { stats: newStats });
            }}
            className="px-2 hover:text-red-600 transition-colors duration-150"
            style={{ color: DELETE_COLOR }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newStats = [
            ...(block.content.stats || []),
            { label: "", value: "" },
          ];
          updateContentBlock(block.id, { stats: newStats });
        }}
        className="text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
        style={{ color: ACCENT }}
      >
        <Plus className="h-4 w-4" /> Ajouter un Indicateur d'Impact{" "}
        {/* Enhanced Content */}
      </button>
    </div>
  );
}

export function TimelineBlock({
  block,
  updateContentBlock,
  removeContentBlock,
}) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Notre Histoire : Jalons de Solidarité" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      {block.content.events?.map((event, eventIndex) => (
        <div key={eventIndex} className="border border-gray-200 rounded-lg p-3">
          <input
            type="text"
            placeholder="Année de l'événement (Ex: 2018)" // Enhanced Content
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
            style={focusedInputStyle}
            value={event.year || ""}
            onChange={(e) => {
              const newEvents = [...block.content.events];
              newEvents[eventIndex] = {
                ...newEvents[eventIndex],
                year: e.target.value,
              };
              updateContentBlock(block.id, { events: newEvents });
            }}
          />
          <input
            type="text"
            placeholder="Titre de la réalisation/campagne" // Enhanced Content
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
            style={focusedInputStyle}
            value={event.title || ""}
            onChange={(e) => {
              const newEvents = [...block.content.events];
              newEvents[eventIndex] = {
                ...newEvents[eventIndex],
                title: e.target.value,
              };
              updateContentBlock(block.id, { events: newEvents });
            }}
          />
          <textarea
            placeholder="Détail du jalon et son impact..." // Enhanced Content
            rows="2"
            className={inputClasses}
            style={focusedInputStyle}
            value={event.description || ""}
            onChange={(e) => {
              const newEvents = [...block.content.events];
              newEvents[eventIndex] = {
                ...newEvents[eventIndex],
                description: e.target.value,
              };
              updateContentBlock(block.id, { events: newEvents });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const newEvents = block.content.events.filter(
                (_, i) => i !== eventIndex,
              );
              updateContentBlock(block.id, { events: newEvents });
            }}
            className="text-sm mt-2 hover:text-red-600 transition-colors duration-150"
            style={{ color: DELETE_COLOR }}
          >
            Retirer ce Jalon Historique {/* Enhanced Content */}
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newEvents = [
            ...(block.content.events || []),
            { year: "", title: "", description: "" },
          ];
          updateContentBlock(block.id, { events: newEvents });
        }}
        className="text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
        style={{ color: ACCENT }}
      >
        <Plus className="h-4 w-4" /> Ajouter un Jalon Historique{" "}
        {/* Enhanced Content */}
      </button>
    </div>
  );
}

export function FaqBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Foire aux Questions (Informations Pratiques)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      {block.content.questions?.map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="border border-gray-200 rounded-lg p-3"
        >
          <input
            type="text"
            placeholder="Question Fréquemment Posée" // Enhanced Content
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
            style={focusedInputStyle}
            value={question.question || ""}
            onChange={(e) => {
              const newQuestions = [...block.content.questions];
              newQuestions[questionIndex] = {
                ...newQuestions[questionIndex],
                question: e.target.value,
              };
              updateContentBlock(block.id, { questions: newQuestions });
            }}
          />
          <textarea
            placeholder="Réponse claire et complète..." // Enhanced Content
            rows="3"
            className={inputClasses}
            style={focusedInputStyle}
            value={question.answer || ""}
            onChange={(e) => {
              const newQuestions = [...block.content.questions];
              newQuestions[questionIndex] = {
                ...newQuestions[questionIndex],
                answer: e.target.value,
              };
              updateContentBlock(block.id, { questions: newQuestions });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const newQuestions = block.content.questions.filter(
                (_, i) => i !== questionIndex,
              );
              updateContentBlock(block.id, { questions: newQuestions });
            }}
            className="text-sm mt-2 hover:text-red-600 transition-colors duration-150"
            style={{ color: DELETE_COLOR }}
          >
            Retirer cette Question {/* Enhanced Content */}
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newQuestions = [
            ...(block.content.questions || []),
            { question: "", answer: "" },
          ];
          updateContentBlock(block.id, { questions: newQuestions });
        }}
        className="text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
        style={{ color: ACCENT }}
      >
        <Plus className="h-4 w-4" /> Ajouter une Question-Réponse{" "}
        {/* Enhanced Content */}
      </button>
    </div>
  );
}

export function PartnerBlock({
  block,
  updateContentBlock,
  removeContentBlock,
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Nos Partenaires, Ensemble pour le Développement" // Enhanced Content
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />

      <div>
        <h4 className="text-sm font-medium mb-2">
          Alliés et Collaborateurs de la Fondation
        </h4>{" "}
        {/* Enhanced Content */}
        {block.content.partners?.map((partner, partnerIndex) => (
          <div
            key={partnerIndex}
            className="border border-gray-200 rounded-lg p-3 mb-3 space-y-2"
          >
            <input
              type="text"
              placeholder="Nom de l'organisation partenaire" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={partner.name || ""}
              onChange={(e) => {
                const newPartners = [...block.content.partners];
                newPartners[partnerIndex] = {
                  ...newPartners[partnerIndex],
                  name: e.target.value,
                };
                updateContentBlock(block.id, { partners: newPartners });
              }}
            />
            <input
              type="url"
              placeholder="Lien du logo (haute résolution)" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={partner.logoUrl || ""}
              onChange={(e) => {
                const newPartners = [...block.content.partners];
                newPartners[partnerIndex] = {
                  ...newPartners[partnerIndex],
                  logoUrl: e.target.value,
                };
                updateContentBlock(block.id, { partners: newPartners });
              }}
            />
            <input
              type="url"
              placeholder="Lien vers le site web (optionnel)" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={partner.websiteUrl || ""}
              onChange={(e) => {
                const newPartners = [...block.content.partners];
                newPartners[partnerIndex] = {
                  ...newPartners[partnerIndex],
                  websiteUrl: e.target.value,
                };
                updateContentBlock(block.id, { partners: newPartners });
              }}
            />
            <button
              type="button"
              onClick={() => {
                const newPartners = block.content.partners.filter(
                  (_, i) => i !== partnerIndex,
                );
                updateContentBlock(block.id, { partners: newPartners });
              }}
              className="text-red-400 hover:text-red-600 text-sm mt-2"
            >
              Retirer cet Allié {/* Enhanced Content */}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newPartners = [
              ...(block.content.partners || []),
              { name: "", logoUrl: "", websiteUrl: "" },
            ];
            updateContentBlock(block.id, { partners: newPartners });
          }}
          className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Ajouter un Nouvel Allié{" "}
          {/* Enhanced Content */}
        </button>
      </div>
    </div>
  );
}

export function CtaBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre fort (Ex: Soutenez Notre Cause)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      <textarea
        placeholder="Message impactant et motivant..." // Enhanced Content
        rows="3"
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.description || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { description: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Ex: Faire un Don, Parrainer un Enfant" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.buttonText || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { buttonText: e.target.value })
        }
      />
      <input
        type="url"
        placeholder="Lien de destination (page de don/action)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.buttonUrl || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { buttonUrl: e.target.value })
        }
      />
    </div>
  );
}

export function FileBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre du Document (Ex: Rapport d'Impact 2024)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      <textarea
        placeholder="Brève description du contenu du document..." // Enhanced Content
        rows="3"
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.description || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { description: e.target.value })
        }
      />
      <input
        type="url"
        placeholder="Lien direct vers le document (PDF, etc.)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.fileUrl || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { fileUrl: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Nom technique du fichier (optionnel)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.fileName || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { fileName: e.target.value })
        }
      />
    </div>
  );
}

export function MapBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Localisation de notre Siège/Antenne" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Adresse physique complète (pour affichage)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.address || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { address: e.target.value })
        }
      />
      <input
        type="url"
        placeholder="URL d'intégration Google Maps (iframe/embed)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.embedUrl || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { embedUrl: e.target.value })
        }
      />
    </div>
  );
}

export function VideoBlock({ block, updateContentBlock, removeContentBlock }) {
  // Checkbox input style for ACCENT color
  const checkboxStyle = {
    color: ACCENT,
    "--tw-ring-color": ACCENT,
  };

  return (
    <div className="space-y-3">
      <input
        type="url"
        placeholder="Lien de la Vidéo (Ex: Histoire d'un Bénéficiaire)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.url || ""}
        onChange={(e) => updateContentBlock(block.id, { url: e.target.value })}
      />
      <input
        type="text"
        placeholder="Titre de la vidéo (Ex: Le Projet Rayhana)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      <textarea
        placeholder="Résumé du contenu de la vidéo..." // Enhanced Content
        rows="3"
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.description || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { description: e.target.value })
        }
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`autoplay-${block.id}`}
          checked={block.content.autoplay || false}
          onChange={(e) =>
            updateContentBlock(block.id, { autoplay: e.target.checked })
          }
          className={checkboxClasses}
          style={checkboxStyle}
        />
        <label
          htmlFor={`autoplay-${block.id}`}
          className="text-sm text-gray-700"
        >
          Lecture automatique du contenu {/* Enhanced Content */}
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`controls-${block.id}`}
          checked={block.content.showControls !== false}
          onChange={(e) =>
            updateContentBlock(block.id, { showControls: e.target.checked })
          }
          className={checkboxClasses}
          style={checkboxStyle}
        />
        <label
          htmlFor={`controls-${block.id}`}
          className="text-sm text-gray-700"
        >
          Afficher les commandes de lecture {/* Enhanced Content */}
        </label>
      </div>
    </div>
  );
}

export function AwardBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre de la Reconnaissance / Distinction" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      <textarea
        placeholder="Détail de la reconnaissance et de sa signification..." // Enhanced Content
        rows="3"
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.description || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { description: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Organisme / Institution de la Distinction" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.issuer || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { issuer: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Année de l'obtention" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.year || ""}
        onChange={(e) => updateContentBlock(block.id, { year: e.target.value })}
      />
      <input
        type="url"
        placeholder="Logo ou Photo du Trophée (optionnel)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.image || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { image: e.target.value })
        }
      />
    </div>
  );
}

export function ProgrammeBlock({
  block,
  updateContentBlock,
  removeContentBlock,
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Nom du Programme (Ex: Rayhana Assalam)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Durée Totale (Ex: 6 mois, Année scolaire)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.duration || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { duration: e.target.value })
        }
      />

      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: DARK_TEXT }}>
          Axes de Formation et Modules
        </h4>{" "}
        {/* Enhanced Content */}
        {block.content.modules?.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            className="border border-gray-200 rounded-lg p-3 mb-3"
          >
            <input
              type="text"
              placeholder="Nom du Module / Thème" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
              style={focusedInputStyle}
              value={module.title || ""}
              onChange={(e) => {
                const newModules = [...block.content.modules];
                newModules[moduleIndex] = {
                  ...newModules[moduleIndex],
                  title: e.target.value,
                };
                updateContentBlock(block.id, { modules: newModules });
              }}
            />
            <textarea
              placeholder="Objectifs et Contenu du Module" // Enhanced Content
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
              style={focusedInputStyle}
              value={module.description || ""}
              onChange={(e) => {
                const newModules = [...block.content.modules];
                newModules[moduleIndex] = {
                  ...newModules[moduleIndex],
                  description: e.target.value,
                };
                updateContentBlock(block.id, { modules: newModules });
              }}
            />
            <input
              type="text"
              placeholder="Durée du Module (Ex: 15 heures)" // Enhanced Content
              className={inputClasses}
              style={focusedInputStyle}
              value={module.duration || ""}
              onChange={(e) => {
                const newModules = [...block.content.modules];
                newModules[moduleIndex] = {
                  ...newModules[moduleIndex],
                  duration: e.target.value,
                };
                updateContentBlock(block.id, { modules: newModules });
              }}
            />
            <button
              type="button"
              onClick={() => {
                const newModules = block.content.modules.filter(
                  (_, i) => i !== moduleIndex,
                );
                updateContentBlock(block.id, { modules: newModules });
              }}
              className="text-sm mt-2 hover:text-red-600 transition-colors duration-150"
              style={{ color: DELETE_COLOR }}
            >
              Retirer cet Axe de Formation {/* Enhanced Content */}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newModules = [
              ...(block.content.modules || []),
              { title: "", description: "", duration: "" },
            ];
            updateContentBlock(block.id, { modules: newModules });
          }}
          className="text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
          style={{ color: ACCENT }}
        >
          <Plus className="h-4 w-4" /> Ajouter un Module de Formation{" "}
          {/* Enhanced Content */}
        </button>
      </div>

      <input
        type="text"
        placeholder="Type de Certification Délivrée" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.certification || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { certification: e.target.value })
        }
      />
    </div>
  );
}

export function ServicesBlock({
  block,
  updateContentBlock,
  removeContentBlock,
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Titre : Nos Piliers d'Action Sociale" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />

      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: DARK_TEXT }}>
          Domaines d'Intervention Clés
        </h4>{" "}
        {/* Enhanced Content */}
        {block.content.categories?.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className="border border-gray-200 rounded-lg p-3 mb-3"
          >
            <input
              type="text"
              placeholder="Nom du Domaine (Ex: Aide Éducative)" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
              style={focusedInputStyle}
              value={category.name || ""}
              onChange={(e) => {
                const newCategories = [...block.content.categories];
                newCategories[categoryIndex] = {
                  ...newCategories[categoryIndex],
                  name: e.target.value,
                };
                updateContentBlock(block.id, { categories: newCategories });
              }}
            />

            <div className="ml-4">
              <h5
                className="text-xs font-medium mb-1"
                style={{ color: DARK_TEXT }}
              >
                Actions Spécifiques Associées
              </h5>{" "}
              {/* Enhanced Content */}
              {category.services?.map((service, serviceIndex) => (
                <div key={serviceIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nom de l'Action" // Enhanced Content
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={focusedInputStyle}
                    value={service.name || ""}
                    onChange={(e) => {
                      const newCategories = [...block.content.categories];
                      const newServices = [
                        ...newCategories[categoryIndex].services,
                      ];
                      newServices[serviceIndex] = {
                        ...newServices[serviceIndex],
                        name: e.target.value,
                      };
                      newCategories[categoryIndex] = {
                        ...newCategories[categoryIndex],
                        services: newServices,
                      };
                      updateContentBlock(block.id, {
                        categories: newCategories,
                      });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Détail de l'Action" // Enhanced Content
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={focusedInputStyle}
                    value={service.description || ""}
                    onChange={(e) => {
                      const newCategories = [...block.content.categories];
                      const newServices = [
                        ...newCategories[categoryIndex].services,
                      ];
                      newServices[serviceIndex] = {
                        ...newServices[serviceIndex],
                        description: e.target.value,
                      };
                      newCategories[categoryIndex] = {
                        ...newCategories[categoryIndex],
                        services: newServices,
                      };
                      updateContentBlock(block.id, {
                        categories: newCategories,
                      });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newCategories = [...block.content.categories];
                      const newServices = newCategories[
                        categoryIndex
                      ].services.filter((_, i) => i !== serviceIndex);
                      newCategories[categoryIndex] = {
                        ...newCategories[categoryIndex],
                        services: newServices,
                      };
                      updateContentBlock(block.id, {
                        categories: newCategories,
                      });
                    }}
                    className="px-1 hover:text-red-600 transition-colors duration-150"
                    style={{ color: DELETE_COLOR }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newCategories = [...block.content.categories];
                  const newServices = [
                    ...(newCategories[categoryIndex].services || []),
                    { name: "", description: "" },
                  ];
                  newCategories[categoryIndex] = {
                    ...newCategories[categoryIndex],
                    services: newServices,
                  };
                  updateContentBlock(block.id, { categories: newCategories });
                }}
                className="text-xs flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
                style={{ color: ACCENT }}
              >
                <Plus className="h-3 w-3" /> Ajouter une Action Spécifique{" "}
                {/* Enhanced Content */}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const newCategories = block.content.categories.filter(
                  (_, i) => i !== categoryIndex,
                );
                updateContentBlock(block.id, { categories: newCategories });
              }}
              className="text-sm mt-2 hover:text-red-600 transition-colors duration-150"
              style={{ color: DELETE_COLOR }}
            >
              Retirer ce Domaine d'Intervention {/* Enhanced Content */}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newCategories = [
              ...(block.content.categories || []),
              { name: "", services: [] },
            ];
            updateContentBlock(block.id, { categories: newCategories });
          }}
          className="text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
          style={{ color: ACCENT }}
        >
          <Plus className="h-4 w-4" /> Ajouter un Domaine d'Intervention{" "}
          {/* Enhanced Content */}
        </button>
      </div>
    </div>
  );
}

export function SponsorshipBlock({
  block,
  updateContentBlock,
  removeContentBlock,
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Titre : S'engager pour l'Espoir et la Dignité" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Brève introduction au parrainage (Ex: Kafala)" // Enhanced Content
        className={inputClasses}
        style={focusedInputStyle}
        value={block.content.description || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { description: e.target.value })
        }
      />

      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: DARK_TEXT }}>
          Nos Chemins de Solidarité
        </h4>{" "}
        {/* Enhanced Content */}
        {block.content.formulas?.map((formula, formulaIndex) => (
          <div
            key={formulaIndex}
            className="border border-gray-200 rounded-lg p-3 mb-3"
          >
            <input
              type="text"
              placeholder="Nom de la Formule de Soutien" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
              style={focusedInputStyle}
              value={formula.name || ""}
              onChange={(e) => {
                const newFormulas = [...block.content.formulas];
                newFormulas[formulaIndex] = {
                  ...newFormulas[formulaIndex],
                  name: e.target.value,
                };
                updateContentBlock(block.id, { formulas: newFormulas });
              }}
            />
            <input
              type="text"
              placeholder="Contribution et Fréquence (Ex: 350 DH/mois)" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-2"
              style={focusedInputStyle}
              value={formula.amount || ""}
              onChange={(e) => {
                const newFormulas = [...block.content.formulas];
                newFormulas[formulaIndex] = {
                  ...newFormulas[formulaIndex],
                  amount: e.target.value,
                };
                updateContentBlock(block.id, { formulas: newFormulas });
              }}
            />
            <textarea
              placeholder="Objectifs et Impact de cette formule..." // Enhanced Content
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={focusedInputStyle}
              value={formula.description || ""}
              onChange={(e) => {
                const newFormulas = [...block.content.formulas];
                newFormulas[formulaIndex] = {
                  ...newFormulas[formulaIndex],
                  description: e.target.value,
                };
                updateContentBlock(block.id, { formulas: newFormulas });
              }}
            />
            <button
              type="button"
              onClick={() => {
                const newFormulas = block.content.formulas.filter(
                  (_, i) => i !== formulaIndex,
                );
                updateContentBlock(block.id, { formulas: newFormulas });
              }}
              className="text-sm mt-2 hover:text-red-600 transition-colors duration-150"
              style={{ color: DELETE_COLOR }}
            >
              Retirer cette Formule de Soutien {/* Enhanced Content */}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newFormulas = [
              ...(block.content.formulas || []),
              { name: "", amount: "", description: "" },
            ];
            updateContentBlock(block.id, { formulas: newFormulas });
          }}
          className="text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
          style={{ color: ACCENT }}
        >
          <Plus className="h-4 w-4" /> Ajouter une Formule de Soutien{" "}
          {/* Enhanced Content */}
        </button>
      </div>
    </div>
  );
}

export function GalleryBlock({
  block,
  updateContentBlock,
  removeContentBlock,
}) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Galerie Photo : Nos Actions sur le Terrain" // Enhanced Content
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      {block.content.images?.map((image, imageIndex) => (
        <div key={imageIndex} className="flex gap-2">
          <input
            type="url"
            placeholder={`Lien vers la photo d'action`} // Enhanced Content
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={image}
            onChange={(e) => {
              const newImages = [...block.content.images];
              newImages[imageIndex] = e.target.value;
              updateContentBlock(block.id, { images: newImages });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const newImages = block.content.images.filter(
                (_, i) => i !== imageIndex,
              );
              updateContentBlock(block.id, { images: newImages });
            }}
            className="text-red-400 hover:text-red-600 px-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newImages = [...(block.content.images || []), ""];
          updateContentBlock(block.id, { images: newImages });
        }}
        className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
      >
        <Plus className="h-4 w-4" /> Ajouter une photo d'impact{" "}
        {/* Enhanced Content */}
      </button>
    </div>
  );
}

export function ImpactBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre de la Section (Ex: Témoigner de notre Impact)" // Enhanced Content
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />
      {block.content.impacts?.map((impact, impactIndex) => (
        <div key={impactIndex} className="flex gap-2">
          <input
            type="text"
            placeholder="Description du Résultat Concret" // Enhanced Content
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={impact.description || ""}
            onChange={(e) => {
              const newImpacts = [...block.content.impacts];
              newImpacts[impactIndex] = {
                ...newImpacts[impactIndex],
                description: e.target.value,
              };
              updateContentBlock(block.id, { impacts: newImpacts });
            }}
          />
          <input
            type="text"
            placeholder="Indicateur de Mesure" // Enhanced Content
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={impact.value || ""}
            onChange={(e) => {
              const newImpacts = [...block.content.impacts];
              newImpacts[impactIndex] = {
                ...newImpacts[impactIndex],
                value: e.target.value,
              };
              updateContentBlock(block.id, { impacts: newImpacts });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const newImpacts = block.content.impacts.filter(
                (_, i) => i !== impactIndex,
              );
              updateContentBlock(block.id, { impacts: newImpacts });
            }}
            className="text-red-400 hover:text-red-600 px-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newImpacts = [
            ...(block.content.impacts || []),
            { description: "", value: "" },
          ];
          updateContentBlock(block.id, { impacts: newImpacts });
        }}
        className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
      >
        <Plus className="h-4 w-4" /> Ajouter un Résultat d'Impact{" "}
        {/* Enhanced Content */}
      </button>
    </div>
  );
}

export function TeamBlock({ block, updateContentBlock, removeContentBlock }) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Notre Équipe Dévouée" // Enhanced Content
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={block.content.title || ""}
        onChange={(e) =>
          updateContentBlock(block.id, { title: e.target.value })
        }
      />

      <div>
        <h4 className="text-sm font-medium mb-2">Nos Artisans de l'Espoir</h4>{" "}
        {/* Enhanced Content */}
        {block.content.members?.map((member, memberIndex) => (
          <div
            key={memberIndex}
            className="border border-gray-200 rounded-lg p-3 mb-3"
          >
            <input
              type="text"
              placeholder="Rôle au sein de la Fondation" // Enhanced Content
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              value={member.role || ""}
              onChange={(e) => {
                const newMembers = [...block.content.members];
                newMembers[memberIndex] = {
                  ...newMembers[memberIndex],
                  role: e.target.value,
                };
                updateContentBlock(block.id, { members: newMembers });
              }}
            />

            <div className="ml-4">
              <h5 className="text-xs font-medium mb-1">
                Missions Clés et Contributions
              </h5>{" "}
              {/* Enhanced Content */}
              {member.responsibilities?.map((responsibility, respIndex) => (
                <div key={respIndex} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder="Détail de la mission" // Enhanced Content
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={responsibility}
                    onChange={(e) => {
                      const newMembers = [...block.content.members];
                      const newResponsibilities = [
                        ...newMembers[memberIndex].responsibilities,
                      ];
                      newResponsibilities[respIndex] = e.target.value;
                      newMembers[memberIndex] = {
                        ...newMembers[memberIndex],
                        responsibilities: newResponsibilities,
                      };
                      updateContentBlock(block.id, { members: newMembers });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newMembers = [...block.content.members];
                      const newResponsibilities = newMembers[
                        memberIndex
                      ].responsibilities.filter((_, i) => i !== respIndex);
                      newMembers[memberIndex] = {
                        ...newMembers[memberIndex],
                        responsibilities: newResponsibilities,
                      };
                      updateContentBlock(block.id, { members: newMembers });
                    }}
                    className="text-red-400 hover:text-red-600 px-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newMembers = [...block.content.members];
                  const newResponsibilities = [
                    ...(newMembers[memberIndex].responsibilities || []),
                    "",
                  ];
                  newMembers[memberIndex] = {
                    ...newMembers[memberIndex],
                    responsibilities: newResponsibilities,
                  };
                  updateContentBlock(block.id, { members: newMembers });
                }}
                className="text-blue-500 hover:text-blue-600 text-xs flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Ajouter une Mission{" "}
                {/* Enhanced Content */}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const newMembers = block.content.members.filter(
                  (_, i) => i !== memberIndex,
                );
                updateContentBlock(block.id, { members: newMembers });
              }}
              className="text-red-400 hover:text-red-600 text-sm mt-2"
            >
              Retirer ce Collaborateur {/* Enhanced Content */}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newMembers = [
              ...(block.content.members || []),
              { role: "", responsibilities: [] },
            ];
            updateContentBlock(block.id, { members: newMembers });
          }}
          className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Ajouter un Membre d'Équipe{" "}
          {/* Enhanced Content */}
        </button>
      </div>
    </div>
  );
}
