'use strict';

const URL = 'index.html';
const cacheVersion = 1;

this.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open('offline-cache-' + cacheVersion)
            .then(cache => cache.addAll([URL]))
    );
});

this.addEventListener('fetch', event => {
    // // request.mode = navigate isn't supported in all browsers
    // // so include a check for Accept: text/html header.
    // if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    //     event.respondWith(
    //         fetch(event.request.url)
    //             .catch(() => {
    //                 // Return the offline page
    //                 return caches.match(URL);
    //             })
    //     );
    // } else {
    //     // Respond with everything else if we can
    //     event.respondWith(
    //         caches
    //             .match(event.request.url)
    //             .then(function (response) {
    //                 return response || fetch(event.request.url);
    //             })
    //     );
    // }

    event.respondWith(
        fetch(event.request.url)
            .catch(() => caches.match(URL))
    );
});
