"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Trophy, BarChart3, Menu, X, Search } from "lucide-react";
import clsx from "clsx";

import NotificationToggle from "./NotificationToggle";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export default function Layout({ children }: { children: React.ReactNode }) {
    useServiceWorker();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Schedule", href: "/schedule", icon: Calendar },
        { name: "Rankings", href: "/rankings", icon: Trophy },
        { name: "Odds", href: "/odds", icon: BarChart3 },
        { name: "Bracket", href: "/bracket", icon: Trophy },
        { name: "News", href: "/news", icon: Calendar }, // Added News explicit link
        { name: "Admin", href: "/admin", icon: BarChart3 }, // Using BarChart for now
    ];

    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 fixed h-full glass border-r border-[var(--glass-border)] z-50">
                <div className="p-8">
                    <h1 className="text-3xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                        FIFA 26
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors",
                                pathname === item.href
                                    ? "bg-[hsla(var(--primary),0.2)] text-[hsl(var(--primary))]"
                                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="font-semibold">{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 space-y-4">
                    {/* Search Trigger (Mock) */}
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 bg-white/5 rounded-xl hover:bg-white/10 transition">
                        <Search size={18} />
                        <span className="text-sm">Search...</span>
                    </button>
                    <NotificationToggle />
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full glass z-50 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                    FIFA 26
                </h1>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/95 pt-24 px-6 space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-4 text-2xl font-bold py-4 border-b border-white/10"
                        >
                            <item.icon size={28} className={pathname === item.href ? "text-[var(--primary)]" : "text-gray-500"} />
                            <span className={pathname === item.href ? "text-white" : "text-gray-500"}>{item.name}</span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 pt-24 md:pt-6 pb-24">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
