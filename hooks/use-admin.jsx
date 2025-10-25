import { useState, useEffect, useCallback } from "react";

// Hook for dashboard statistics with real-time updates
export function useStats() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    newBlogsPercent: 0,
    totalMessages: 0,
    newMessagesPercent: 0,
    totalViews: 0,
    viewsChangePercent: 0,
    recentBlogs: [],
    recentMessages: [],
    totalProjects: 0,
    newProjectsPercent: 0,
    totalBeneficiaries: 0,
    totalAdmins: 0,
    projectsCount: 0,
    adminsCount: 0,
    recentProjects: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}

// Hook for admin management
export function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admins");
      if (!response.ok) throw new Error("Failed to fetch admins");

      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAdmin = useCallback(
    async (adminData) => {
      try {
        const response = await fetch("/api/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminData),
        });

        if (response.ok) {
          await fetchAdmins();
          return { success: true };
        }
        return { success: false, error: "Failed to create admin" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    [fetchAdmins],
  );

  const updateAdmin = useCallback(
    async (id, adminData) => {
      try {
        const response = await fetch(`/api/admins/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminData),
        });

        if (response.ok) {
          await fetchAdmins();
          return { success: true };
        }
        return { success: false, error: "Failed to update admin" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    [fetchAdmins],
  );

  const deleteAdmin = useCallback(
    async (id) => {
      try {
        const response = await fetch(`/api/admins/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchAdmins();
          return { success: true };
        }
        return { success: false, error: "Failed to delete admin" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    [fetchAdmins],
  );

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return {
    admins,
    loading,
    error,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    refetch: fetchAdmins,
  };
}

// Hook for pagination logic
export function usePagination(totalItems, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToPage = useCallback(
    (page) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const getVisiblePages = useCallback(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    getVisiblePages,
    setCurrentPage,
  };
}

// Hook for search functionality with debouncing
export function useSearch(initialQuery = "", delay = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return {
    query,
    debouncedQuery,
    setQuery,
    clearSearch,
    isSearching: query !== debouncedQuery,
  };
}

// Hook for theme management
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, setTheme, toggleTheme };
}
