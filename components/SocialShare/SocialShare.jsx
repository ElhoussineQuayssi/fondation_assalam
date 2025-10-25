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
  Check,
  Mail,
  Youtube
} from "lucide-react";
import { SOCIAL_MEDIA_CONFIG, generateShareUrl, getPlatformsForContent } from "@/lib/social-media";

/**
 * Enhanced Social Media Icon Component
 */
function SocialIcon({ platform, size = 20, className = "" }) {
  const config = SOCIAL_MEDIA_CONFIG[platform];
  if (!config) return null;

  const IconComponent = getIconComponent(config.icon);
  if (!IconComponent) return null;

  return (
    <IconComponent
      size={size}
      className={className}
      style={{ color: config.color }}
    />
  );
}

/**
 * Get icon component from string name
 */
function getIconComponent(iconName) {
  switch (iconName) {
    case 'Facebook': return Facebook;
    case 'Twitter': return Twitter;
    case 'Linkedin': return Linkedin;
    case 'Instagram': return Instagram;
    case 'MessageCircle': return MessageCircle;
    case 'Mail': return Mail;
    case 'Youtube': return Youtube;
    case 'Share2': return Share2;
    default: return Share2;
  }
}

/**
 * Individual Social Share Button
 */
export function SocialShareButton({
  platform,
  data,
  variant = "icon",
  size = "medium",
  showLabel = false,
  className = ""
}) {
  const [copied, setCopied] = React.useState(false);
  const config = SOCIAL_MEDIA_CONFIG[platform];

  if (!config) return null;

  const handleShare = async () => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = data.url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    const shareUrl = config.url || generateShareUrl(platform, data);

    if (platform === 'whatsapp' || platform === 'telegram') {
      // Mobile native sharing for WhatsApp/Telegram
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const sizeClasses = {
    small: { icon: 16, button: 'px-3 py-1 text-sm' },
    medium: { icon: 20, button: 'px-4 py-2' },
    large: { icon: 24, button: 'px-6 py-3 text-lg' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  if (variant === "button") {
    return (
      <button
        onClick={handleShare}
        className={`flex items-center justify-center rounded-lg font-medium transition-all duration-200 hover:scale-105 ${currentSize.button} ${className}`}
        style={{ backgroundColor: config.color, color: 'white' }}
        aria-label={`Partager sur ${config.label}`}
      >
        <SocialIcon platform={platform} size={currentSize.icon} className="mr-2" />
        {showLabel && config.label}
        {platform === 'copy' && copied && (
          <>
            <Check className="mr-2" size={currentSize.icon} />
            Copié!
          </>
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleShare}
        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${className}`}
        style={{ backgroundColor: `${config.color}15`, color: config.color }}
        aria-label={`Partager sur ${config.label}`}
        title={`Partager sur ${config.label}`}
      >
        {platform === 'copy' && copied ? (
          <Check size={currentSize.icon} />
        ) : (
          <SocialIcon platform={platform} size={currentSize.icon} />
        )}
      </button>
    );
  }

  // Default icon variant
  return (
    <button
      onClick={handleShare}
      className={`flex items-center transition-colors hover:opacity-80 ${className}`}
      style={{ color: config.color }}
      aria-label={`Partager sur ${config.label}`}
      title={`Partager sur ${config.label}`}
    >
      {platform === 'copy' && copied ? (
        <>
          <Check size={currentSize.icon} className="mr-2" />
          {showLabel && "Copié!"}
        </>
      ) : (
        <>
          <SocialIcon platform={platform} size={currentSize.icon} className="mr-2" />
          {showLabel && config.label}
        </>
      )}
    </button>
  );
}

/**
 * Social Share Buttons Group Component
 */
export function SocialShareGroup({
  data,
  variant = "icon",
  size = "medium",
  platforms,
  contentType = "general",
  className = "",
  showLabels = false
}) {
  const defaultPlatforms = getPlatformsForContent(contentType);
  const activePlatforms = platforms || defaultPlatforms;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {activePlatforms.map((platform) => (
        <SocialShareButton
          key={platform}
          platform={platform}
          data={data}
          variant={variant}
          size={size}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

/**
 * Social Media Links Component (for footer, header, etc.)
 */
export function SocialMediaLinks({
  platforms = ["facebook", "twitter", "instagram", "linkedin"],
  variant = "compact",
  size = "medium",
  className = ""
}) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {platforms.map((platform) => {
        const config = SOCIAL_MEDIA_CONFIG[platform];
        if (!config || !config.url) return null;

        return (
          <a
            key={platform}
            href={config.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-200 hover:scale-110"
            aria-label={`Suivez-nous sur ${config.label}`}
            title={`Suivez-nous sur ${config.label}`}
          >
            <div
              className={`p-2 rounded-full transition-colors ${variant === 'compact' ? '' : 'hover:bg-gray-100'}`}
              style={{ color: config.color }}
            >
              <SocialIcon platform={platform} size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
            </div>
          </a>
        );
      })}
    </div>
  );
}

/**
 * Floating Action Share Component
 */
export function FloatingActionShare({ data, className = "" }) {
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
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-3">
        <SocialShareGroup
          data={data}
          variant="compact"
          size="small"
          platforms={["facebook", "twitter", "whatsapp", "copy"]}
          className="flex-col space-y-1"
        />
      </div>
    </div>
  );
}

/**
 * Inline Share Component for content
 */
export function InlineShare({ data, className = "" }) {
  return (
    <div className={`border-t pt-6 ${className}`}>
      <h4 className="text-lg font-semibold mb-4 text-gray-900">
        Partager cet article
      </h4>
      <SocialShareGroup
        data={data}
        variant="button"
        platforms={["facebook", "twitter", "linkedin", "whatsapp", "copy"]}
        showLabels={true}
        className="justify-center md:justify-start"
      />
    </div>
  );
}
