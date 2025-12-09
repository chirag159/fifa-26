export interface Team {
    id: string;
    name: string;
    code: string;
    confederation: string;
    rank: number;
    flag: string;
}

export interface Match {
    id: string;
    date: string;
    venue: string;
    round: string;
    homeTeamId: string;
    awayTeamId: string;
    group: string;
}

export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    source: string;
    imageUrl: string;
    date: string;
    url: string;
    category: 'Tickets' | 'Teams' | 'Federations' | 'Players' | 'General' | 'Social';
    sourceType: 'Official' | 'RSS' | 'Social';
    hypeScore: number;
    hypeLabel: 'Viral' | 'Breaking' | 'Routine' | 'Hot';
    aiSummary: string[];
    deduplicationId?: string;
    relevanceScore?: number;
}

export interface Odds {
    matches: Record<string, { homeWin: number; draw: number; awayWin: number }>;
    outrights: { teamId: string; odds: number }[];
}
