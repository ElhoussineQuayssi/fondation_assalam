# FileUpload Component

Un composant de téléchargement de fichiers inspiré du composant CategoryTags, conçu pour les formulaires de projets et de blogs de la Fondation Assalam.

## Fonctionnalités

- **Glisser-déposer** : Interface intuitive de drag & drop
- **Sélection multiple** : Support pour plusieurs fichiers (configurable)
- **Validation** : Vérification de la taille et du type de fichiers
- **Prévisualisation** : Affichage des fichiers sélectionnés avec icônes
- **Suppression individuelle** : Possibilité de retirer des fichiers avant l'envoi
- **Interface française** : Libellés en français pour une meilleure UX
- **Personnalisable** : Props pour adapter les couleurs et le comportement

## Utilisation de base

```jsx
import FileUpload from "../FileUpload/FileUpload";

function MyForm() {
  const [files, setFiles] = useState([]);

  return (
    <FileUpload
      title="Télécharger des fichiers"
      files={files}
      onFilesChange={setFiles}
      acceptedFileTypes="image/*,.pdf"
      maxFileSize={5 * 1024 * 1024} // 5MB
      maxFiles={10}
    />
  );
}
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `title` | `string` | - | Titre affiché en haut du composant |
| `files` | `File[]` | - | Array des fichiers sélectionnés |
| `onFilesChange` | `function` | - | Callback appelé quand les fichiers changent |
| `acceptedFileTypes` | `string` | `"image/*,.pdf,.doc,.docx"` | Types MIME acceptés |
| `maxFileSize` | `number` | `5 * 1024 * 1024` | Taille max en octets (5MB par défaut) |
| `maxFiles` | `number` | `10` | Nombre maximum de fichiers |
| `allowMultiple` | `boolean` | `true` | Autoriser la sélection multiple |
| `dropzoneClassName` | `string` | `""` | Classes CSS additionnelles pour la zone de drop |
| `fileItemClassName` | `string` | `""` | Classes CSS additionnelles pour chaque fichier |

## Exemples d'utilisation

### Pour les projets (fichiers multiples)

```jsx
<FileUpload
  title="Images et documents du projet"
  files={projectFiles}
  onFilesChange={setProjectFiles}
  acceptedFileTypes="image/*,.pdf,.doc,.docx"
  maxFileSize={10 * 1024 * 1024} // 10MB
  maxFiles={15}
/>
```

### Pour les blogs (image unique)

```jsx
<FileUpload
  title="Image principale du blog"
  files={blogImage}
  onFilesChange={setBlogImage}
  acceptedFileTypes="image/*"
  maxFileSize={5 * 1024 * 1024} // 5MB
  maxFiles={1}
  allowMultiple={false}
/>
```

## Gestion des fichiers

Le composant gère automatiquement :
- La validation des types de fichiers
- La vérification des tailles
- La limitation du nombre de fichiers
- L'affichage des erreurs à l'utilisateur

Les fichiers sont stockés dans l'état du composant parent sous forme d'array de `File` objects, prêts à être envoyés au serveur.

## Intégration avec les formulaires

```jsx
function ProjectForm() {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Créer FormData pour l'upload
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      // Envoyer au serveur
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Succès
        setFiles([]);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FileUpload
        title="Fichiers du projet"
        files={files}
        onFilesChange={setFiles}
      />

      <button
        type="submit"
        disabled={isSubmitting || files.length === 0}
      >
        {isSubmitting ? 'Envoi en cours...' : 'Créer le projet'}
      </button>
    </form>
  );
}
```

## Styles et thème

Le composant suit le système de design de la Fondation Assalam :
- Palette de couleurs cohérente
- Typographie uniforme
- Animations et transitions fluides
- Design responsive
- Accessibilité respectée
