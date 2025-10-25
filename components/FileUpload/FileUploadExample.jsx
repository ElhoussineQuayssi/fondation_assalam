import { useState } from "react";
import FileUpload from "../FileUpload/FileUpload";

export default function FileUploadExample() {
  const [projectFiles, setProjectFiles] = useState([]);
  const [blogFiles, setBlogFiles] = useState([]);

  const handleProjectFilesChange = (files) => {
    setProjectFiles(files);
    // Here you would typically upload files to your server
    console.log("Project files updated:", files);
  };

  const handleBlogFilesChange = (files) => {
    setBlogFiles(files);
    // Here you would typically upload files to your server
    console.log("Blog files updated:", files);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Exemple d'utilisation du composant FileUpload
      </h1>

      {/* Project Files Upload */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Fichiers du projet</h2>
        <FileUpload
          title="Images et documents du projet"
          files={projectFiles}
          onFilesChange={handleProjectFilesChange}
          acceptedFileTypes="image/*,.pdf,.doc,.docx"
          maxFileSize={10 * 1024 * 1024} // 10MB
          maxFiles={15}
          allowMultiple={true}
        />
      </div>

      {/* Blog Files Upload */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Fichiers du blog</h2>
        <FileUpload
          title="Image principale du blog"
          files={blogFiles}
          onFilesChange={handleBlogFilesChange}
          acceptedFileTypes="image/*"
          maxFileSize={5 * 1024 * 1024} // 5MB
          maxFiles={1}
          allowMultiple={false}
          dropzoneClassName="bg-green-50 border-green-300 hover:border-green-400"
        />
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Informations de débogage:</h3>
        <p>Fichiers projet: {projectFiles.length}</p>
        <p>Fichiers blog: {blogFiles.length}</p>
      </div>
    </div>
  );
}
