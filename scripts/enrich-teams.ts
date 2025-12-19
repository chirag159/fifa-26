import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const TEAMS_FILE = path.join(process.cwd(), "data/teams.json");
const OUTPUT_FILE = path.join(process.cwd(), "data/teams-enriched.json");
const REPORT_FILE = path.join(process.cwd(), "data/missing-content-report.md");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface Player {
    name: string;
    position: string;
    image?: string;
}

interface Team {
    id: string;
    name: string;
    code: string;
    confederation: string;
    rank: number;
    flag: string;
    history?: string;
    qualification?: string;
    keyPlayers?: Player[];
}

async function fetchWikiContent(teamName: string): Promise<string> {
    const url = `https://en.wikipedia.org/wiki/${teamName.replace(/ /g, "_")}_national_football_team`;
    console.log(`Fetching Wiki for ${teamName}: ${url}`);

    try {
        const res = await fetch(url);
        if (!res.ok) return "";
        const html = await res.text();
        // Crude extraction of main text content to avoid large payload
        return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
            .replace(/<[^>]+>/g, " ")
            .slice(0, 30000); // Limit context size
    } catch (e) {
        console.error(`Failed to fetch ${url}`, e);
        return "";
    }
}

async function verifyImage(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

async function enrichTeams() {
    if (!fs.existsSync(TEAMS_FILE)) {
        console.error("Teams file not found!");
        process.exit(1);
    }

    const teams: Team[] = JSON.parse(fs.readFileSync(TEAMS_FILE, "utf-8"));
    const enrichedTeams: Team[] = [];
    let report = "# Missing Content Report\n\n";

    for (const team of teams) {
        console.log(`Processing ${team.name}...`);
        const wikiText = await fetchWikiContent(team.name);

        if (!wikiText) {
            report += `- [ ] **${team.name}**: Could not fetch Wikipedia page.\n`;
            enrichedTeams.push(team);
            continue;
        }

        const prompt = `
        You are an expert football historian. Use the following text from Wikipedia to extract details about the ${team.name} national football team.
        
        Text Context:
        ${wikiText}

        Strict Rules:
        1. ONLY use the provided text. If a fact is not in the text, usually for qualification path, check if you generally know it for World Cup 2026. If totally unsure, return null.
        2. "history": Brief summary of their World Cup history/legacy (max 2 sentences).
        3. "qualification": How they qualified for 2026 World Cup (e.g. Host, CONMEBOL qualifiers).
        4. "keyPlayers": List 3 active key players. For "image", provide a generic placeholder URL "https://placehold.co/400x600?text={PlayerInitials}" for now.

        Return JSON format:
        {
            "history": "string or null",
            "qualification": "string or null",
            "keyPlayers": [{ "name": "string", "position": "string", "image": "string" }]
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            const data = JSON.parse(text);

            if (!data.history) report += `- [ ] **${team.name}**: Missing history.\n`;
            if (!data.qualification) report += `- [ ] **${team.name}**: Missing qualification info.\n`;
            if (!data.keyPlayers || data.keyPlayers.length < 3) report += `- [ ] **${team.name}**: Insufficient key players found.\n`;

            enrichedTeams.push({ ...team, ...data });

        } catch (e) {
            console.error(`Error processing ${team.name}`, e);
            report += `- [ ] **${team.name}**: AI processing failed.\n`;
            enrichedTeams.push(team);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedTeams, null, 4));
    fs.writeFileSync(REPORT_FILE, report);
    console.log(`Done! Check ${OUTPUT_FILE} and ${REPORT_FILE}`);
}

enrichTeams();
