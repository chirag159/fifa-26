import { Zap, Activity, Flame, TrendingUp } from "lucide-react";

interface HypeMeterProps {
    score: number;
    label: 'Viral' | 'Breaking' | 'Routine' | 'Hot';
    size?: 'sm' | 'md' | 'lg';
}

export default function HypeMeter({ score, label, size = 'md' }: HypeMeterProps) {
    let color = "text-gray-400";
    let bg = "bg-gray-500/10";
    let Icon = Activity;

    if (score >= 9) {
        color = "text-rose-500";
        bg = "bg-rose-500/10";
        Icon = Flame;
    } else if (score >= 7) {
        color = "text-orange-500";
        bg = "bg-orange-500/10";
        Icon = Zap;
    } else if (score >= 5) {
        color = "text-blue-500";
        bg = "bg-blue-500/10";
        Icon = TrendingUp;
    }

    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-lg px-4 py-2"
    };

    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 ${color} ${bg} ${sizeClasses[size]}`}>
            <Icon className={size === 'sm' ? "w-3 h-3" : size === 'md' ? "w-4 h-4" : "w-5 h-5"} />
            <span>{label}</span>
            <span className="opacity-60 text-[0.7em] ml-1">Lvl {score}</span>
        </div>
    );
}
