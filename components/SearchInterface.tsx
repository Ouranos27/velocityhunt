"use client";

import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

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

export function SearchInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const searchTopic = customQuery || query;
    if (!searchTopic) return;

    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(searchTopic)}`);
    });
  };

  return (
    <section className="flex flex-col items-center gap-8 text-center">
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
          placeholder="Search topic..."
          className="h-16 w-full rounded-2xl border-zinc-800 bg-zinc-900/50 pl-14 pr-16 sm:pr-32 text-lg text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-spark/50"
        />
        <Button
          type="submit"
          disabled={ isPending }
          className="absolute right-2 h-12 rounded-xl bg-spark px-4 sm:px-6 text-sm font-bold text-zinc-950 hover:bg-spark/90 active:scale-95 disabled:opacity-50"
        >
          { isPending ? <Loader2 className="animate-spin" size={ 18 } /> : (
            <>
              <Search size={ 18 } className="sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </>
          ) }
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
  );
}
