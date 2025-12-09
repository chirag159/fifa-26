"use client";

import { useState, useEffect } from "react";
import { NewsArticle } from "@/types";
import { getNews, saveNews, triggerAICurator } from "../actions";
import { ArrowLeft, Save, RefreshCw, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import HypeMeter from "@/components/HypeMeter";

export default function AdminPage() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        loadNews();
    }, []);

    async function loadNews() {
        const data = await getNews();
        setNews(data);
    }

    async function handleSave() {
        setLoading(true);
        await saveNews(news);
        setIsDirty(false);
        setLoading(false);
    }

    async function handleTriggerAI() {
        setLoading(true);
        // Trigger the full "AI Scout" which now pulls local RSS and X feeds
        const updated = await triggerAICurator([]);
        setNews(updated);
        setLoading(false);
    }

    function updateItem(id: string, updates: Partial<NewsArticle>) {
        setNews(news.map(item => item.id === id ? { ...item, ...updates } : item));
        setIsDirty(true);
    }

    function deleteItem(id: string) {
        setNews(news.filter(item => item.id !== id));
        setIsDirty(true);
    }

    return (
        <div className="min-h-screen p-8 bg-black/90 text-white font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Site
                        </Link>
                        <h1 className="text-3xl font-bold">Newsroom <span className="text-[hsl(var(--primary))]">Admin</span></h1>
                        <p className="text-gray-400">Manage content, trigger AI curation, and adjust hype levels.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleTriggerAI}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--secondary))] rounded-lg hover:brightness-110 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Trigger AI Scout
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!isDirty || loading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:bg-gray-700"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Content Table */}
                <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                                <th className="p-4">Hype</th>
                                <th className="p-4 w-1/3">Title & Summary</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Source</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {news.map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 align-top">
                                        <div className="space-y-2">
                                            <HypeMeter score={item.hypeScore} label={item.hypeLabel} size="sm" />
                                            <input
                                                type="range"
                                                min="1" max="10"
                                                value={item.hypeScore}
                                                onChange={(e) => updateItem(item.id, { hypeScore: parseInt(e.target.value) })}
                                                className="w-full accent-[hsl(var(--primary))]"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <input
                                            value={item.title}
                                            onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                            className="bg-transparent font-bold w-full focus:outline-none focus:text-[hsl(var(--secondary))]"
                                        />
                                        <textarea
                                            value={item.summary}
                                            onChange={(e) => updateItem(item.id, { summary: e.target.value })}
                                            className="bg-transparent text-sm text-gray-400 w-full mt-1 resize-none h-16 focus:outline-none"
                                        />
                                    </td>
                                    <td className="p-4 align-top">
                                        <select
                                            value={item.category}
                                            onChange={(e) => updateItem(item.id, { category: e.target.value as any })}
                                            className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-gray-300"
                                        >
                                            {['General', 'Teams', 'Tickets', 'Federations', 'Players', 'Social'].map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`text-xs px-2 py-1 rounded ${item.sourceType === 'Official' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                            {item.source}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top text-right">
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
