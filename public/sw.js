// Service Worker — Personal Calendar App
// Caches static assets only. Never caches HTML navigation requests.

const CACHE_NAME = 'calendar-v2'
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192.svg',
]

// Install — pre-cache static assets only (never pages)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate — delete ALL old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — only cache static assets, never HTML/navigation
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Never intercept non-GET, auth, or navigation requests
  if (event.request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return
  if (event.request.mode === 'navigate') return

  // Static assets — cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request)
    })
  )
})
