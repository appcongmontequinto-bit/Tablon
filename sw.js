// Service worker del Tablón.
// · La página (index.html) va SIEMPRE primero a la red: así cada cambio publicado llega al momento.
//   Solo si no hay conexión se muestra la última copia guardada.
// · Iconos y librerías (supabase-js, PDF.js, Excel) se guardan en caché para abrir más rápido.
// · Los datos (Supabase) nunca se guardan aquí: siempre se piden en directo.
const VERSION = 'tablon-v2';   // súbela al cambiar iconos para que los móviles dejen la copia vieja
const BASICOS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Página: red primero, copia guardada si no hay conexión
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copia = r.clone();
      caches.open(VERSION).then(c => c.put('./index.html', copia));
      return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  // Librerías del CDN: la guardada al instante y se actualiza por detrás
  if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.open(VERSION).then(async c => {
      const guardada = await c.match(req);
      const red = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => guardada);
      return guardada || red;
    }));
    return;
  }
  // Iconos y manifiesto de la propia web
  if (url.origin === location.origin && /\/(icons\/|manifest\.webmanifest)/.test(url.pathname)) {
    e.respondWith(caches.match(req).then(g => g || fetch(req)));
  }
  // Todo lo demás (Supabase, archivos firmados…) va directo a la red
});
