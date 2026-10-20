const cacheName = 'showtrack-v5.0';
const assets = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(assets))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // Never cache external API calls
    if (
        url.hostname.includes('tvmaze.com') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('itunes.apple.com') ||
        url.hostname.includes('api.github.com')
    ) {
        return;
    }

    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => caches.match('./index.html'))
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
