export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function getRandomGalleryImage(): Promise<string> {
  try {
    // Use cached images if available (client-side only)
    if (typeof window !== 'undefined' && (window as any).galleryImagesCache) {
      const cachedImages = (window as any).galleryImagesCache;
      if (cachedImages.length === 0) {
        return '/placeholder.svg?height=400&width=600'; // fallback
      }
      const randomIndex = Math.floor(Math.random() * cachedImages.length);
      return cachedImages[randomIndex].url.publicUrl;
    }

    // During server-side rendering, use API route instead of direct file access
    if (typeof window === 'undefined') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/gallery`);
        if (!response.ok) throw new Error('Failed to fetch gallery data');
        const data = await response.json();

        // Flatten all images from all projects into a single array
        const allImages = Object.values(data).flat() as Array<{ name: string; url: { publicUrl: string } }>;

        if (allImages.length === 0) {
          return '/placeholder.svg?height=400&width=600'; // fallback
        }

        const randomIndex = Math.floor(Math.random() * allImages.length);
        return allImages[randomIndex].url.publicUrl;
      } catch (error) {
        console.error('Error fetching gallery data server-side:', error);
        return '/placeholder.svg?height=400&width=600';
      }
    }

    // Client-side: use API and cache the result
    const response = await fetch('/api/gallery');
    if (!response.ok) throw new Error('Failed to fetch gallery data');
    const data = await response.json();

    // Flatten all images from all projects into a single array
    const allImages = Object.values(data).flat() as Array<{ name: string; url: { publicUrl: string } }>;

    // Cache the images for future use
    (window as any).galleryImagesCache = allImages;

    if (allImages.length === 0) {
      return '/placeholder.svg?height=400&width=600'; // fallback
    }

    const randomIndex = Math.floor(Math.random() * allImages.length);
    return allImages[randomIndex].url.publicUrl;
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return '/placeholder.svg?height=400&width=600';
  }
}

export async function getRandomGalleryImages(count: number): Promise<string[]> {
  try {
    // Use cached images if available (client-side only)
    if (typeof window !== 'undefined' && (window as any).galleryImagesCache) {
      const cachedImages = (window as any).galleryImagesCache;
      if (cachedImages.length === 0) {
        return Array(count).fill('/placeholder.svg?height=400&width=600');
      }
      // Use deterministic shuffling for SSR compatibility
      const shuffled = [...cachedImages].sort((a, b) => a.name.localeCompare(b.name));
      return shuffled.slice(0, count).map((img: any) => img.url.publicUrl);
    }

    // During server-side rendering, use API route instead of direct file access
    if (typeof window === 'undefined') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/gallery`);
        if (!response.ok) throw new Error('Failed to fetch gallery data');
        const data = await response.json();

        const allImages = Object.values(data).flat() as Array<{ name: string; url: { publicUrl: string } }>;

        if (allImages.length === 0) {
          return Array(count).fill('/placeholder.svg?height=400&width=600');
        }

        // Use deterministic sorting instead of random for SSR compatibility
        const sorted = [...allImages].sort((a, b) => a.name.localeCompare(b.name));
        return sorted.slice(0, count).map(img => img.url.publicUrl);
      } catch (error) {
        console.error('Error fetching gallery data server-side:', error);
        return Array(count).fill('/placeholder.svg?height=400&width=600');
      }
    }

    // Client-side: use API and cache the result
    const response = await fetch('/api/gallery');
    if (!response.ok) throw new Error('Failed to fetch gallery data');
    const data = await response.json();
    const allImages = Object.values(data).flat() as Array<{ name: string; url: { publicUrl: string } }>;

    // Cache the images for future use
    (window as any).galleryImagesCache = allImages;

    if (allImages.length === 0) {
      return Array(count).fill('/placeholder.svg?height=400&width=600');
    }

    // Use deterministic sorting for consistency between SSR and client
    const sorted = [...allImages].sort((a, b) => a.name.localeCompare(b.name));
    return sorted.slice(0, count).map(img => img.url.publicUrl);
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return Array(count).fill('/placeholder.svg?height=400&width=600');
  }
}
