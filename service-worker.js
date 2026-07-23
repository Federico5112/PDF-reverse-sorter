const CACHE_NAME = "dosya-donusturucu-v3";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=converter3",
  "./js/app.js?v=converter4",
  "./js/converter-service.js",
  "./vendor/pdf-lib.min.js",
  "./vendor/fontkit.umd.min.js",
  "./vendor/Roboto-Regular.ttf",
  "./vendor/jszip.min.js",
  "./vendor/pdf.min.mjs",
  "./vendor/pdf.worker.min.mjs",
  "./manifest.webmanifest",
  "./icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (shouldFetchFresh(event.request)) {
    event.respondWith(fetchFresh(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});

function shouldFetchFresh(request) {
  const url = new URL(request.url);
  if (request.mode === "navigate") {
    return true;
  }

  return (
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js")
  );
}

async function fetchFresh(request) {
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
    throw error;
  }
}
