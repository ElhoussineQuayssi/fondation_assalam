/**
 * Lazy Loading Wrapper Component
 * Provides consistent lazy loading with loading states and error boundaries
 */

"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

// Default loading component
const DefaultLoader = () => (
  <div className="flex justify-center items-center py-8">
    <LoadingSpinner size="medium" />
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col justify-center items-center py-8 text-center">
    <div className="text-red-500 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
    <p className="text-gray-600 mb-4">Une erreur s'est produite lors du chargement du composant.</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Réessayer
    </button>
  </div>
);

// Lazy load component with error boundary
export const LazyLoad = ({ component, fallback = <DefaultLoader />, errorFallback = ErrorFallback }) => {
  const LazyComponent = dynamic(() => import(`@/components/${component}`), {
    loading: () => fallback,
    ssr: false,
  });

  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
};

// Preload critical components
export const preloadComponents = (components) => {
  components.forEach(component => {
    // Preload component in background
    import(`@/components/${component}`);
  });
};

export default LazyLoad;
