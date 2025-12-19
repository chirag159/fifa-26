import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Access the model manager if possible? 
// The SDK doesn't always expose listModels directly on the main class in all versions, 
// usually it is an HTTP call to https://generativelanguage.googleapis.com/v1beta/models?key=...

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("No API Key found");
        return;
    }

    // Manual fetch since SDK method might differ by version
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error("Error fetching models:", res.status, res.statusText);
            const text = await res.text();
            console.error(text);
            return;
        }
        const data = await res.json();
        console.log("Available Models:");
        data.models.forEach((m: any) => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods?.join(", ")})`);
        });
    } catch (e) {
        console.error("Fetch failed", e);
    }
}

listModels();
