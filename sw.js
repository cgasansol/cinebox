const CACHE_NAME = 'cinebox-v1';

// Add all essential files and external links you want to work offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Montserrat:wght@300;400;500;700&display=swap',
  'https://cgasansol.github.io/adminportal/company_logo.png',
  'https://cgasansol.github.io/cinebox/song_img1.jpg',
  'https://cgasansol.github.io/cinebox/song_img2.jpg',
  'https://cgasansol.github.io/cinebox/song_img3.jpg',
  'https://cgasansol.github.io/cinebox/song_img4.jpg',
  'https://cgasansol.github.io/cinebox/song_img5.jpg',
  'https://cgasansol.github.io/cinebox/song_img6.jpg',
  'https://cgasansol.github.io/cinebox/bgm.m4a',
  'https://www.w3schools.com/html/mov_bbb.mp4'
];

// Install Event - Precache initial assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Serve from Cache or Fetch from Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if found
        if (response) {
          return response;
        }
        // Fetch from network if not in cache
        return fetch(event.request).then(
          function(networkResponse) {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response because we want to cache it AND return it to browser
            var responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});

