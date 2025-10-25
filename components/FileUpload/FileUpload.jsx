import { Upload, Trash2, File, Image, FileText } from "lucide-react";
import { useState, useRef } from "react";

export default function FileUpload({
  title,
  files,
  onFilesChange,
  acceptedFileTypes = "image/*,.pdf,.doc,.docx",
  maxFileSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  dropzoneClassName = "",
  fileItemClassName = "",
  allowMultiple = true,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getFileIcon = (file) => {
    if (file.type?.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      alert(`Le fichier ${file.name} dépasse la taille maximale autorisée (${formatFileSize(maxFileSize)})`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(validateFile);

    if (files.length + validFiles.length > maxFiles) {
      alert(`Vous ne pouvez pas sélectionner plus de ${maxFiles} fichiers`);
      return;
    }

    const newFiles = [...files, ...validFiles];
    onFilesChange(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${dropzoneClassName}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedFileTypes}
          onChange={(e) => {
            if (e.target.files.length > 0) {
              handleFileSelect(e.target.files);
            }
            e.target.value = ''; // Reset input
          }}
          className="hidden"
        />

        <Upload className={`mx-auto h-8 w-8 mb-2 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />

        <p className={`text-sm ${isDragOver ? "text-blue-600" : "text-gray-600"}`}>
          {isDragOver
            ? "Déposez les fichiers ici"
            : "Glissez et déposez vos fichiers ici, ou cliquez pour sélectionner"}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Types acceptés: {acceptedFileTypes} • Taille max: {formatFileSize(maxFileSize)}
          {allowMultiple && ` • Jusqu'à ${maxFiles} fichiers`}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Fichiers sélectionnés ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${fileItemClassName}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Retirer ce fichier"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          Aucun fichier sélectionné.
        </p>
      )}
    </div>
  );
}
