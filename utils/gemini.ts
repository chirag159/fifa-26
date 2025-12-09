import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface GeminiAnalysis {
    relevanceScore: number; // 0-10
    hypeScore: number; // 0-10
    hypeLabel: 'Viral' | 'Breaking' | 'Routine' | 'Hot';
    summary: string[];
}

// Batch processing
export interface BatchFilterResult {
    indices: number[];
}

export async function batchFilterArticles(articles: { title: string, source: string }[]): Promise<number[]> {
    if (articles.length === 0) return [];

    try {
        const payload = articles.map((a, i) => `${i}. [${a.source}] ${a.title}`).join("\n");
        const prompt = `
        You are an editor for a FIFA World Cup 2026 news feed.
        Review the following headlines and identify the TOP 6 most relevant articles to the "Men's FIFA World Cup 2026".
        
        Criteria:
        - MUST be about World Cup 2026 (Qualifiers, Host Cities, FIFA Decisions, Key Players for National Teams).
        - IGNORE general club football (EPL, La Liga) unless it's a massive global story affecting the World Cup.
        - IGNORE women's football if specific to WSL (unless it's World Cup related).
        - Select items with inferred Relevance > 7.

        Headlines:
        ${payload}

        Output ONLY the indices of the selected articles as a JSON array of numbers. Example: [0, 4, 12]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        const indices = JSON.parse(text);
        if (Array.isArray(indices)) {
            return indices.slice(0, 6); // Ensure max 6
        }
        return [];
    } catch (error) {
        console.error("Gemini Batch Filter Error:", error);
        return [];
    }
}

export async function analyzeArticle(title: string, content: string, source: string): Promise<GeminiAnalysis> {
    try {
        const prompt = `
        Analyze the following news article for a FIFA World Cup 2026 companion app.
        
        Article:
        Title: "${title}"
        Source: "${source}"
        Content/Snippet: "${content.substring(0, 500)}"

        Tasks:
        1. Relevance: Score 0-10 on how relevant this is to the "Men's FIFA World Cup 2026". (High for host cities, teams, qualifiers, FIFA announcements. Low for club gossip, unrelated leagues).
        2. Sentiment: Analyze Polarity (-1 to 1), Intensity (0-10), and Subjectivity (0-1).
        3. Hype Score: Calculate a score (1-10) based on Intensity and Relevance. If it's a "Viral" topic (e.g. Messi, Schedule Reveal), boost it.
        4. Summary: Write exactly 3 short bullet points.

        Output ONLY valid JSON in this format:
        {
            "relevanceScore": number,
            "hypeScore": number,
            "hypeLabel": "Viral" | "Breaking" | "Routine" | "Hot",
            "summary": ["point 1", "point 2", "point 3"]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error: any) {
        console.error("Gemini Analysis Error:", error);

        let summaryMsg = "Analysis failed.";
        if (error.status === 429 || error.message?.includes("429")) {
            summaryMsg = "API Rate Limit Exceeded.";
        } else if (error.status === 404 || error.message?.includes("404")) {
            summaryMsg = "Model Not Found/Access Denied.";
        }

        // Fallback
        return {
            relevanceScore: 5,
            hypeScore: 3,
            hypeLabel: 'Routine',
            summary: [summaryMsg, "Using fallback data.", "Check API Quota."]
        };
    }
}
