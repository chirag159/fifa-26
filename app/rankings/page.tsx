import Link from "next/link";
import teamData from "@/data/teams.json";
import { Team } from "@/types";

export default function RankingsPage() {
    const teams: Team[] = (teamData as Team[]).sort((a, b) => a.rank - b.rank);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold">FIFA World Ranking</h1>
                <p className="text-gray-400">Current standings for qualified and potential teams.</p>
            </div>

            <div className="glass overflow-hidden rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-6">Rank</th>
                            <th className="p-6">Team</th>
                            <th className="p-6 hidden md:table-cell">Confederation</th>
                            <th className="p-6 text-right">Points (Proj)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6 font-mono text-[hsl(var(--secondary))]">#{team.rank}</td>
                                <td className="p-6 font-bold">
                                    <Link href={`/teams/${team.code}`} className="flex items-center gap-4 hover:text-[hsl(var(--primary))] transition-colors">
                                        <span className="text-2xl">{team.flag}</span>
                                        {team.name}
                                    </Link>
                                </td>
                                <td className="p-6 hidden md:table-cell text-gray-400">{team.confederation}</td>
                                <td className="p-6 text-right font-mono text-gray-300">{(2000 - (team.rank * 10)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
