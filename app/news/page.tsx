"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import newsData from "@/data/news.json";
import { NewsArticle } from "@/types";
import HypeMeter from "@/components/HypeMeter";
import { ArrowUpRight } from "lucide-react";

export default function NewsPage() {
    const [filter, setFilter] = useState<'All' | 'Viral' | 'Teams' | 'Tickets' | 'Federations'>('All');

    const allNews = newsData as unknown as NewsArticle[];

    const filteredNews = allNews.filter(item => {
        if (filter === 'All') return true;
        if (filter === 'Viral') return item.hypeScore >= 9 || item.hypeLabel === 'Viral';
        return item.category === filter;
    });

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                        Global <span className="text-[hsl(var(--primary))]">News</span> Feed
                    </h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        AI Curator Active • Live Updates
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {['All', 'Viral', 'Teams', 'Tickets', 'Federations'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as any)}
                            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border transition-all ${filter === cat
                                ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white shadow-lg shadow-[hsl(var(--primary))]/20"
                                : "border-white/10 hover:border-white/30 text-gray-400 hover:text-white bg-black/20"
                                }`}
                        >
                            {cat === 'Viral' && <span className="mr-2">🔥</span>}
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* News List */}
            <div className="flex flex-col gap-4">
                {filteredNews.map((item) => (
                    <div
                        key={item.id}
                        className="glass-card p-6 hover:border-[hsl(var(--secondary))] transition-all group flex flex-col md:flex-row gap-6 items-start"
                    >
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <HypeMeter score={item.hypeScore} label={item.hypeLabel} size="sm" />
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                    {item.source}
                                </span>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>

                            <h3 className="text-2xl font-bold leading-tight group-hover:text-[hsl(var(--secondary))] transition-colors">
                                <Link href={item.url} target="_blank" className="flex items-center gap-2">
                                    {item.title}
                                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </h3>

                            {/* Full AI Analysis */}
                            <div className="bg-white/5 rounded-xl p-4 mt-2">
                                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] animate-pulse"></span>
                                        AI Classifier Analysis
                                    </p>
                                    <div className="text-xs font-mono text-gray-400">
                                        Relevance: <span className="text-white font-bold">{item.relevanceScore || '?'}/10</span>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {item.aiSummary.map((point, i) => (
                                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                            <span className="text-[hsl(var(--secondary))] mt-1.5 min-w-[6px] h-1.5 rounded-full bg-[hsl(var(--secondary))]"></span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="md:w-32 flex flex-col items-end gap-2 shrink-0">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 bg-white/5 px-2 py-1 rounded">{item.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
