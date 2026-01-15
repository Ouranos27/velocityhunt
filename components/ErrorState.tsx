"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    message = "We're having trouble fetching data. This might be due to GitHub API rate limits.",
    onRetry
}: ErrorStateProps) {
    return (
        <div className="flex items-center justify-center py-20">
            <Card className="glass max-w-md border-red-900/50">
                <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                    <div className="rounded-full bg-red-900/20 p-4">
                        <AlertCircle size={ 40 } className="text-red-400" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-100">{ title }</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                { message }
                            </p>
                        </div>

                        { onRetry && (
                            <Button
                                onClick={ onRetry }
                                className="group w-full gap-2 bg-zinc-100 text-zinc-950 hover:bg-white font-bold transition-all active:scale-[0.98]"
                            >
                                <RefreshCcw size={ 16 } className="transition-transform group-hover:rotate-180 duration-500" />
                                Try Again
                            </Button>
                        ) }
                    </div>

                    <div className="flex flex-col gap-2 text-xs text-zinc-600">
                        <p>💡 Tip: Try a different topic or wait a few minutes.</p>
                        <p>
                            Check{ " " }
                            <a
                                href="https://www.githubstatus.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-spark underline"
                            >
                                GitHub Status
                            </a>
                            { " " }if issues persist.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
