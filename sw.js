//Change this to update in peoples mobiles
const CACHE_VERSION = 'v4.0.1'; 
const CACHE_NAME = `pokpik-${CACHE_VERSION}`;
//Coment the contents below for developing
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/script.js',
  '/anims.json',
  '/style.css',
];

// Instalar el Service Worker y almacenar recursos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Limpiar versiones antiguas de la caché si actualizas el código
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones para que funcione offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Devuelve el archivo si está en caché; si no, lo busca en internet
        return cachedResponse || fetch(event.request);
      })
  );
});
