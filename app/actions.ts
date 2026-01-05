"use server";

import fs from "fs/promises";
import path from "path";
import { NewsArticle } from "@/types";
import { processNewsFeed } from "@/utils/ai-curator";

const DATA_FILE = path.join(process.cwd(), "data", "news.json");

export async function getNews(): Promise<NewsArticle[]> {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(data) as NewsArticle[];
    } catch {
        return [];
    }
}

export async function getRawNews(): Promise<Partial<NewsArticle>[]> {
    try {
        const RAW_DATA_FILE = path.join(process.cwd(), "data", "news-raw.json");
        const data = await fs.readFile(RAW_DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveNews(news: NewsArticle[]) {
    await fs.writeFile(DATA_FILE, JSON.stringify(news, null, 4));
}

import { fetchRSSFeeds } from "@/utils/rss-fetcher";
import { fetchMockTweets } from "@/utils/mock-x-feed";
import { fetchNewsAPI } from "@/utils/news-api-fetcher";

export async function triggerAICurator(mockNewArticles: Partial<NewsArticle>[] = []) {
    // 1. Get existing news
    const currentNews = await getNews();

    // 2. Fetch Live Data (RSS + Mock X + NewsAPI)
    const rssNews = await fetchRSSFeeds();
    const newsApiNews = await fetchNewsAPI();
    const xNews = await fetchMockTweets(4); // Generate 4 tweets

    // 3. Combine with manual mock input
    const allRawData = [
        ...mockNewArticles,
        ...rssNews,
        ...newsApiNews,
        ...xNews,
        ...currentNews // Keep existing (Curator handles deep deduping if needed, or we implement simple id check here)
    ];

    // 4. Run AI Processor (Dedupes based on title, sorts by hype)
    const curated = await processNewsFeed(allRawData);

    // Save RAW feed for debugging (Admin Panel)
    const RAW_DATA_FILE = path.join(process.cwd(), "data", "news-raw.json");
    // Cast to NewsArticle for storage, adding temp IDs if missing
    const rawForSave = allRawData.map(a => ({
        ...a,
        id: a.id || crypto.randomUUID(),
        date: a.date || new Date().toISOString().split('T')[0],
        aiSummary: [],
        hypeScore: 0,
        relevanceScore: 0
    }));
    await fs.writeFile(RAW_DATA_FILE, JSON.stringify(rawForSave.slice(0, 200), null, 4));

    // 5. Save to disk
    // Limit to latest 50 to avoid infinite growth in file
    const latestCurated = curated.slice(0, 50);

    await saveNews(latestCurated);

    return { curated: latestCurated, raw: rawForSave };
}
