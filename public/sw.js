const CACHE_NAME = 'nightly-v1.0.0';
const STATIC_CACHE = 'nightly-static-v1';
const DYNAMIC_CACHE = 'nightly-dynamic-v1';

// Assets estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// URLs de la API que NO deben cachearse
const API_URLS = [
  'https://nightly-backend.onrender.com',
  'https://vragoadztmsswqtfvllly.supabase.co',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Activar inmediatamente el nuevo SW
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  // Tomar control inmediatamente
  return self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // No cachear requests de API
  if (API_URLS.some(apiUrl => request.url.startsWith(apiUrl))) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline', message: 'No hay conexión a internet' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }
  
  // No cachear Google Maps
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Cache-first strategy para assets estáticos
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Retornar del cache y actualizar en background
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, response.clone());
              });
            }
          }).catch(() => {});
          
          return cachedResponse;
        }
        
        // Si no está en cache, fetch y cachear
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // Fallback para páginas HTML
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
    );
  }
});

// Push notifications (futuro)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nueva actualización disponible',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.data,
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Nightly', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
