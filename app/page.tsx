import { differenceInDays } from "date-fns";
import Link from "next/link";
import newsData from "@/data/news.json";
import { NewsArticle } from "@/types";
import HypeMeter from "@/components/HypeMeter";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  const openingMatchDate = new Date("2026-06-11");
  const today = new Date();
  const daysToGo = differenceInDays(openingMatchDate, today);

  const news = newsData as unknown as NewsArticle[];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl h-[500px] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-20 z-0" />
        <div className="absolute inset-0 bg-[url('/Fifa-26-landing-page.png')] bg-cover bg-center opacity-40 mix-blend-overlay z-0" /> {/* Placeholder for user asset if we move it */}

        <div className="relative z-10 space-y-6 p-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl uppercase">
            FEEL THE <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">PULSE</span>
          </h1>
          <p className="text-xl md:text-3xl font-light text-gray-200">
            48 Teams. 3 Nations. One Global Heartbeat.
          </p>

          <div className="inline-block glass px-8 py-4 rounded-full mt-8">
            <span className="text-4xl font-bold text-[hsl(var(--primary))]">{daysToGo}</span>
            <span className="text-gray-300 ml-3 uppercase tracking-widest text-sm">Days To Kickoff</span>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold">Latest Updates</h2>
          <Link href="/news" className="text-[hsl(var(--secondary))] hover:underline">View All</Link>
        </div>

        <div className="flex flex-col gap-3">
          {news.slice(0, 6).map((item) => (
            <div key={item.id} className="glass-card p-4 hover:border-[hsl(var(--secondary))] transition-colors group">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.hypeLabel === 'Viral' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                      {item.hypeLabel === 'Viral' ? '🔥 Viral' : item.source}
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight group-hover:text-[hsl(var(--secondary))] transition-colors">
                    <Link href={item.url} target="_blank">{item.title}</Link>
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <HypeMeter score={item.hypeScore} label={item.hypeLabel} size="sm" />
                  <div className="text-xs text-gray-600 font-mono">
                    Relevance: {item.relevanceScore}/10
                  </div>
                </div>
              </div>

              {/* AI Snippet - Always visible as a compact list */}
              <div className="mt-3 pl-3 border-l-2 border-white/10">
                <ul className="space-y-1">
                  {item.aiSummary.slice(0, 2).map((point, i) => ( // Show top 2 bullets
                    <li key={i} className="text-xs text-gray-400 line-clamp-1">
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        <Link href="/schedule" className="glass-card hover:border-[hsl(var(--secondary))] group">
          <h3 className="text-2xl font-bold mb-2">Match Schedule</h3>
          <p className="text-gray-400">View fixtures by city, date, or group.</p>
        </Link>
        <Link href="/odds" className="glass-card hover:border-[hsl(var(--primary))] group">
          <h3 className="text-2xl font-bold mb-2">Betting Odds</h3>
          <p className="text-gray-400">Check the latest lines for favorites and underdogs.</p>
        </Link>
      </section>
    </div>
  );
}
