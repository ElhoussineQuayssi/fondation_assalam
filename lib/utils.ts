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
    // Fetch fresh gallery data every time for true randomness
    const response = await fetch('/api/gallery');
    if (!response.ok) throw new Error('Failed to fetch gallery data');
    const data = await response.json();

    // Flatten all images from all projects into a single array
    const allImages = Object.values(data).flat() as Array<{ name: string; url: { publicUrl: string } }>;

    if (allImages.length === 0) {
      return '/uploads/image-1760666702704-b102b73136efb554f15ded5bd5bac4d6.png'; // fallback to existing gallery image
    }

    // Select a truly random image
    const randomIndex = Math.floor(Math.random() * allImages.length);
    return allImages[randomIndex].url.publicUrl;
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return '/uploads/image-1760666702704-b102b73136efb554f15ded5bd5bac4d6.png';
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
      // Shuffle the cached images randomly
      const shuffled = [...cachedImages].sort(() => Math.random() - 0.5);
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
          return Array(count).fill('/uploads/image-1760666702704-b102b73136efb554f15ded5bd5bac4d6.png');
        }

        // Shuffle images randomly for server-side rendering
        const shuffled = [...allImages].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count).map(img => img.url.publicUrl);
      } catch (error) {
        console.error('Error fetching gallery data server-side:', error);
        return Array(count).fill('/uploads/image-1760666702704-b102b73136efb554f15ded5bd5bac4d6.png');
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

    // Shuffle images randomly for client-side
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(img => img.url.publicUrl);
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return Array(count).fill('/placeholder.svg?height=400&width=600');
  }
}
