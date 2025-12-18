"use client";
import { useEffect } from "react";

export function useServiceWorker() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // Only unnecessary in development usually, but good to be careful
            if (process.env.NODE_ENV !== "production") {
                // Determine if we should unregister existing ones to clean up dev state
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (const registration of registrations) {
                        registration.unregister();
                        console.log("Unregistered service worker in dev mode");
                    }
                });
                return;
            }

            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => console.log("Scope is: ", registration.scope))
                .catch((err) => console.log("SW registration failed: ", err));
        }
    }, []);
}
