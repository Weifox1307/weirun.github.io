const CACHE_NAME = 'weirun-pwa-v2';
const ASSETS = ['/', '/logo-mark.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Кэшируем файлы, но не падаем, если какого-то нет
      return Promise.allSettled(ASSETS.map(url => cache.add(url).catch(err => console.log('SW Cache error:', url))));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Сначала пытаемся сходить в сеть, если нет инета - отдаем из кэша
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
