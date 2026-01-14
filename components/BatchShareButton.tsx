"use client";

import { Button } from "@/components/ui/button";
import { SparkRepo } from "@/lib/github";

interface BatchShareButtonProps {
    repos: SparkRepo[];
    topic: string;
}

export function BatchShareButton({ repos, topic }: BatchShareButtonProps) {
    const shareOnX = () => {
        const topRepos = repos.slice(0, 5);
        let text = `Searching for "${topic}" sparks? Check these out! ⚡️\n\n`;

        topRepos.forEach((repo, idx) => {
            text += `${idx + 1}. ${repo.name} - ${repo.sparkScore.toFixed(0)} score\n`;
        });

        text += `\nDiscover more at ${window.location.origin}`;

        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    if (repos.length === 0) return null;

    return (
        <Button
            onClick={ shareOnX }
            className="gap-2 rounded-xl bg-sky-500 font-bold text-white hover:bg-sky-600 active:scale-95 w-full sm:w-auto cursor-pointer"
        >
            <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-label="X logo"
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share Top 5 on X
        </Button>
    );
}
