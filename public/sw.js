const CACHE_NAME = 'forestdata-v1';
const STATIC_ASSETS = [
  '/',
  '/capturar',
  '/arboles',
  '/admin',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-captures') {
    event.waitUntil(syncPendingCaptures());
  }
});

async function syncPendingCaptures() {
  const cache = await caches.open('pending-captures');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const response = await cache.match(request);
      const data = await response.json();
      
      await fetch('/api/trees/' + data.treeId + '/care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      await cache.delete(request);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
