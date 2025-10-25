"use client";

import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { generateShareUrl, getPlatformsForContent } from "@/lib/social-media";

/**
 * Enhanced Share Button Component with multiple platforms and copy functionality
 */
function ShareButton({
  platform,
  slug,
  title,
  excerpt,
  description,
  image,
  url: customUrl,
  variant = "icon", // "icon", "button", "compact"
  showLabel = false,
  className = ""
}) {
  const [copied, setCopied] = React.useState(false);

  // Use a safe fallback for window.location.origin for server-side rendering
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : "https://www.fondationassalam.org";
  const fullUrl = customUrl || `${baseUrl}${slug ? `/${slug}` : ''}`;

  const shareData = {
    title: title || "Fondation Assalam - Pour un avenir meilleur",
    description: description || excerpt || "Fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc.",
    url: fullUrl,
    image: image || `${baseUrl}/og-image.jpg`
  };

  const shareUrl = generateShareUrl(platform, shareData);

  const platformIcons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
    whatsapp: MessageCircle,
    telegram: MessageCircle,
    email: Share2,
    copy: Copy
  };

  const platformColors = {
    facebook: "bg-blue-600",
    twitter: "bg-sky-500",
    linkedin: "bg-blue-700",
    instagram: "bg-pink-500",
    whatsapp: "bg-green-500",
    telegram: "bg-blue-500",
    email: "bg-gray-500",
    copy: "bg-gray-500"
  };

  const platformLabels = {
    facebook: "Facebook",
    twitter: "X (Twitter)",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    email: "Email",
    copy: "Copier"
  };

  const platformNames = {
    facebook: "Facebook",
    twitter: "X (Twitter)",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    email: "Email",
    copy: "Copier le lien"
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      handleCopy();
      return;
    }

    const url = shareUrl;
    if (url) {
      if (platform === 'whatsapp' || platform === 'telegram') {
        // Mobile native sharing for WhatsApp/Telegram
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const Icon = platformIcons[platform];
  const colorClass = platformColors[platform];

  if (variant === "button") {
    return (
      <button
        onClick={() => handleShare(platform)}
        className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${colorClass} text-white ${className}`}
        aria-label={`Partager sur ${platformNames[platform]}`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {showLabel && platformLabels[platform]}
        {platform === 'copy' && copied && (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copié!
          </>
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={() => handleShare(platform)}
        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${colorClass}/15 ${colorClass.replace('bg-', 'text-')} ${className}`}
        aria-label={`Partager sur ${platformNames[platform]}`}
        title={`Partager sur ${platformNames[platform]}`}
      >
        {platform === 'copy' && copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </button>
    );
  }

  // Default icon variant
  return (
    <button
      onClick={() => handleShare(platform)}
      className={`flex items-center transition-colors hover:opacity-80 ${colorClass.replace('bg-', 'text-')} ${className}`}
      aria-label={`Partager sur ${platformNames[platform]}`}
      title={`Partager sur ${platformNames[platform]}`}
    >
      {platform === 'copy' && copied ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          {showLabel && "Copié!"}
        </>
      ) : (
        <>
          <Icon className="w-5 h-5 mr-2" />
          {showLabel && platformLabels[platform]}
        </>
      )}
    </button>
  );
}

/**
 * Social Share Buttons Group Component
 */
export function SocialShareButtons({
  title,
  description,
  slug,
  image,
  url,
  variant = "icon",
  platforms = ["facebook", "twitter", "linkedin", "whatsapp"],
  className = "",
  showLabels = false
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {platforms.map((platform) => (
        <ShareButton
          key={platform}
          platform={platform}
          slug={slug}
          title={title}
          description={description}
          image={image}
          url={url}
          variant={variant}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

/**
 * Floating Share Button Component
 */
export function FloatingShareButton({
  title,
  description,
  slug,
  image,
  url,
  className = ""
}) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
        <SocialShareButtons
          title={title}
          description={description}
          slug={slug}
          image={image}
          url={url}
          variant="compact"
          platforms={["facebook", "twitter", "whatsapp", "copy"]}
        />
      </div>
    </div>
  );
}

export default ShareButton;
