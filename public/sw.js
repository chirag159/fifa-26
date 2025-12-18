const CACHE_NAME = "fifa-26-cache-v1";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(["/", "/schedule", "/rankings", "/odds", "/bracket"]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Ignore non-GET requests
    if (event.request.method !== "GET") return;

    // Ignore Next.js internals, API routes, and HMR
    if (
        url.pathname.startsWith("/_next") ||
        url.pathname.startsWith("/api") ||
        url.searchParams.has("_rsc")
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).catch((error) => {
                    console.error("Fetch failed:", event.request.url, error);
                    // Return a fallback or just let it fail gracefully without crashing SW logic
                    throw error;
                })
            );
        })
    );
});
