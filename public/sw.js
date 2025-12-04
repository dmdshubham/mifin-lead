/* eslint-disable no-undef */
// Custom Service Worker for miFIN Lead Management

const CACHE_NAME = 'mifin-lead-v1';
const RUNTIME_CACHE = 'mifin-runtime-v1';
const API_CACHE = 'mifin-api-v1';

// Assets to cache on install - keep minimal to avoid install failures
const STATIC_ASSETS = [
  // Don't precache pages during install to avoid errors
  // They will be cached on first visit (runtime caching)
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      // Cache will be populated during runtime
      return Promise.resolve();
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== API_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip chrome extension and other non-app requests
  if (!url.origin.includes('localhost') && url.origin !== location.origin) {
    return;
  }

  // API requests - Network first, cache fallback
  if ((request.url.includes('/mifin/') || request.method === 'POST') && !request.url.includes('.js') && !request.url.includes('.css')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses (including POST for master data)
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              // Cache master data APIs
              if (request.url.includes('getMasters') || 
                  request.url.includes('getDependentMaster') ||
                  request.url.includes('getLeadDetails') ||
                  request.url.includes('contactDetail')) {
                console.log('[Service Worker] Caching API response:', request.url);
                cache.put(request, responseClone);
              }
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving cached API response:', request.url);
              return cachedResponse;
            }
            // Return a custom offline response (silently - no error toast)
            return new Response(
              JSON.stringify({ 
                error: 'offline', 
                message: 'Cached data being used',
                offline: true
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            );
          });
        })
    );
    return;
  }

  // HTML pages - Network first with quick timeout, then cache
  if (request.mode === 'navigate' || request.destination === 'document' || 
      (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request, { credentials: 'same-origin' })
        .then((response) => {
          // Only cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              console.log('[Service Worker] Caching HTML page:', request.url);
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Serve from cache when offline or network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving cached HTML:', request.url);
              return cachedResponse;
            }
            // Try to match without query parameters
            const urlWithoutQuery = request.url.split('?')[0];
            return caches.match(urlWithoutQuery).then((fallbackResponse) => {
              if (fallbackResponse) {
                console.log('[Service Worker] Serving cached HTML (no query):', urlWithoutQuery);
                return fallbackResponse;
              }
              // Last resort: serve base path
              return caches.match('/index.html');
            });
          });
        })
    );
    return;
  }

  // JS and CSS files - Cache first, with network fallback
  if (request.url.endsWith('.js') || request.url.endsWith('.css') || 
      request.url.includes('.js?') || request.url.includes('.css?')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[Service Worker] Serving cached asset:', request.url);
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                console.log('[Service Worker] Caching asset:', request.url);
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Failed to fetch asset:', request.url, error);
            // Try to return any cached version
            return caches.match(request);
          });
      })
    );
    return;
  }

  // Other static assets (images, fonts, etc.) - Cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache but update in background
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, response);
              });
            }
          })
          .catch(() => {
            // Ignore background update errors
          });
        
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch((error) => {
          console.log('[Service Worker] Fetch failed for:', request.url, error);
          return caches.match(request);
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    console.log('[Service Worker] Syncing offline data...');
    
    // Open IndexedDB and get pending actions
    const db = await openDatabase();
    const pendingActions = await getPendingActions(db);
    
    console.log(`[Service Worker] Found ${pendingActions.length} pending actions`);
    
    for (const action of pendingActions) {
      try {
        await syncAction(action);
        await deleteAction(db, action.id);
        console.log('[Service Worker] Synced action:', action.id);
      } catch (error) {
        console.error('[Service Worker] Failed to sync action:', action.id, error);
      }
    }
    
    // Notify all clients about successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        syncedCount: pendingActions.length
      });
    });
    
  } catch (error) {
    console.error('[Service Worker] Background sync failed:', error);
    throw error;
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mifin-lead-db', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getPendingActions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingActions'], 'readonly');
    const store = transaction.objectStore('pendingActions');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteAction(db, actionId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');
    const request = store.delete(actionId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function syncAction(action) {
  // This is a placeholder - actual implementation would make API calls
  console.log('[Service Worker] Syncing action:', action);
  return Promise.resolve();
}

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'miFIN Lead Management';
  const options = {
    body: data.body || 'New notification',
    icon: '/src/public/android-chrome-192x192.png',
    badge: '/src/public/favicon-32x32.png',
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/mifinLead/worklist')
  );
});

console.log('[Service Worker] Loaded');

