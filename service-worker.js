const cacheName = "v1";

self.addEventListener("install", (e) => {
    console.log("Service worker: Installed");
})

self.addEventListener("activate", (e) => {
    console.log("Service worker: Activated");

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames
                .filter(cache => cache !== cacheName)
                .map(cache => cache => caches.delete(cache))
            );
        })
    )
})

self.addEventListener("fetch", (e) => {
    console.log("Service worker: Fetching");
    
    e.respondWith(
        fetch(e.request)
        .then(res => {
            const resClone = res.clone();

            caches.open(cacheName)
            .then(cache => {
                cache.put(e.request, resClone);
            });

            return res;
        })
        .catch((err) => caches.match(e.request).then(res => res))
    );
})