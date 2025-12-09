import { NewsArticle } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { analyzeArticle, batchFilterArticles } from "./gemini";

// Process feed with Real AI
export async function processNewsFeed(articles: Partial<NewsArticle>[]): Promise<NewsArticle[]> {
    console.log("AI Curator: Processing feed...", articles.length);

    // 1. Deduplication (Mock: simple title check)
    const uniqueArticles: NewsArticle[] = [];
    const titles = new Set();

    // We process in parallel for speed, but limit concurrency if needed. 
    // For now, let's process strictly unique items.

    const processingQueue: Partial<NewsArticle>[] = [];

    for (const article of articles) {
        if (!article.title) continue;

        const normalizedTitle = article.title.toLowerCase().trim();
        if (titles.has(normalizedTitle)) {
            continue;
        }
        titles.add(normalizedTitle);
        processingQueue.push(article);
    }

    console.log(`AI Curator: Analyzing ${processingQueue.length} unique items...`);

    const normalizedArticles = processingQueue.map((article, index) => ({
        index,
        title: article.title || "",
        source: article.source || ""
    }));

    // Step 2: Batch Filter to find Top 6 Relevant Candidates
    console.log("AI Curator: Running batch filter on", normalizedArticles.length, "headlines...");
    let selectedIndices: number[] = [];

    // If list is small, just take them all? No, we still want to save tokens/quota if filtering.
    // But for robustness, if batch fails we might fallback.

    // We can just send the whole list to Gemini (up to a reasonable limit, say 50)
    // If more than 50, strictly slice top 50 reliable sources maybe?

    const candidates = normalizedArticles.slice(0, 50);
    const indices = await batchFilterArticles(candidates);

    console.log("AI Curator: Selected indices:", indices);

    // If no indices returned (e.g. error), maybe fallback to first few?
    // Or just return empty if strict. Let's fallback to first 3 if AI failed completely.
    if (indices.length === 0 && candidates.length > 0) {
        console.log("AI Curator: Batch filter failed or found none. Fallback to first 3.");
        selectedIndices = [0, 1, 2].filter(i => i < candidates.length);
    } else {
        selectedIndices = indices;
    }

    // Step 3: Deep Analysis Only on Selected
    const promises = selectedIndices.map(async (index) => {
        const article = processingQueue[index];
        if (!article) return null;

        const analysis = await analyzeArticle(
            article.title || "",
            article.summary || "",
            article.source || ""
        );

        return {
            id: article.id || uuidv4(),
            title: article.title || "Untitled",
            summary: article.summary || "No summary available.",
            source: article.source || "Unknown Source",
            imageUrl: article.imageUrl || "",
            date: article.date || new Date().toISOString().split('T')[0],
            url: article.url || "#",
            category: article.category || 'General',
            sourceType: article.sourceType || 'RSS',

            // AI Fields
            hypeScore: analysis.hypeScore,
            hypeLabel: analysis.hypeLabel,
            aiSummary: analysis.summary,
            relevanceScore: analysis.relevanceScore,

            deduplicationId: uuidv4()
        } as NewsArticle;
    });

    const results = await Promise.all(promises);
    const enrichedArticles = results.filter((a): a is NewsArticle => a !== null);

    // Filter by Relevance (e.g. keep only > 4 to remove noise)
    // Sort by Hype Score
    return enrichedArticles
        .filter(a => (a.relevanceScore || 0) > 4)
        .sort((a, b) => b.hypeScore - a.hypeScore);
}
