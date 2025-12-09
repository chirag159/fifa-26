"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

export default function NotificationToggle() {
    const [permission, setPermission] = useState("default");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === "granted") {
            new Notification("Notifications Enabled", {
                body: "You will now receive alerts for match kickoffs!",
                icon: "/icon.png" // Placeholder
            });
        }
    };

    return (
        <button
            onClick={requestPermission}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm"
        >
            {permission === "granted" ? <Bell size={16} className="text-[hsl(var(--primary))]" /> : <BellOff size={16} />}
            {permission === "granted" ? "Alerts On" : "Enable Alerts"}
        </button>
    );
}
