"use server";

import fs from "fs/promises";
import path from "path";
import { NewsArticle } from "@/types";
import { processNewsFeed } from "@/utils/ai-curator";

const DATA_FILE = path.join(process.cwd(), "data", "news.json");

export async function getNews(): Promise<NewsArticle[]> {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as NewsArticle[];
}

export async function saveNews(news: NewsArticle[]) {
    await fs.writeFile(DATA_FILE, JSON.stringify(news, null, 4));
}

import { fetchRSSFeeds } from "@/utils/rss-fetcher";
import { fetchMockTweets } from "@/utils/mock-x-feed";

export async function triggerAICurator(mockNewArticles: Partial<NewsArticle>[] = []) {
    // 1. Get existing news
    const currentNews = await getNews();

    // 2. Fetch Live Data (RSS + Mock X)
    const rssNews = await fetchRSSFeeds();
    const xNews = await fetchMockTweets(4); // Generate 4 tweets

    // 3. Combine with manual mock input
    const allRawData = [
        ...mockNewArticles,
        ...rssNews,
        ...xNews,
        ...currentNews // Keep existing (Curator handles deep deduping if needed, or we implement simple id check here)
    ];

    // 4. Run AI Processor (Dedupes based on title, sorts by hype)
    const curated = await processNewsFeed(allRawData);

    // 5. Save to disk
    // Limit to latest 50 to avoid infinite growth in file
    const latestCurated = curated.slice(0, 50);

    await saveNews(latestCurated);

    return latestCurated;
}
