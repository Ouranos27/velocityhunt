"use client";

import { useState, useEffect } from "react";
import { Search, Flame, Loader2, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchRepos, SparkRepo } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { BatchShareButton } from "@/components/BatchShareButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const SUGGESTIONS = [
  "AI Agents",
  "React Libraries",
  "LLM Tools",
  "Next.js Starters",
  "Rust Utilities",
  "Python Automation",
  "Cybersecurity",
  "Web3",
  "SaaS Boilerplates",
];

const DEFAULT_TOPIC = "AI Agents";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<SparkRepo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(DEFAULT_TOPIC);
    handleSearch(undefined, DEFAULT_TOPIC);
  }, []);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const searchTopic = customQuery || query;
    if (!searchTopic) return;

    setLoading(true);
    setError(null);
    try {
      const results = await searchRepos(searchTopic);
      setRepos(results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20">
      {/* Hero Section */ }
      <section className="flex flex-col items-center gap-8 text-center">
        <motion.div
          initial={ { opacity: 0, y: -20 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.5 } }
        >
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900/50">
            <Github size={ 16 } className="mr-2" />
            <span>Built for GitHub Explorers</span>
          </Badge>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          initial={ { opacity: 0, y: 20 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.5, delay: 0.1 } }
        >
          <h1 className="text-5xl font-bold font-syne tracking-thight sm:text-7xl">
            Find the next <span className="text-spark">Spark</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Discover exploding GitHub repositories before they go viral.
            Real-time velocity tracking and ready-to-share insights.
          </p>
        </motion.div>

        <motion.form
          onSubmit={ handleSearch }
          className="relative flex w-full max-w-2xl items-center"
          initial={ { opacity: 0, scale: 0.95 } }
          animate={ { opacity: 1, scale: 1 } }
          transition={ { duration: 0.5, delay: 0.2 } }
        >
          <div className="pointer-events-none absolute left-5 z-10 text-zinc-500">
            <Search size={ 22 } />
          </div>
          <Input
            type="text"
            value={ query }
            onChange={ (e) => setQuery(e.target.value) }
            placeholder="Search topic (e.g. AI, Next.js, Rust...)"
            className="h-16 w-full rounded-2xl border-zinc-800 bg-zinc-900/50 pl-14 pr-32 text-lg text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-spark/50"
          />
          <Button
            type="submit"
            disabled={ loading }
            className="absolute right-2 h-12 rounded-xl bg-spark px-6 text-sm font-bold text-zinc-950 hover:bg-spark/90 active:scale-95 disabled:opacity-50"
          >
            { loading ? <Loader2 className="animate-spin" size={ 18 } /> : "Search" }
          </Button>
        </motion.form>

        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          transition={ { duration: 0.5, delay: 0.3 } }
        >
          <span className="text-sm text-zinc-600 self-center mr-2">Suggestions:</span>
          { SUGGESTIONS.map((s) => (
            <Badge
              key={ s }
              variant="outline"
              className="cursor-pointer border-zinc-800 px-4 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800/50"
              onClick={ () => {
                setQuery(s);
                handleSearch(undefined, s);
              } }
            >
              { s }
            </Badge>
          )) }
        </motion.div>
      </section>

      {/* Results Section */ }
      <section className="flex flex-col gap-8">
        <AnimatePresence mode="wait">
          { repos.length > 0 && !loading && (
            <motion.div
              key="results-header"
              initial={ { opacity: 0, x: -20 } }
              animate={ { opacity: 1, x: 0 } }
              exit={ { opacity: 0, x: 20 } }
              className="flex items-center justify-between border-b border-zinc-900 pb-4"
            >
              <div className="flex flex-col gap-1">
                <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                  <Flame className="text-spark fill-spark" size={ 20 } />
                  Sparks found for &quot;{ query }&quot;
                </h2>
                <p className="text-sm text-zinc-500">{ repos.length } results sorted by velocity</p>
              </div>
              <BatchShareButton repos={ repos } topic={ query } />
            </motion.div>
          ) }
        </AnimatePresence>

        { error && (
          <motion.div
            initial={ { opacity: 0, scale: 0.9 } }
            animate={ { opacity: 1, scale: 1 } }
            className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center text-red-400"
          >
            { error }
          </motion.div>
        ) }

        { loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            { [...Array(12)].map((_, i) => (
              <Skeleton key={ i } className="h-[320px] w-full rounded-xl bg-zinc-900/50" />
            )) }
          </div>
        ) }

        { !loading && repos.length === 0 && query && !error && (
          <div className="py-20 text-center text-zinc-500 animate-in">
            No sparks found for this topic yet. Try something broader?
          </div>
        ) }

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={ {
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.015
              }
            }
          } }
        >
          { repos.map((repo) => (
            <motion.div
              key={ repo.id }
              variants={ {
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              } }
              whileHover={ { y: -5 } }
              transition={ { duration: 0.2 } }
            >
              <RepoCard repo={ repo } />
            </motion.div>
          )) }
        </motion.div>
      </section>
    </main>
  );
}
