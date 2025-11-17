// Service Worker for Offline Functionality
const CACHE_NAME = 'hearthline-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles/main.css',
    './scripts/app.js',
    './scripts/offline-storage.js',
    './scripts/mesh-network.js',
    './manifest.json',
    './images/icon-192.png',
    './images/icon-512.png'
];

// Install event - cache essential files
self.addEventListener('install', event => {
    console.log('Service Worker installing');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // If both cache and network fail, show offline page
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            })
    );
});

// Background sync for when connection is restored
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

// Function to handle background synchronization
async function doBackgroundSync() {
    // In a real implementation, this would sync pending messages/alerts
    // that were created while offline
    console.log('Performing background sync');
    
    // Example: Get pending items from IndexedDB and sync them
    // This is where you would implement your sync logic
}