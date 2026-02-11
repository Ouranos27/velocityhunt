import { Flame } from "lucide-react";
import Link from "next/link";
import { XIcon } from "./XIcon";
import { GithubIcon } from "./GithubIcon";

export function Footer() {
    return (
        <footer className="relative z-10 border-t border-zinc-900 bg-black/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */ }
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Flame className="text-spark fill-spark" size={ 24 } />
                            <span className="text-xl font-bold font-syne text-zinc-100">
                                VelocityHunt
                            </span>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                            Discover high-velocity GitHub repositories before they boom. Built for makers, contributors, and the curious.
                        </p>
                    </div>

                    {/* Quick Links */ }
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/?q=AI%20Agents"
                                    className="text-zinc-500 transition-colors hover:text-spark"
                                >
                                    AI Agents
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/?q=React%20Libraries"
                                    className="text-zinc-500 transition-colors hover:text-spark"
                                >
                                    React Libraries
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/?q=SaaS%20Boilerplates"
                                    className="text-zinc-500 transition-colors hover:text-spark"
                                >
                                    SaaS Boilerplates
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */ }
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                            Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://github.com/Ouranos27/velocityhunt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 transition-colors hover:text-spark"
                                >
                                    Source Code
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/Ouranos27/velocityhunt#readme"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 transition-colors hover:text-spark"
                                >
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/Ouranos27/velocityhunt/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 transition-colors hover:text-spark"
                                >
                                    Report Issue
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* How It Works */ }
                    <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                            How Scoring Works
                        </h3>
                        <div className="space-y-2 text-xs text-zinc-500 leading-relaxed">
                            <p>
                                <span className="text-spark font-semibold">Spark Score</span> = (Stars × 2 + Forks) ÷ Days Old × Activity Factor
                            </p>
                            <p>
                                Higher scores mean faster growth. We penalize inactive repos and boost recently updated ones.
                            </p>
                            <p>
                                <span className="text-zinc-400 font-semibold">Velocity %</span> = Stars per day × 100. A repo gaining 5 stars/day shows 500% velocity.
                            </p>
                        </div>
                    </div>

                    {/* Connect */ }
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                            Connect
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/Ouranos27"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-zinc-800 p-2.5 text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                                aria-label="GitHub"
                            >
                                <GithubIcon size={ 20 } />
                            </a>
                            <a
                                href="https://x.com/PipolmPk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-zinc-800 p-2.5 text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                                aria-label="Follow on X"
                            >
                                <XIcon size={ 20 } />
                            </a>
                        </div>
                        <p className="text-xs text-zinc-600">
                            Built in 48h for{ " " }
                            <a
                                href="https://x.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-spark hover:underline font-bold"
                            >
                                @&apos;s  challenge
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */ }
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-8 text-sm text-zinc-600 sm:flex-row">
                    <p>
                        © { new Date().getFullYear() } VelocityHunt. Built with 💛 by{ " " }
                        <a
                            href="https://x.com/PipolmPk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-spark transition-colors"
                        >
                            Philippe
                        </a>
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                            <GithubIcon className="w-5 h-5" />
                            Powered by GitHub API
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
