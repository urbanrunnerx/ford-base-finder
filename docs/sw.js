const CACHE_PREFIX = 'ford-base-finder:' + self.registration.scope + ':';
const CACHE = CACHE_PREFIX + 'v4';
const ASSETS = ['./', './index.html', './style.css', './app.js', './core.js', './reference.txt', './epc-reference.json', './manifest.webmanifest', './icon.svg', './icons/icon-192.png', './icons/icon-512.png', './import-template.csv', './install.html', './install.css', './install.js'].map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async url => {
      const response = await fetch(new Request(url, { credentials: 'include', cache: 'reload' }));
      if (!response.ok || response.redirected) throw new Error('Offline asset unavailable');
      await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin || !ASSETS.includes(url.origin + url.pathname)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && !response.redirected) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(() => caches.match(event.request)));
});
