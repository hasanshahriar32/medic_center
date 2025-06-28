const CACHE_NAME = "medwatch-ai-v1.0.0"
const STATIC_CACHE_NAME = "medwatch-static-v1.0.0"
const DYNAMIC_CACHE_NAME = "medwatch-dynamic-v1.0.0"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Add other critical assets
]

// API endpoints to cache
const API_CACHE_PATTERNS = [/^\/api\/users/, /^\/api\/sensor-data/, /^\/api\/alerts/, /^\/api\/mqtt/]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("Service Worker: Static assets cached")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME && cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle different types of requests
  if (request.method === "GET") {
    // Static assets - cache first
    if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
    }
    // API requests - network first with cache fallback
    else if (API_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
      event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE_NAME))
    }
    // Other requests - network first
    else {
      event.respondWith(networkFirst(request))
    }
  }
})

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      console.log("Service Worker: Serving from cache", request.url)
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error("Service Worker: Cache first error", error)
    return new Response("Offline - Content not available", { status: 503 })
  }
}

// Network first with cache fallback
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      console.log("Service Worker: Network response cached", request.url)
    }

    return networkResponse
  } catch (error) {
    console.log("Service Worker: Network failed, trying cache", request.url)

    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    return new Response(
      JSON.stringify({
        error: "Offline - Data not available",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    return await fetch(request)
  } catch (error) {
    console.error("Service Worker: Network request failed", error)
    return new Response("Offline - Service not available", { status: 503 })
  }
}

// Background sync for offline data
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag)

  if (event.tag === "mqtt-data-sync") {
    event.waitUntil(syncMQTTData())
  }
})

// Sync MQTT data when back online
async function syncMQTTData() {
  try {
    // Get offline data from IndexedDB or cache
    const offlineData = await getOfflineData()

    if (offlineData && offlineData.length > 0) {
      console.log("Service Worker: Syncing offline MQTT data", offlineData.length)

      for (const data of offlineData) {
        try {
          await fetch("/api/mqtt/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        } catch (error) {
          console.error("Service Worker: Failed to sync data", error)
        }
      }

      // Clear offline data after successful sync
      await clearOfflineData()
    }
  } catch (error) {
    console.error("Service Worker: Background sync error", error)
  }
}

// Placeholder functions for offline data management
async function getOfflineData() {
  // Implement IndexedDB or cache-based offline data retrieval
  return []
}

async function clearOfflineData() {
  // Implement offline data cleanup
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received")

  const options = {
    body: event.data ? event.data.text() : "New medical alert received",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "view",
        title: "View Alert",
        icon: "/icons/action-view.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/action-dismiss.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("MedWatch AI Alert", options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.action)

  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/?section=alerts"))
  }
})
