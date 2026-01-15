"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/XIcon";
import { SparkRepo } from "@/lib/github";

interface BatchShareButtonProps {
    repos: SparkRepo[];
    topic: string;
}

export function BatchShareButton({ repos, topic }: BatchShareButtonProps) {
    const getBatchText = () => {
        const topRepos = repos.slice(0, 5);
        let text = `Searching for "${topic}" sparks? Check these out! ⚡️\n\n`;

        topRepos.forEach((repo, idx) => {
            text += `${idx + 1}. ${repo.name} - ${repo.sparkScore.toFixed(0)} score\n`;
        });

        text += `\nDiscover more at ${typeof window !== 'undefined' ? window.location.origin : 'velocityhunt.vercel.app'}`;
        return text;
    };

    const shareOnX = () => {
        const text = getBatchText();
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(getBatchText());
            toast.success("Copied to clipboard!", {
                description: "Top 5 sparks ready to share ⚡️"
            });
        } catch {
            toast.error("Failed to copy", {
                description: "Please try again"
            });
        }
    };

    if (repos.length === 0) return null;

    return (
        <div className="flex gap-2 w-full sm:w-auto">
            <Button
                onClick={ copyToClipboard }
                variant="outline"
                className="gap-2 rounded-xl border-zinc-800 font-bold hover:bg-zinc-800 cursor-pointer"
            >
                <Copy size={ 18 } />
                <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button
                onClick={ shareOnX }
                className="gap-2 rounded-xl bg-sky-500 font-bold text-white hover:bg-sky-600 active:scale-95 flex-1 sm:flex-initial cursor-pointer"
            >
                <XIcon size={ 18 } />
                <span className="hidden sm:inline">Share Top 5</span>
                <span className="sm:hidden">Share</span>
            </Button>
        </div>
    );
}
