/* The Wedding Journey — offline cache */
const VERSION = 'hk-v8';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'fonts/marcellus-latin.woff2',
  'fonts/marcellus-latin-ext.woff2',
  'fonts/lora-latin.woff2',
  'fonts/lora-latin-ext.woff2',
  'fonts/lora-italic-latin.woff2',
  'fonts/lora-italic-latin-ext.woff2',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
