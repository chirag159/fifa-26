"use client";
import { useEffect } from "react";

export function useServiceWorker() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => console.log("Scope is: ", registration.scope))
                .catch((err) => console.log("SW registration failed: ", err));
        }
    }, []);
}
