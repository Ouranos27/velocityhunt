import { Star, GitFork, Eye, ExternalLink, Share2, Flame } from "lucide-react";
import { SparkRepo } from "@/lib/github";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function RepoCard({ repo }: { repo: SparkRepo }) {
    const shareText = `Just spotted this 🔥 GitHub spark: ${repo.name} by @${repo.owner.login}
Gained high velocity this week!
→ ${repo.html_url}
Via velocityhunt #indiemaker`;

    const shareOnX = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="glass group relative flex flex-col gap-4 rounded-xl p-6 transition-all hover:border-spark/50 hover:bg-white/[0.05]">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-spark transition-colors">
                            { repo.name }
                        </h3>
                        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                            { repo.language || "Unknown" }
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500">by { repo.owner.login }</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-spark/10 px-2.5 py-1 text-xs font-medium text-spark">
                    <Flame size={ 14 } className="fill-spark" />
                    <span>{ repo.sparkScore }</span>
                </div>
            </div>

            <p className="line-clamp-2 text-sm text-zinc-400 min-h-[40px]">
                { repo.description || "No description provided." }
            </p>

            <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                    <Star size={ 14 } />
                    { repo.stargazers_count.toLocaleString() }
                </div>
                <div className="flex items-center gap-1">
                    <GitFork size={ 14 } />
                    { repo.forks_count.toLocaleString() }
                </div>
                <div className="flex items-center gap-1">
                    <Eye size={ 14 } />
                    { repo.watchers_count.toLocaleString() }
                </div>
            </div>

            <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-600">
                    <span>Spark Velocity</span>
                    <span className="text-spark">↑ { repo.growthPercentage }%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                        className="h-full spark-gradient transition-all duration-1000"
                        style={ { width: `${Math.min(100, (repo.sparkScore / 50) * 100)}%` } }
                    />
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <a
                    href={ repo.html_url }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-100 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
                >
                    View Repo <ExternalLink size={ 14 } />
                </a>
                <button
                    onClick={ shareOnX }
                    className="flex aspect-square items-center justify-center rounded-lg border border-zinc-800 py-2 transition-colors hover:bg-zinc-800"
                >
                    <Share2 size={ 16 } />
                </button>
            </div>
        </div>
    );
}
