const VERSION = "v1";
const CACHE_NAME = `FYP-${VERSION}`;

const APP_STATIC_RESOURCES = ["/icon.jpg"];

// Install event: cache static resources
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install event");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_STATIC_RESOURCES);
    }),
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate event");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});
