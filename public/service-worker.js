const CACHE_NAME = 'instagram-live-cache-v1';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/live',
    '/assets/fonts/Instagram Sans.woff',
    '/assets/fonts/Instagram Sans Bold.woff',
    '/assets/fonts/Instagram Sans Light.woff',
    '/assets/fonts/Instagram Sans Medium.woff',
    '/assets/fonts/Instagram Sans Headline.woff'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
