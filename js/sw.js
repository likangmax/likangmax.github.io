/**
 * Service Worker for Likang Li's academic homepage
 * 简化版本以确保可靠性
 */

const CACHE_NAME = 'likang-li-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './js/main.js',
  './js/sw.js',
  './pic/us.jpg',
  './manifest.json',
  './blog/blog01.html'
];

// 安装Service Worker
self.addEventListener('install', event => {
  // 跳过等待，立即激活
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存核心资源');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  // 立即接管页面
  event.waitUntil(clients.claim());
  
  // 清理旧缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                 .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// 处理请求
self.addEventListener('fetch', event => {
  // 只处理GET请求
  if (event.request.method !== 'GET') return;
  
  // 使用网络优先策略，网络失败时回退到缓存
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // 如果是导航请求，返回主页
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            return new Response('', { 
              status: 404, 
              statusText: '离线模式: 资源不可用' 
            });
          });
      })
  );
}); 