import { NewsArticle } from '@/types';

const NEWS_API_KEY = "2c170062ac9a468f977fa56fbb342b3e"; // TODO: Move to env var
const BASE_URL = "https://newsapi.org/v2";

interface NewsAPIArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsAPIArticle[];
}

export async function fetchNewsAPIEverything(): Promise<Partial<NewsArticle>[]> {
    console.log("NewsAPI: Fetching deep search...");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2); // Look back 48 hours to be safe
    const fromDate = yesterday.toISOString().split('T')[0];

    const params = new URLSearchParams({
        q: '("World Cup" OR "WC2026") AND ("FIFA" OR "qualifier" OR "qualifying" OR "USA" OR "Mexico" OR "Canada")',
        language: 'en',
        sortBy: 'relevancy', // High quality first
        from: fromDate,
        pageSize: '30', // Limit to avoid rate limits and noise
        apiKey: NEWS_API_KEY
    });

    try {
        const res = await fetch(`${BASE_URL}/everything?${params.toString()}`);
        if (!res.ok) {
            console.error(`NewsAPI Error: ${res.status} ${res.statusText}`);
            return [];
        }
        const data: NewsAPIResponse = await res.json();
        return mapToNewsArticles(data.articles, 'General');
    } catch (error) {
        console.error("NewsAPI: deep search failed", error);
        return [];
    }
}

export async function fetchNewsAPITopHeadlines(): Promise<Partial<NewsArticle>[]> {
    console.log("NewsAPI: Fetching top headlines...");

    // Top headlines for Sports in US
    const params = new URLSearchParams({
        category: 'sports',
        country: 'us',
        q: 'World Cup', // Optional filter within sports
        pageSize: '10',
        apiKey: NEWS_API_KEY
    });

    try {
        const res = await fetch(`${BASE_URL}/top-headlines?${params.toString()}`);
        if (!res.ok) {
            console.error(`NewsAPI Error: ${res.status} ${res.statusText}`);
            return [];
        }
        const data: NewsAPIResponse = await res.json();
        return mapToNewsArticles(data.articles, 'General');
    } catch (error) {
        console.error("NewsAPI: top headlines failed", error);
        return [];
    }
}

function mapToNewsArticles(articles: NewsAPIArticle[], category: NewsArticle['category']): Partial<NewsArticle>[] {
    return articles.map(article => {
        // Validation: Skip removed content or empty titles
        if (article.title === "[Removed]" || !article.title) return null;

        const mapped: Partial<NewsArticle> = {
            title: article.title,
            summary: article.description || article.content?.substring(0, 150) || "",
            source: article.source.name || "NewsAPI",
            imageUrl: article.urlToImage || "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=1000&auto=format&fit=crop", // Fallback
            date: article.publishedAt.split('T')[0],
            url: article.url,
            category: category,
            sourceType: 'Official', // NewsAPI generally aggregates official sources
            aiSummary: []
        };
        return mapped;
    }).filter((a): a is Partial<NewsArticle> => a !== null);
}

import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'cache', 'news-api.json');
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 Hour

export async function fetchNewsAPI(): Promise<Partial<NewsArticle>[]> {
    // 1. Check Cache
    try {
        const cacheData = await fs.readFile(CACHE_FILE, 'utf-8');
        const cache = JSON.parse(cacheData);
        const age = Date.now() - cache.timestamp;

        if (age < CACHE_DURATION_MS) {
            console.log(`NewsAPI: Serving from cache (${Math.round(age / 60000)} mins old)`);
            return cache.articles;
        }
    } catch (e) {
        // Cache missing or invalid, ignore
        console.log("NewsAPI: No valid cache found, fetching fresh...");
    }

    // 2. Fetch Fresh
    const [everything, headlines] = await Promise.all([
        fetchNewsAPIEverything(),
        fetchNewsAPITopHeadlines()
    ]);

    // Simple dedupe by URL
    const all = [...headlines, ...everything];
    const uniqueMap = new Map();
    all.forEach(item => {
        if (item.url) uniqueMap.set(item.url, item);
    });

    const articles = Array.from(uniqueMap.values());
    console.log(`NewsAPI: Total unique items fetched: ${uniqueMap.size}`);

    // 3. Save Cache
    if (articles.length > 0) {
        try {
            await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
            await fs.writeFile(CACHE_FILE, JSON.stringify({
                timestamp: Date.now(),
                articles: articles
            }, null, 2));
            console.log("NewsAPI: Cache updated.");
        } catch (err) {
            console.error("NewsAPI: Failed to write cache", err);
        }
    }

    return articles;
}
