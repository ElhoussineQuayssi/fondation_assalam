"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff, Server, AlertCircle } from 'lucide-react';

// Base error fallback component
export const ErrorFallback = ({
  error,
  resetError,
  title = 'Une erreur s\'est produite',
  message = 'Nous nous excusons pour ce désagrément. Veuillez réessayer.',
  variant = 'default',
  showDetails = false,
  className = ''
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'network':
        return <WifiOff className="w-8 h-8 text-red-600" />;
      case 'server':
        return <Server className="w-8 h-8 text-red-600" />;
      case 'generic':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-red-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 text-center max-w-md mx-auto ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {getIcon()}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 mb-6">
        {message}
      </p>

      <div className="space-y-3">
        {resetError && (
          <button
            onClick={resetError}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        )}

        <button
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>
      </div>

      {showDetails && error && process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
            Détails de l'erreur
          </summary>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {error.toString()}
          </pre>
        </details>
      )}
    </div>
  );
};

// Network error fallback
export const NetworkErrorFallback = ({ resetError }) => (
  <ErrorFallback
    title="Problème de connexion"
    message="Vérifiez votre connexion internet et réessayez."
    variant="network"
    resetError={resetError}
  />
);

// Server error fallback
export const ServerErrorFallback = ({ resetError }) => (
  <ErrorFallback
    title="Erreur du serveur"
    message="Nos serveurs rencontrent des difficultés. Veuillez patienter et réessayer dans quelques instants."
    variant="server"
    resetError={resetError}
  />
);

// API error fallback for data fetching
export const ApiErrorFallback = ({ resetError, resourceName = 'les données' }) => (
  <ErrorFallback
    title={`Erreur de chargement ${resourceName}`}
    message={`Impossible de charger ${resourceName}. Vérifiez votre connexion et réessayez.`}
    variant="generic"
    resetError={resetError}
  />
);

// Inline error for forms and small components
export const InlineError = ({
  message,
  onRetry,
  className = ''
}) => {
  if (!message) return null;

  return (
    <div className={`flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
      <span className="text-sm text-red-700 flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

// Loading error for async operations
export const LoadingError = ({
  message = 'Erreur lors du chargement',
  onRetry,
  className = ''
}) => (
  <div className={`flex flex-col items-center justify-center py-8 space-y-3 ${className}`}>
    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
      <AlertTriangle className="w-6 h-6 text-red-600" />
    </div>
    <p className="text-gray-600 text-center">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    )}
  </div>
);

export default ErrorFallback;
