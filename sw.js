const CACHE_NAME = "european-odyssey-2026-v4";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

// Install
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate
self.addEventListener("activate", event => {
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

// Fetch Strategy
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  const requestURL = new URL(event.request.url);

  // NETWORK FIRST for HTML pages
  if (
    requestURL.pathname.endsWith(".html") ||
    requestURL.pathname === "/" ||
    requestURL.pathname.endsWith("/europe-odyssey/")
  ) {

    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;

        })
        .catch(() => caches.match(event.request))
    );

    return;
  }

  // CACHE FIRST for images/assets
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {

      return (
        cachedResponse ||

        fetch(event.request).then(networkResponse => {

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;

        })

      );

    })
  );

});