"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const TRENDING = [
    { topic: "AI Agents", emoji: "🤖", description: "Autonomous AI systems" },
    { topic: "LLM Tools", emoji: "🧠", description: "Language model utilities" },
    { topic: "React Libraries", emoji: "⚛️", description: "React ecosystem" },
    { topic: "Next.js Starters", emoji: "▲", description: "Full-stack templates" },
    { topic: "SaaS Boilerplates", emoji: "🚀", description: "Ship faster" },
    { topic: "Web3", emoji: "⛓️", description: "Blockchain & crypto" },
];

export function TrendingTopics() {
    const router = useRouter();

    const handleTopicClick = (topic: string) => {
        router.push(`/?q=${encodeURIComponent(topic)}`);
    };

    return (
        <section className="flex flex-col gap-6">
            <motion.div
                initial={ { opacity: 0, x: -20 } }
                animate={ { opacity: 1, x: 0 } }
                className="flex items-center gap-2"
            >
                <TrendingUp className="text-spark" size={ 20 } />
                <h2 className="text-xl font-bold text-zinc-100">
                    Trending Topics
                </h2>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="show"
                variants={ {
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                } }
            >
                { TRENDING.map((item) => (
                    <motion.div
                        key={ item.topic }
                        variants={ {
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                        } }
                        whileHover={ { y: -5 } }
                        transition={ { duration: 0.2 } }
                    >
                        <Card
                            onClick={ () => handleTopicClick(item.topic) }
                            className="glass group cursor-pointer border-zinc-800 transition-all hover:border-spark/50 hover:bg-white/[0.05] hover:shadow-[0_0_20px_-10px_rgba(251,191,36,0.15)] active:scale-[0.98]"
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-2xl transition-transform group-hover:scale-110">
                                    { item.emoji }
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-zinc-100 group-hover:text-spark transition-colors">
                                        { item.topic }
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        { item.description }
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="bg-spark/10 text-spark border-spark/20 text-xs"
                                >
                                    Hot
                                </Badge>
                            </CardContent>
                        </Card>
                    </motion.div>
                )) }
            </motion.div>
        </section>
    );
}
