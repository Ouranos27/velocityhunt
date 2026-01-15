"use client";

import { Star, GitFork, Eye, ExternalLink, Flame, Copy } from "lucide-react";
import { toast } from "sonner";
import { SparkRepo } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "@/components/XIcon";

export function RepoCard({ repo }: { repo: SparkRepo }) {
    const shareText = `Just spotted this 🔥 GitHub spark: ${repo.name} by @${repo.owner.login}
Gained high velocity this week!
→ ${repo.html_url}
Via velocityhunt #indiemaker`;

    const shareOnX = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank");
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            toast.success("Copied to clipboard!", {
                description: "Share this spark anywhere you like ⚡️"
            });
        } catch (err) {
            toast.error("Failed to copy", {
                description: "Please try again"
            });
        }
    };

    return (
        <Card className="glass group relative flex flex-col h-full border-zinc-800 transition-all hover:border-spark/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_-10px_rgba(251,191,36,0.15)]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold text-zinc-100 group-hover:text-spark transition-colors">
                            { repo.name }
                        </CardTitle>
                        <Badge variant="outline" className="bg-zinc-800/50 text-zinc-400 border-zinc-700">
                            { repo.language || "Unknown" }
                        </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">by { repo.owner.login }</p>
                </div>
                <Badge
                    className="bg-spark/10 text-spark hover:bg-spark/20 border-none flex items-center gap-1.5 px-2.5 py-1 cursor-help"
                    title="Spark Score = (Stars × 2 + Forks) ÷ Days Old. Higher = faster growth rate"
                >
                    <Flame size={ 14 } className="fill-spark" />
                    <span className="font-bold">{ repo.sparkScore }</span>
                </Badge>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
                <p className="line-clamp-2 text-sm text-zinc-400 min-h-[2.5rem] mb-4">
                    { repo.description || "No description provided." }
                </p>

                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Star size={ 14 } className="text-zinc-500" />
                        { repo.stargazers_count.toLocaleString() }
                    </div>
                    <div className="flex items-center gap-1">
                        <GitFork size={ 14 } className="text-zinc-500" />
                        { repo.forks_count.toLocaleString() }
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye size={ 14 } className="text-zinc-500" />
                        { repo.watchers_count.toLocaleString() }
                    </div>
                </div>

                <div className="space-y-1.5 mt-auto">
                    <div
                        className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500 font-bold cursor-help"
                        title={ `${repo.growthPercentage}% = ~${Math.round(repo.growthPercentage / 100)} stars/day average` }
                    >
                        <span>Spark Velocity</span>
                        <span className="text-spark">↑ { repo.growthPercentage }%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                            className={ `h-full spark-gradient transition-all duration-500 ${repo.sparkScore > 100 ? "animate-pulse-glow" : ""}` }
                            style={ { width: `${Math.min(100, (repo.sparkScore / 50) * 100)}%` } }
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2 pt-0">
                <Button
                    asChild
                    variant="secondary"
                    className="flex-1 bg-zinc-100 text-zinc-950 hover:bg-white font-bold"
                >
                    <a
                        href={ repo.html_url }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Repo <ExternalLink className="ml-1" size={ 16 } />
                    </a>
                </Button>
                <Button
                    onClick={ copyToClipboard }
                    variant="outline"
                    size="icon"
                    className="border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer"
                    title="Copy to clipboard"
                >
                    <Copy size={ 16 } />
                </Button>
                <Button
                    onClick={ shareOnX }
                    variant="outline"
                    size="icon"
                    className="border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer"
                    title="Share on X"
                >
                    <XIcon size={ 16 } />
                </Button>
            </CardFooter>
        </Card>
    );
}
