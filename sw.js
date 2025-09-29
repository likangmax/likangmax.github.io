/**
 * Service worker for Likang Li's academic homepage
 * Lean build to keep offline support reliable
 */

const CACHE_NAME = 'likang-li-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './pic/us.jpg',
  './manifest.json',
  './blog/blog01.html'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS_TO_CACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch (error) {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      if (event.request.mode === 'navigate') {
        const fallback = await caches.match('./index.html');
        if (fallback) {
          return fallback;
        }
      }

      return new Response('', {
        status: 404,
        statusText: 'Offline: resource unavailable'
      });
    }
  })());
});
