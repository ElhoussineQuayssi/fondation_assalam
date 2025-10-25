"use client";

import React from "react";
import { Share2 } from "lucide-react";

/**
 * Simple Social Share Component - Alternative to complex social libraries
 */
export function SimpleSocialShare({
  title,
  description,
  url,
  className = ""
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "#1877F2"
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "#1DA1F2"
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "#0A66C2"
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      color: "#25D366"
    }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 mr-2">Partager:</span>
      <div className="flex gap-1">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: `${link.color}15`, color: link.color }}
            title={`Partager sur ${link.name}`}
          >
            <span className="text-xs font-medium">{link.name[0]}</span>
          </a>
        ))}
        <button
          onClick={handleCopy}
          className="p-2 rounded-full hover:opacity-80 transition-opacity bg-gray-100 text-gray-600"
          title="Copier le lien"
        >
          {copied ? "✓" : <Share2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

/**
 * Floating Share Button Component - Simplified version
 */
export function FloatingShareButton({
  title,
  description,
  slug,
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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : "https://www.fondationassalam.org";
  const fullUrl = `${baseUrl}${slug ? `/${slug}` : ''}`;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-3">
        <SimpleSocialShare
          title={title}
          description={description}
          url={fullUrl}
        />
      </div>
    </div>
  );
}

export default SimpleSocialShare;
