import { Suspense } from "react";
import type { Metadata } from "next";
import { searchRepos } from "@/lib/github";
import { SearchInterface } from "@/components/SearchInterface";
import { RepoGrid } from "@/components/RepoGrid";
import { RepoGridSkeleton } from "@/components/RepoGridSkeleton";
import { TrendingTopics } from "@/components/TrendingTopics";
import { Badge } from "@/components/ui/badge";

const DEFAULT_TOPIC = "AI Agents";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// Dynamic metadata generation for SEO
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || DEFAULT_TOPIC;

  return {
    title: `${query} - Trending GitHub Repos | VelocityHunt`,
    description: `Discover the hottest ${query} repositories on GitHub. Real-time velocity tracking of exploding repos before they go viral.`,
    alternates: {
      canonical: `/?q=${encodeURIComponent(query)}`,
    },
    openGraph: {
      title: `${query} - Trending GitHub Repos`,
      description: `Discover the hottest ${query} repositories on GitHub`,
      type: "website",
      url: `https://velocityhunt.vercel.app/?q=${encodeURIComponent(query)}`,
    },
  };
}

// Server Component - SSR by default
export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || DEFAULT_TOPIC;
  const hasQuery = params.q !== undefined;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20">
      {/* Hero Section */ }
      <section className="flex flex-col items-center gap-8 text-center">
        <div className="opacity-0 animate-in fade-in duration-500">
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>Built for GitHub Explorers</span>
          </Badge>
        </div>

        <div className="flex flex-col gap-4 opacity-0 animate-in fade-in duration-500 delay-100">
          <h1 className="text-5xl font-bold font-syne tracking-tight sm:text-7xl">
            Find the next <span className="text-gradient-spark">Spark</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Discover exploding GitHub repositories before they go viral.
            Real-time velocity tracking and ready-to-share insights.
          </p>
        </div>

        <SearchInterface />
      </section>

      {/* Trending Topics - Show only when no search query */ }
      { !hasQuery && <TrendingTopics /> }

      {/* Results Section with Suspense for Streaming */ }
      <Suspense fallback={ <RepoGridSkeleton /> }>
        <RepoResults query={ query } />
      </Suspense>
    </main>
  );
}

// Async Server Component for data fetching
async function RepoResults({ query }: { query: string }) {
  // Use stale-while-revalidate for better performance
  const repos = await searchRepos(query, true).catch((error) => {
    console.error("Failed to fetch repos:", error);
    return [];
  });

  if (repos.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500">
        No sparks found for this topic yet. Try something broader?
      </div>
    );
  }

  return <RepoGrid repos={ repos } query={ query } />;
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;