"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

// Enhanced LoadingSpinner with different sizes and variants
export const LoadingSpinner = ({
  size = 'medium',
  variant = 'default',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const variantColors = {
    default: '#6495ED', // Primary blue
    white: '#ffffff',
    gray: '#9CA3AF'
  };

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <Loader2
        className={`${sizeClasses[size]} animate-spin`}
        style={{ color: variantColors[variant] }}
      />
    </div>
  );
};

// Skeleton loading components for different content types
export const SkeletonCard = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`bg-gray-200 rounded h-4 ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      ></div>
    ))}
  </div>
);

export const SkeletonCircle = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`animate-pulse bg-gray-200 rounded-full ${sizeClasses[size]} ${className}`}></div>
  );
};

// Project card skeleton
export const ProjectCardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
    <div className="bg-gray-200 h-48"></div>
    <div className="p-6 space-y-3">
      <div className="bg-gray-200 rounded h-6 w-3/4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded h-4"></div>
        <div className="bg-gray-200 rounded h-4 w-5/6"></div>
      </div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
    </div>
  </div>
);

// Blog post skeleton
export const BlogPostSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
    <div className="bg-gray-200 h-48"></div>
    <div className="p-6 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="bg-gray-200 rounded-full h-4 w-16"></div>
        <div className="bg-gray-200 rounded h-4 w-20"></div>
      </div>
      <div className="bg-gray-200 rounded h-6 w-4/5"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded h-4"></div>
        <div className="bg-gray-200 rounded h-4 w-5/6"></div>
      </div>
    </div>
  </div>
);

// Full page loading component with enhanced animation
export const PageLoading = ({ message = 'Chargement en cours...' }) => (
  <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 animate-pulse"></div>

    {/* Main loading content */}
    <div className="relative z-10 flex flex-col items-center">
      {/* Animated logo/icon */}
      <div className="mb-8">
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full transform -translate-x-2 -translate-y-2"></div>
          </div>
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          {/* Center dot */}
          <div className="absolute inset-8 bg-blue-600 rounded-full"></div>
        </div>
      </div>

      {/* Loading text with fade animation */}
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-700 mb-2 animate-fade-in">
          {message}
        </p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>

    {/* Progress bar at bottom */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64">
      <div className="bg-gray-200 rounded-full h-1">
        <div className="bg-blue-500 h-1 rounded-full animate-progress"></div>
      </div>
    </div>
  </div>
);

// Inline loading for buttons and small areas
export const InlineLoading = ({ message = 'Chargement...' }) => (
  <div className="flex items-center justify-center space-x-2 py-2">
    <LoadingSpinner size="small" />
    <span className="text-sm text-gray-600">{message}</span>
  </div>
);

export default LoadingSpinner;
