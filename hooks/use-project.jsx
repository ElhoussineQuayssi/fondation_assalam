import { useState, useEffect, useCallback } from "react";
import { getSession } from "../lib/auth";
import { apiRequest, ApiErrorHandler } from "../lib/error-handler";

// Hook for authentication state management
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession();
      setUser(session);
    } catch (err) {
      const errorInfo = ApiErrorHandler.handleError(err, 'Authentification', false);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/session", { method: "POST" });
      if (response.ok) {
        setUser(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    refreshAuth: checkAuth,
  };
}

// Hook for managing project data with caching and enhanced error handling
export function useProjects() {
  // ❌ FIX 1: Change initial state to null and loading to true
  const [projects, setProjects] = useState(null); 
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('[DEBUG] useProjects: Starting API request to /api/projects');
      const data = await apiRequest("/api/projects", {
        context: 'Projets',
        retry: true
      });
      console.log('[DEBUG] useProjects: API response data:', {
        data,
        dataType: typeof data,
        dataLength: data?.length,
        isArray: Array.isArray(data),
        hasProjects: data?.projects,
        projectsType: typeof data?.projects,
        projectsLength: data?.projects?.length,
        projectsIsArray: Array.isArray(data?.projects)
      });

      // Extract projects array from API response structure
      const projectsArray = data?.projects || data || [];
      setProjects(projectsArray);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('[DEBUG] useProjects: API request failed:', err);
      const errorInfo = ApiErrorHandler.handleError(err, 'Projets');
      setError(errorInfo.message);
      
      // ❌ FIX 2: Set projects to null on error to trigger fallback/error UI
      setProjects(null); 
      
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (projectData) => {
      try {
        const result = await apiRequest("/api/projects", {
          method: "POST",
          body: JSON.stringify(projectData),
          context: 'Création de projet'
        });

        if (result.success) {
          await fetchProjects(); // Refresh the list
          ApiErrorHandler.showSuccessToast('Projet créé avec succès');
          return { success: true };
        }
        return { success: false, error: result.error || "Failed to create project" };
      } catch (error) {
        const errorInfo = ApiErrorHandler.handleError(error, 'Création de projet');
        return { success: false, error: errorInfo.message };
      }
    },
    [fetchProjects],
  );

  const updateProject = useCallback(
    async (id, projectData) => {
      try {
        const result = await apiRequest(`/api/projects/${id}`, {
          method: "PUT",
          body: JSON.stringify(projectData),
          context: 'Mise à jour du projet'
        });

        if (result.success) {
          await fetchProjects(); // Refresh the list
          ApiErrorHandler.showSuccessToast('Projet mis à jour avec succès');
          return { success: true };
        }
        return { success: false, error: result.error || "Failed to update project" };
      } catch (error) {
        const errorInfo = ApiErrorHandler.handleError(error, 'Mise à jour du projet');
        return { success: false, error: errorInfo.message };
      }
    },
    [fetchProjects],
  );

  const deleteProject = useCallback(
    async (id) => {
      try {
        const result = await apiRequest(`/api/projects/${id}`, {
          method: "DELETE",
          context: 'Suppression du projet'
        });

        if (result.success) {
          await fetchProjects(); // Refresh the list
          ApiErrorHandler.showSuccessToast('Projet supprimé avec succès');
          return { success: true };
        }
        return { success: false, error: result.error || "Failed to delete project" };
      } catch (error) {
        const errorInfo = ApiErrorHandler.handleError(error, 'Suppression du projet');
        return { success: false, error: errorInfo.message };
      }
    },
    [fetchProjects],
  );

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    retryCount,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
    retry,
  };
}

// Hook for managing blog data with enhanced error handling
export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async (category) => {
    setLoading(true);
    setError(null);

    try {
      const params = category ? `?category=${category}` : "";
      const data = await apiRequest(`/api/blogs${params}`, {
        context: `Articles${category ? ` - ${category}` : ''}`,
        retry: true
      });
      setBlogs(data);
    } catch (err) {
      const errorInfo = ApiErrorHandler.handleError(err, 'Articles');
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    retry,
  };
}

// Hook for managing messages/inbox with enhanced error handling
export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async (type) => {
    setLoading(true);
    setError(null);

    try {
      const params = type ? `?type=${type}` : "";
      const data = await apiRequest(`/api/messages${params}`, {
        context: 'Messages',
        retry: true
      });
      setMessages(data.messages);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      const errorInfo = ApiErrorHandler.handleError(err, 'Messages');
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      const result = await apiRequest(`/api/messages/${id}/read`, {
        method: "POST",
        context: 'Marquage du message comme lu'
      });

      if (result.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        ApiErrorHandler.showSuccessToast('Message marqué comme lu');
      }
    } catch (error) {
      const errorInfo = ApiErrorHandler.handleError(error, 'Marquage du message');
      console.error("Error marking message as read:", errorInfo.message);
    }
  }, []);

  const retry = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    unreadCount,
    loading,
    error,
    fetchMessages,
    markAsRead,
    retry,
  };
}

// Hook for form submissions with loading and error states
export function useFormSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitForm = useCallback(async (url, data, options = {}) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(data),
        context: options.context || 'Soumission du formulaire',
        ...options
      });

      setSuccess(true);
      if (options.successMessage) {
        ApiErrorHandler.showSuccessToast(options.successMessage);
      }

      return { success: true, data: result };
    } catch (err) {
      const errorInfo = ApiErrorHandler.handleError(err, options.context || 'Formulaire');
      setError(errorInfo.message);
      return { success: false, error: errorInfo.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    submitForm,
    reset,
  };
}

// Hook for handling image loading with fallbacks
export function useImageLoader() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  const loadImages = useCallback(async (urls, fallbackUrl = '/placeholder.svg?height=400&width=600') => {
    setLoading(true);
    setError(null);

    try {
      const loadedImages = await Promise.allSettled(
        urls.map(async (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(fallbackUrl);
            img.src = url;
          });
        })
      );

      const successfulImages = loadedImages
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      setImages(successfulImages);
    } catch (err) {
      const errorInfo = ApiErrorHandler.handleError(err, 'Chargement des images', false);
      setError(errorInfo.message);
      setImages(urls.map(() => fallbackUrl));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    images,
    loadImages,
  };
}
