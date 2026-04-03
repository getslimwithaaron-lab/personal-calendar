// Service Worker — Personal Calendar App
// Caches app shell for offline access, network-first for API calls

const CACHE_NAME = 'calendar-v1'
const SHELL_ASSETS = [
  '/',
  '/week',
  '/day',
  '/month',
  '/agenda',
  '/manifest.json',
]

// Install — pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — network first for API, cache first for shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET and auth requests
  if (event.request.method !== 'GET') return
  if (url.pathname.startsWith('/api/auth')) return

  // API calls — network first, no cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(JSON.stringify({ error: 'Offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }))
    )
    return
  }

  // App shell — stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request)
      const fetchPromise = fetch(event.request).then((response) => {
        if (response.ok) cache.put(event.request, response.clone())
        return response
      }).catch(() => cached)

      return cached || fetchPromise
    })
  )
})
