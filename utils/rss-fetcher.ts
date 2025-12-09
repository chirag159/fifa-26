import Parser from 'rss-parser';
import { NewsArticle } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const parser = new Parser();

interface RSSSource {
    name: string;
    url: string;
    category: NewsArticle['category'];
    sourceType: NewsArticle['sourceType'];
    type: 'News' | 'Reddit';
}

const SOURCES: RSSSource[] = [
    {
        name: 'BBC Sport',
        url: 'http://feeds.bbci.co.uk/sport/football/rss.xml',
        category: 'General',
        sourceType: 'Official',
        type: 'News'
    },
    {
        name: 'Sky Sports',
        url: 'https://www.skysports.com/rss/12040', // Football
        category: 'General',
        sourceType: 'Official',
        type: 'News'
    },
    {
        name: 'ESPN',
        url: 'https://www.espn.com/espn/rss/soccer/news',
        category: 'General',
        sourceType: 'Official',
        type: 'News'
    },
    {
        name: 'r/worldcup',
        url: 'https://www.reddit.com/r/worldcup.rss',
        category: 'Social',
        sourceType: 'RSS',
        type: 'Reddit'
    },
    {
        name: 'r/soccer',
        url: 'https://www.reddit.com/r/soccer.rss',
        category: 'Social',
        sourceType: 'RSS',
        type: 'Reddit'
    }
];

export async function fetchRSSFeeds(): Promise<Partial<NewsArticle>[]> {
    console.log("RSS Fetcher: Starting...");
    const articles: Partial<NewsArticle>[] = [];

    const promises = SOURCES.map(async (source) => {
        try {
            const feed = await parser.parseURL(source.url);

            feed.items.forEach(item => {
                // Filter out non-relevant items if possible, though sources are specific

                let imageUrl = "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=1000&auto=format&fit=crop";
                // Try to find an image in content or media:content (RSS variations)
                if (item.enclosure?.url) {
                    imageUrl = item.enclosure.url;
                } else if (item.content?.match(/src="([^"]+)"/)) {
                    imageUrl = item.content.match(/src="([^"]+)"/)![1];
                }

                // Reddit specifics for Hype Score
                let hypeBoost = 0;
                if (source.type === 'Reddit') {
                    // Reddit content often has "submitted by /u/user"
                    // We can try to parse upvotes if they were in the title/desc, but standard RSS might not have them clearly.
                    // We'll trust the AI curator to score it based on title keywords.
                    if (item.title?.includes("Official") || item.title?.includes("Breaking")) {
                        hypeBoost = 2;
                    }
                }

                articles.push({
                    title: item.title || "Untitled",
                    summary: item.contentSnippet || item.content || "",
                    source: source.name,
                    imageUrl: imageUrl,
                    date: item.isoDate ? item.isoDate.split('T')[0] : new Date().toISOString().split('T')[0],
                    url: item.link || "#",
                    category: source.type === 'Reddit' ? 'Social' : 'General', // Can refine this later
                    sourceType: source.sourceType,
                    aiSummary: [] // Will be filled by curator
                });
            });
            console.log(`RSS Fetcher: Fetched ${feed.items.length} items from ${source.name}`);

        } catch (error) {
            console.error(`RSS Fetcher: Error fetching ${source.name}:`, error);
        }
    });

    await Promise.all(promises);
    return articles;
}
