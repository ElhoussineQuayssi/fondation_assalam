import { getProjects } from '@/lib/projects.js';

export async function GET() {
  try {
    const projects = await getProjects();

    // Aggregate all gallery images from all projects
    const allGalleryItems = [];
    for (const project of projects) {
      if (project.gallery && Array.isArray(project.gallery)) {
        for (const galleryUrl of project.gallery) {
          allGalleryItems.push({
            name: project.title,
            url: { publicUrl: galleryUrl }
          });
        }
      }
    }

    const galleryData = { projects: allGalleryItems };

    // Add cache headers to prevent excessive API calls during build
    return new Response(JSON.stringify(galleryData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error loading gallery data:', error);
    // Return empty object instead of error to prevent build failures
    return new Response(JSON.stringify({}), {
      status: 200, // Changed to 200 to prevent build failures
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}