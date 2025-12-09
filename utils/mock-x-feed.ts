import { NewsArticle } from '@/types';
import { faker } from '@faker-js/faker';

// Realistic sounding tweet templates
const TWEET_TEMPLATES = [
    "JUST IN: {player} has been spotted at the training camp in {city}! #WorldCup2026",
    "Rumor has it that {team} is planning a major tactical shift for the opener. Thoughts? ⚽️",
    "Look at this stadium! {stadium} is absolutely electric right now. 🏟️✨ #FIFA26",
    "Ticket drop alert! 🚨 New batch of tickets for {match} just went live. Go go go!",
    "Can't believe it's only {days} days away! Who's your pick to win it all? 🏆",
    "BREAKING: {coach} confirms the starting XI for the friendly against {team}.",
    "The atmosphere in {city} is unmatched. This is going to be the best World Cup ever. USA 🇺🇸 Mexico 🇲🇽 Canada 🇨🇦"
];

const PLAYERS = ["Mbappé", "Messi", "Haaland", "Bellingham", "Vinicius Jr", "Pulisic", "Davies"];
const TEAMS = ["Brazil", "France", "USA", "Argentina", "Japan", "Mexico", "Canada", "England"];
const CITIES = ["New York", "Los Angeles", "Mexico City", "Toronto", "Miami", "Dallas"];
const STADIUMS = ["SoFi Stadium", "MetLife Stadium", "Azteca"];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export async function fetchMockTweets(count: number = 3): Promise<Partial<NewsArticle>[]> {
    console.log("Mock X Feed: Generating tweets...");
    const tweets: Partial<NewsArticle>[] = [];

    for (let i = 0; i < count; i++) {
        let text = getRandomItem(TWEET_TEMPLATES);

        // Fill slots
        text = text.replace("{player}", getRandomItem(PLAYERS));
        text = text.replace("{team}", getRandomItem(TEAMS));
        text = text.replace("{city}", getRandomItem(CITIES));
        text = text.replace("{stadium}", getRandomItem(STADIUMS));
        text = text.replace("{match}", `${getRandomItem(TEAMS)} vs ${getRandomItem(TEAMS)}`);
        text = text.replace("{coach}", `Coach ${faker.person.lastName()}`);
        text = text.replace("{days}", String(Math.floor(Math.random() * 200)));

        // Probabilistic Hype Score (High for breaking/viral)
        const isBreaking = text.includes("BREAKING") || text.includes("JUST IN");
        const hypeScore = isBreaking ? Math.floor(Math.random() * 3) + 8 : Math.floor(Math.random() * 5) + 4; // 8-10 or 4-8

        tweets.push({
            title: `@${faker.internet.username()} on X`,
            summary: text,
            source: "X (Twitter)",
            imageUrl: "https://images.unsplash.com/photo-1611605698380-8e13c2435bed?q=80&w=1000&auto=format&fit=crop", // Twitter generic image or random
            date: new Date().toISOString().split('T')[0],
            url: "https://twitter.com/FIFAWorldCup", // Mock link
            category: "Social",
            sourceType: "Social",
            hypeScore: hypeScore,
            hypeLabel: hypeScore >= 9 ? 'Viral' : (hypeScore >= 7 ? 'Breaking' : 'Hot'),
            // Pre-filling some fields, though Curator can override
        });
    }

    return tweets;
}
