"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Trophy, MapPin, AlertCircle } from "lucide-react";
import teamData from "@/data/teams.json";
import { Team } from "@/types";

export default function TeamPage({ params }: { params: Promise<{ code: string }> }) {
    // Unwrap params in Next.js 15+ (React 19)
    const { code } = use(params);
    const team = (teamData as Team[]).find((t) => t.code === code);

    if (!team) {
        return notFound();
    }

    return (
        <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </Link>

            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-[bg-[hsl(var(--primary))]] implementation">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] to-black opacity-50 z-0" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="text-9xl shadow-2xl rounded-full overflow-hidden bg-white/10 w-48 h-48 flex items-center justify-center backdrop-blur-md">
                        {team.flag}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm font-mono tracking-wider mb-2">
                            {team.confederation}
                        </div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter">{team.name}</h1>
                        <div className="text-xl text-gray-300">FIFA Rank: <span className="text-[hsl(var(--primary))] font-bold">#{team.rank}</span></div>
                    </div>
                </div>
            </section>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content: History & Qualification */}
                <div className="md:col-span-2 space-y-8">
                    {/* Qualification */}
                    <div className="glass-card">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <MapPin className="text-[hsl(var(--primary))]" /> Road to 2026
                        </h2>
                        {team.qualification ? (
                            <div className="prose prose-invert max-w-none text-gray-300">
                                {team.qualification}
                            </div>
                        ) : (
                            <div className="p-6 bg-white/5 rounded-xl border border-dashed border-white/20 text-center text-gray-400">
                                <AlertCircle className="mx-auto mb-2 opacity-50" />
                                <p>Qualification details currently unavailable.</p>
                            </div>
                        )}
                    </div>

                    {/* History */}
                    <div className="glass-card">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Trophy className="text-yellow-400" /> World Cup History
                        </h2>
                        {team.history ? (
                            <div className="prose prose-invert max-w-none text-gray-300">
                                {team.history}
                            </div>
                        ) : (
                            <div className="p-6 bg-white/5 rounded-xl border border-dashed border-white/20 text-center text-gray-400">
                                <AlertCircle className="mx-auto mb-2 opacity-50" />
                                <p>Historical context currently unavailable.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Key Players */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <User className="text-[hsl(var(--secondary))]" /> Key Players
                    </h2>

                    {team.keyPlayers && team.keyPlayers.length > 0 ? (
                        <div className="space-y-4">
                            {team.keyPlayers.map((player, idx) => (
                                <div key={idx} className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition group">
                                    <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden relative flex-shrink-0">
                                        {player.image ? (
                                            <img
                                                src={player.image}
                                                alt={player.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://placehold.co/100x100?text=${player.name.charAt(0)}`;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--primary))] text-black font-bold text-xl">
                                                {player.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg group-hover:text-[hsl(var(--primary))] transition-colors">{player.name}</div>
                                        <div className="text-sm text-gray-400 uppercase tracking-wider">{player.position}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-white/5 rounded-xl border border-dashed border-white/20 text-center text-gray-400">
                            <p>Player roster to be announced.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
