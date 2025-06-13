const CACHE_NAME = 'kindergarten-bus-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// 설치 이벤트
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// 페치 이벤트 (오프라인 지원)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 캐시에 있으면 캐시된 버전 반환
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// 업데이트 이벤트
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
