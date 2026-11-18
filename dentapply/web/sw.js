// Offline cache for DentPath. Bump VERSION when schools.json or index.html changes.
const VERSION = "dentpath-v3";
const FILES = ["./", "./index.html", "./schools.json", "./logic.js", "./manifest.webmanifest", "./icon.svg", "./icon-180.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))));
// Network first so updated requirements reach students; cache when offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
