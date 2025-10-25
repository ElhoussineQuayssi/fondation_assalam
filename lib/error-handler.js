"use client";

import { toast } from 'react-hot-toast';

// Global error handler for API calls
export class ApiErrorHandler {
  static handleError(error, context = '', showToast = true) {
    let errorMessage = 'Une erreur inattendue s\'est produite';
    let errorType = 'unknown';

    // Determine error type and message
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      errorType = 'network';
      errorMessage = 'Problème de connexion. Vérifiez votre connexion internet.';
    } else if (error.status === 404) {
      errorType = 'not_found';
      errorMessage = context ? `${context} introuvable` : 'Ressource introuvable';
    } else if (error.status === 403) {
      errorType = 'forbidden';
      errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 401) {
      errorType = 'unauthorized';
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status >= 500) {
      errorType = 'server';
      errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
    } else if (error.status >= 400) {
      errorType = 'client';
      errorMessage = error.message || 'Données invalides';
    } else if (error.message) {
      errorMessage = error.message;
    }

    const errorInfo = {
      type: errorType,
      message: errorMessage,
      context,
      timestamp: new Date().toISOString(),
      originalError: error
    };

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorInfo);
    }

    // Show toast notification if requested
    if (showToast) {
      this.showErrorToast(errorMessage);
    }

    // Here you could also send to error reporting service
    // this.reportError(errorInfo);

    return errorInfo;
  }

  static showErrorToast(message) {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        color: '#DC2626'
      }
    });
  }

  static showSuccessToast(message) {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        color: '#16A34A'
      }
    });
  }

  static showInfoToast(message) {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#EFF6FF',
        border: '1px solid #DBEAFE',
        color: '#1D4ED8'
      }
    });
  }
}

// Retry mechanism for failed requests
export class RetryHandler {
  static async withRetry(fn, options = {}) {
    const {
      maxRetries = 3,
      delay = 1000,
      backoffFactor = 2,
      shouldRetry = (error) => true
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Don't retry on the last attempt
        if (attempt === maxRetries) break;

        // Check if we should retry this error
        if (!shouldRetry(error)) break;

        // Wait before retrying with exponential backoff
        const waitTime = delay * Math.pow(backoffFactor, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        if (process.env.NODE_ENV === 'development') {
          console.log(`Retry attempt ${attempt} after ${waitTime}ms delay`);
        }
      }
    }

    throw lastError;
  }

  static shouldRetryNetworkError(error) {
    return error.name === 'NetworkError' ||
           error.message?.includes('fetch') ||
           error.status >= 500;
  }
}

// Enhanced fetch wrapper with error handling and retry
export const apiRequest = async (url, options = {}) => {
  const {
    retry = true,
    showToast = true,
    context = '',
    ...fetchOptions
  } = options;

  const makeRequest = async () => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers
        },
        ...fetchOptions
      });

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        error.name = 'NetworkError';
      }
      throw error;
    }
  };

  try {
    if (retry) {
      return await RetryHandler.withRetry(makeRequest, {
        shouldRetry: RetryHandler.shouldRetryNetworkError
      });
    } else {
      return await makeRequest();
    }
  } catch (error) {
    const errorInfo = ApiErrorHandler.handleError(error, context, showToast);
    throw errorInfo;
  }
};

export default ApiErrorHandler;
