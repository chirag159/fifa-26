"use client";
import { useState } from "react";
import matchData from "@/data/schedule.json";
import teamData from "@/data/teams.json";
import { Match, Team } from "@/types";
import { format, parseISO } from "date-fns";
import { Search } from "lucide-react";

export default function SchedulePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const matches: Match[] = matchData as Match[];
    const teams: Team[] = teamData as Team[];

    const getTeam = (id: string) => teams.find(t => t.id === id);

    const filteredMatches = matches.filter(m =>
        m.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.homeTeamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.awayTeamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold">Match Schedule</h1>
                    <p className="text-gray-400">Official fixtures for FIFA World Cup 26™</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by city, team, or group..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[hsl(var(--secondary))]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredMatches.map((match) => {
                    const homeTeam = getTeam(match.homeTeamId);
                    const awayTeam = getTeam(match.awayTeamId);

                    return (
                        <div key={match.id} className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:scale-[1.01]">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                                <div className="text-center md:text-left min-w-[100px]">
                                    <div className="text-sm font-bold text-[hsl(var(--primary))]">{format(parseISO(match.date), "MMM d")}</div>
                                    <div className="text-xs text-gray-400">{format(parseISO(match.date), "h:mm a")}</div>
                                </div>

                                <div className="flex-1 grid grid-cols-3 items-center gap-4">
                                    <div className="flex items-center justify-end gap-3 text-right">
                                        <span className="font-bold text-xl hidden md:inline">{homeTeam ? homeTeam.name : match.homeTeamId}</span>
                                        <span className="font-bold text-xl md:hidden">{match.homeTeamId}</span>
                                        <span className="text-2xl">{homeTeam?.flag}</span>
                                    </div>

                                    <div className="text-center text-xs text-gray-500 bg-white/5 py-1 rounded">VS</div>

                                    <div className="flex items-center justify-start gap-3 text-left">
                                        <span className="text-2xl">{awayTeam?.flag}</span>
                                        <span className="font-bold text-xl hidden md:inline">{awayTeam ? awayTeam.name : match.awayTeamId}</span>
                                        <span className="font-bold text-xl md:hidden">{match.awayTeamId}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 min-w-[200px] text-right">
                                <div className="text-sm font-semibold">{match.venue}</div>
                                <div className="text-xs text-gray-400">{match.group} • {match.round}</div>
                            </div>
                        </div>
                    );
                })}

                {filteredMatches.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No matches found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
