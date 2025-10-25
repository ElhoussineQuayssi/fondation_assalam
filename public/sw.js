// Service Worker for caching and offline support
const CACHE_NAME = 'assalam-foundation-v1';
const STATIC_CACHE = 'assalam-static-v1';
const DYNAMIC_CACHE = 'assalam-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/about',
  '/projects',
  '/blogs',
  '/manifest.json',
  '/favicon.ico',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for frequently updated content
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML pages - Network first with fallback to cache
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'style' || request.destination === 'script') {
    // CSS and JS - Stale while revalidate
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else if (request.destination === 'image') {
    // Images - Cache first
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.url.includes('/api/')) {
    // API requests - Network first
    event.respondWith(networkFirstStrategy(request));
  } else {
    // Default - Network first
    event.respondWith(networkFirstStrategy(request));
  }
});

// Cache first strategy
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    return caches.match('/offline.html') || new Response('Offline', { status: 503 });
  }
}

// Network first strategy
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache...', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);

  // Fetch in background for future use
  const networkUpdate = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => null);

  return cachedResponse || networkUpdate;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    // Handle offline actions like form submissions
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Implement background sync logic for offline form submissions
  console.log('[SW] Handling background sync');
}
