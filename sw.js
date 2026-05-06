/**
 * Service worker for Likang Li's academic homepage
 * Lean build to keep offline support reliable
 */

const CACHE_NAME = 'likang-li-cache-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './vendor/bootstrap/bootstrap.min.css',
  './vendor/bootstrap/bootstrap.bundle.min.js',
  './vendor/marked/marked.min.js',
  './pic/favicon.ico',
  './pic/apple-touch-icon.png',
  './pic/icon-192.png',
  './pic/icon-512.png',
  './pic/us.jpg',
  './pic/us.webp',
  './pic/us-400.jpg',
  './pic/us-400.webp',
  './pic/us-800.jpg',
  './pic/us-800.webp',
  './manifest.json',
  './blog/blog01.html',
  './software/bdprecision.html'
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

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const fallback = await cache.match('./index.html');
    if (fallback) {
      return fallback;
    }

    return new Response('', {
      status: 404,
      statusText: 'Offline: resource unavailable'
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const networkPromise = fetch(request)
    .then(response => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cachedResponse || (await networkPromise) || new Response('', {
    status: 404,
    statusText: 'Offline: resource unavailable'
  });
}
