import oddsData from "@/data/odds.json";
import teamData from "@/data/teams.json";
import scheduleData from "@/data/schedule.json";
import { Team } from "@/types";

export default function OddsPage() {
    const teams = teamData as Team[];
    const odds = oddsData;
    const matches = scheduleData;

    const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || id;

    // Enhance match objects with odds if available
    const matchesWithOdds = matches.filter(m => odds.matches[m.id as keyof typeof odds.matches]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Betting Odds</h1>
                <p className="text-gray-400">Live lines from major sportsbooks.</p>
            </div>

            {/* Outright Winner Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[hsl(var(--primary))] rounded-full" />
                    Tournament Winner
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {odds.outrights.sort((a, b) => a.odds - b.odds).map((item) => {
                        const team = teams.find(t => t.id === item.teamId);
                        return (
                            <div key={item.teamId} className="glass-card p-4 text-center hover:bg-white/10 cursor-pointer group">
                                <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition">{team?.flag}</div>
                                <div className="font-bold mb-1">{team?.name || item.teamId}</div>
                                <div className="text-[hsl(var(--secondary))] font-mono font-bold text-lg">+{item.odds * 100}</div> {/* American Odds Sim */}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Match Odds Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[hsl(var(--secondary))] rounded-full" />
                    Upcoming Matches
                </h2>
                <div className="space-y-4">
                    {matchesWithOdds.map((match) => {
                        const matchOdds = odds.matches[match.id as keyof typeof odds.matches];
                        const home = getTeamName(match.homeTeamId);
                        const away = getTeamName(match.awayTeamId);

                        return (
                            <div key={match.id} className="glass-card flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex-1 text-center md:text-left">
                                    <div className="text-sm text-gray-400 mb-1">{match.date.split("T")[0]} • {match.venue}</div>
                                    <div className="text-xl font-bold">{home} vs {away}</div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                                    <button className="bg-white/5 hover:bg-[hsl(var(--primary))] hover:text-white transition p-4 rounded-xl text-center min-w-[100px]">
                                        <div className="text-xs opacity-70 mb-1">{home}</div>
                                        <div className="font-mono font-bold">{matchOdds.homeWin}</div>
                                    </button>
                                    <button className="bg-white/5 hover:bg-white/10 transition p-4 rounded-xl text-center min-w-[100px]">
                                        <div className="text-xs opacity-70 mb-1">Draw</div>
                                        <div className="font-mono font-bold">{matchOdds.draw}</div>
                                    </button>
                                    <button className="bg-white/5 hover:bg-[hsl(var(--secondary))] hover:text-white transition p-4 rounded-xl text-center min-w-[100px]">
                                        <div className="text-xs opacity-70 mb-1">{away}</div>
                                        <div className="font-mono font-bold">{matchOdds.awayWin}</div>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
