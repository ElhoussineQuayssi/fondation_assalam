/**
 * Simple in-memory cache with TTL (Time-To-Live) support
 */
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found or expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set a value in cache with TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttlMs - Time-to-live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1000) {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns {number} Number of cached items
   */
  size() {
    // Clean expired items first
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Cache key constants
export const CACHE_KEYS = {
  PROJECTS_LIST: 'projects:list',
  PROJECTS_SUMMARY: 'projects:summary'
};