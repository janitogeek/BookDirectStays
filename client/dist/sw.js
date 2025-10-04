const CACHE_NAME = 'bookdirectstays-v4.1-unlimited';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css'
];

// DISABLED: Pre-loading interfered with unlimited pagination
async function preloadAllData() {
  console.log('🚀 Service Worker: Data pre-loading disabled - using unlimited pagination in main app');
  // No longer pre-loading data to avoid conflicts with unlimited pagination
}

// Install event - cache resources AND pre-load data
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      }),
      // Pre-load all data in background
      preloadAllData()
    ])
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


