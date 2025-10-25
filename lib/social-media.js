/**
 * Social Media Configuration and Utilities
 * Provides centralized social media settings and helper functions
 */

export const SOCIAL_MEDIA_CONFIG = {
  facebook: {
    url: "https://www.facebook.com/fondationassalam",
    color: "#1877F2",
    label: "Facebook",
    icon: "Facebook"
  },
  twitter: {
    url: "https://twitter.com/fondationassalam",
    color: "#1DA1F2",
    label: "X (Twitter)",
    icon: "Twitter"
  },
  instagram: {
    url: "https://www.instagram.com/fondationassalam",
    color: "#E4405F",
    label: "Instagram",
    icon: "Instagram"
  },
  linkedin: {
    url: "https://www.linkedin.com/company/fondation-assalam",
    color: "#0A66C2",
    label: "LinkedIn",
    icon: "Linkedin"
  },
  whatsapp: {
    url: null, // Dynamic generation
    color: "#25D366",
    label: "WhatsApp",
    icon: "MessageCircle"
  },
  telegram: {
    url: null, // Dynamic generation
    color: "#0088cc",
    label: "Telegram",
    icon: "MessageCircle"
  },
  youtube: {
    url: "https://www.youtube.com/@fondationassalam",
    color: "#FF0000",
    label: "YouTube",
    icon: "Youtube"
  },
  email: {
    url: "mailto:contact@fondationassalam.org",
    color: "#6B7280",
    label: "Email",
    icon: "Mail"
  }
};

/**
 * Generate social sharing URLs
 */
export function generateShareUrl(platform, data) {
  const { title, description, url, image } = data;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${encodedTitle}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=FondationAssalam`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle} - ${encodedUrl}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    case 'email':
      return `mailto:?subject=${encodedTitle}&body=Découvrez cet article : ${encodedUrl}%0A%0A${encodedDescription}`;
    default:
      return url;
  }
}

/**
 * Get social media platforms for a specific content type
 */
export function getPlatformsForContent(contentType = 'general') {
  const basePlatforms = ['facebook', 'twitter', 'linkedin', 'whatsapp'];

  switch (contentType) {
    case 'blog':
      return [...basePlatforms, 'telegram', 'copy'];
    case 'project':
      return [...basePlatforms, 'email', 'copy'];
    case 'general':
    default:
      return basePlatforms;
  }
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags(data) {
  const {
    title,
    description,
    url,
    image,
    type = 'website',
    siteName = 'Fondation Assalam'
  } = data;

  return {
    title,
    description,
    url,
    siteName,
    images: image ? [{ url: image, alt: title }] : [],
    type,
    locale: 'fr_FR'
  };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(data) {
  const {
    title,
    description,
    url,
    image,
    creator = '@FondationAssalam'
  } = data;

  return {
    card: 'summary_large_image',
    title,
    description,
    creator,
    images: image ? [image] : [],
    url
  };
}
