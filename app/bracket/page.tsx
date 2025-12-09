"use client";
import { useState } from "react";
import teamData from "@/data/teams.json";
import { Team } from "@/types";
import { Trophy, Share2, RefreshCw } from "lucide-react";
import clsx from "clsx";

// Simplified bracket structure for MVP (Round of 16 to Final)
// In a real app with 48 teams, this would be Round of 32
const INITIAL_MATCHUPS = [
    { id: 1, home: "ARG", away: "USA", winner: null, nextMatchId: 9 },
    { id: 2, home: "ENG", away: "SEN", winner: null, nextMatchId: 9 },
    { id: 3, home: "FRA", away: "MEX", winner: null, nextMatchId: 10 },
    { id: 4, home: "ESP", away: "JPN", winner: null, nextMatchId: 10 },
    { id: 5, home: "BRA", away: "MAR", winner: null, nextMatchId: 11 },
    { id: 6, home: "POR", away: "ITA", winner: null, nextMatchId: 11 },
    { id: 7, home: "BEL", away: "CRO", winner: null, nextMatchId: 12 },
    { id: 8, home: "GER", away: "CAN", winner: null, nextMatchId: 12 },
    // Quarter Finals
    { id: 9, home: null, away: null, winner: null, nextMatchId: 13 },
    { id: 10, home: null, away: null, winner: null, nextMatchId: 13 },
    { id: 11, home: null, away: null, winner: null, nextMatchId: 14 },
    { id: 12, home: null, away: null, winner: null, nextMatchId: 14 },
    // Semi Finals
    { id: 13, home: null, away: null, winner: null, nextMatchId: 15 },
    { id: 14, home: null, away: null, winner: null, nextMatchId: 15 },
    // Final
    { id: 15, home: null, away: null, winner: null, nextMatchId: null },
];

export default function BracketPage() {
    const [matches, setMatches] = useState<any[]>(INITIAL_MATCHUPS);
    const teams = teamData as Team[];

    const getTeam = (code: string | null) => teams.find((t) => t.code === code);

    const handleWinnerSelect = (matchId: number, winnerCode: string) => {
        const newMatches = [...matches];
        const matchIndex = newMatches.findIndex((m) => m.id === matchId);
        const match = newMatches[matchIndex];

        // Set winner
        match.winner = winnerCode;

        // Advance to next round
        if (match.nextMatchId) {
            const nextMatchIndex = newMatches.findIndex((m) => m.id === match.nextMatchId);
            const nextMatch = newMatches[nextMatchIndex];

            // Determine if it's the home or away slot in the next match
            // Logic: 1->9(home), 2->9(away), 3->10(home), 4->10(away), etc.
            // Simple heuristic for this fixed tree:
            if (matchId % 2 !== 0) {
                nextMatch.home = winnerCode;
            } else {
                nextMatch.away = winnerCode;
            }

            // Reset future rounds if we change a past result
            // (Simplified: just clearing key future slots would be recursive, for MVP we just overwrite)
        }

        setMatches(newMatches);
    };

    const renderMatch = (matchId: number) => {
        const match = matches.find(m => m.id === matchId);
        if (!match) return null;

        const homeTeam = getTeam(match.home);
        const awayTeam = getTeam(match.away);

        return (
            <div className="glass p-4 rounded-xl w-64 flex flex-col gap-2 relative group">
                {/* Connecting Lines Logic would go here for visual tree */}
                <div
                    onClick={() => match.home && handleWinnerSelect(matchId, match.home)}
                    className={clsx(
                        "flex items-center justify-between p-2 rounded cursor-pointer transition",
                        match.winner === match.home && match.home ? "bg-[hsl(var(--primary))] text-white" : "hover:bg-white/10",
                        !match.home && "opacity-50 pointer-events-none"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <span>{homeTeam?.flag || "🏳️"}</span>
                        <span className="font-bold">{homeTeam?.code || "TBD"}</span>
                    </div>
                    {match.winner === match.home && match.home && <Trophy size={14} />}
                </div>

                <div className="h-px bg-white/10" />

                <div
                    onClick={() => match.away && handleWinnerSelect(matchId, match.away)}
                    className={clsx(
                        "flex items-center justify-between p-2 rounded cursor-pointer transition",
                        match.winner === match.away && match.away ? "bg-[hsl(var(--primary))] text-white" : "hover:bg-white/10",
                        !match.away && "opacity-50 pointer-events-none"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <span>{awayTeam?.flag || "🏳️"}</span>
                        <span className="font-bold">{awayTeam?.code || "TBD"}</span>
                    </div>
                    {match.winner === match.away && match.away && <Trophy size={14} />}
                </div>
            </div>
        )
    }

    const finalMatch = matches.find(m => m.id === 15);
    const champion = getTeam(finalMatch?.winner);

    return (
        <div className="space-y-8 overflow-x-auto">
            <div className="flex justify-between items-center min-w-[1000px]">
                <div>
                    <h1 className="text-4xl font-bold">Bracket Simulator</h1>
                    <p className="text-gray-400">Predict the road to the final.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setMatches(INITIAL_MATCHUPS)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                        <RefreshCw size={18} /> Reset
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[hsl(var(--primary))] hover:bg-pink-600 transition font-bold">
                        <Share2 size={18} /> Share Picks
                    </button>
                </div>
            </div>

            {champion && (
                <div className="text-center py-10 animate-bounce">
                    <div className="text-xl text-[hsl(var(--secondary))] uppercase tracking-widest mb-2">Tournament Champion</div>
                    <div className="text-6xl font-black flex items-center justify-center gap-4">
                        <Trophy size={64} className="text-yellow-400" />
                        {champion.flag} {champion.name}
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center gap-8 min-w-[1000px] pb-10">
                {/* Round of 16 */}
                <div className="flex flex-col gap-8">
                    <div className="text-center text-gray-500 font-bold uppercase tracking-widest mb-4">Round of 16</div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(id => (
                        <div key={id}>{renderMatch(id)}</div>
                    ))}
                </div>

                {/* Quarter Finals */}
                <div className="flex flex-col gap-24"> // increased gap
                    <div className="text-center text-gray-500 font-bold uppercase tracking-widest mb-4">Quarter Finals</div>
                    {[9, 10, 11, 12].map(id => (
                        <div key={id}>{renderMatch(id)}</div>
                    ))}
                </div>

                {/* Semi Finals */}
                <div className="flex flex-col gap-48"> // increased gap
                    <div className="text-center text-gray-500 font-bold uppercase tracking-widest mb-4">Semi Finals</div>
                    {[13, 14].map(id => (
                        <div key={id}>{renderMatch(id)}</div>
                    ))}
                </div>

                {/* Final */}
                <div className="flex flex-col gap-8">
                    <div className="text-center text-[#d4af37] font-bold uppercase tracking-widest mb-4">Grand Final</div>
                    {renderMatch(15)}
                </div>
            </div>
        </div>
    );
}
