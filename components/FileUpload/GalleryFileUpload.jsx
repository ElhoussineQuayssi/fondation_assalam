import { useState } from "react";
import FileUpload from "./FileUpload";

export default function GalleryFileUpload({
  title = "Galerie d'Images",
  gallery,
  onGalleryChange,
  maxFiles = 10,
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesChange = async (files) => {
    console.log("GalleryFileUpload: Starting upload process for", files.length, "files");
    setIsUploading(true);
    try {
      const uploadedUrls = [];

      for (const file of files) {
        console.log("GalleryFileUpload: Processing file:", file.name, "size:", file.size, "type:", file.type);
        const formData = new FormData();
        formData.append("image", file);

        console.log("GalleryFileUpload: Making fetch request to /api/upload");
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        console.log("GalleryFileUpload: Response status:", response.status, "headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const error = await response.json();
          console.error("GalleryFileUpload: Upload failed with error:", error);
          throw new Error(error.error || "Upload failed");
        }

        const result = await response.json();
        console.log("GalleryFileUpload: Upload successful, received URL:", result.filePath);
        uploadedUrls.push(result.filePath);
      }

      // Add new URLs to existing gallery
      const newGallery = [...gallery, ...uploadedUrls];
      console.log("GalleryFileUpload: Updated gallery with", newGallery.length, "total images");
      onGalleryChange(newGallery);
    } catch (error) {
      console.error("GalleryFileUpload: Upload error:", error);
      alert(`Erreur lors du téléchargement: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    onGalleryChange(newGallery);
  };

  // Convert gallery URLs to file objects for FileUpload display
  const mockFiles = gallery.map((url, index) => ({
    name: `Image ${index + 1}`,
    size: 0, // We don't have size info for URLs
    type: "image/*",
    url: url, // Add URL for display
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {title}
      </h3>

      <FileUpload
        title=""
        files={mockFiles}
        onFilesChange={handleFilesChange}
        acceptedFileTypes="image/*"
        maxFiles={maxFiles}
        allowMultiple={true}
        dropzoneClassName=""
        fileItemClassName=""
      />

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Images dans la galerie ({gallery.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {gallery.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image || "/placeholder.svg?height=100&width=100"}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Retirer cette image"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {gallery.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          Aucune image dans la galerie.
        </p>
      )}

      {isUploading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-blue-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Téléchargement en cours...
          </div>
        </div>
      )}
    </div>
  );
}