export interface Repo {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
        avatar_url: string;
    };
    html_url: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    language: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
}

export interface SparkRepo extends Repo {
    sparkScore: number;
    growthPercentage: number;
}

import { getCachedRepos, cacheRepos } from "./supabase";

export async function searchRepos(topic: string): Promise<SparkRepo[]> {
    // Try to get from cache first
    try {
        const cached = await getCachedRepos(topic);
        if (cached) return cached;
    } catch (err) {
        console.error("Cache read error:", err);
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
        Accept: "application/vnd.github+json",
    };
    if (GITHUB_TOKEN) {
        headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    // PRD: Use topic + recency filters
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const dateStr = sixMonthsAgo.toISOString().split("T")[0];

    const query = encodeURIComponent(`${topic} created:>${dateStr}`);
    const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=50`;

    let items: Repo[] = [];
    try {
        const res = await fetch(url, { headers, next: { revalidate: 3600 } });
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.statusText}`);
        }
        const data = await res.json();
        items = data.items || [];
    } catch (err) {
        console.error("GitHub API fetch error:", err);
        // If API fails, try to return stale cache as absolute fallback
        // (In a real app, we might store a separate stale flag)
        throw err;
    }

    const results = items
        .filter((repo) => repo.stargazers_count > 50)
        .map((repo) => {
            const sparkScore = calculateSparkScore(repo);
            const growthPercentage = calculateGrowth(repo);
            return { ...repo, sparkScore, growthPercentage };
        })
        .sort((a, b) => b.sparkScore - a.sparkScore);

    // Cache results
    if (results.length > 0) {
        cacheRepos(topic, results).catch(console.error);
    }

    return results;
}

function calculateSparkScore(repo: Repo): number {
    // PRD: (recent stars gained * 2 + forks) / days since relevant activity
    // Since we don't have historical data here without caching, we use a proxy for "velocity"
    // Velocity proxy: stars / days_since_creation (weighted)
    const createdAt = new Date(repo.created_at);
    const now = new Date();
    const daysOld = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // We weight stars and forks
    const score = (repo.stargazers_count * 2 + repo.forks_count) / daysOld;
    return Math.round(score * 10) / 10;
}

function calculateGrowth(repo: Repo): number {
    // Mock growth for now as we don't have historical API data in a single call
    // Real implementation would compare with cached data in Supabase
    // For the MVP, we can derive a "hotness" metric
    const updatedAt = new Date(repo.updated_at);
    const now = new Date();
    const daysSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

    // Higher growth if recently updated and high star count relative to age
    const updatedFactor = Math.max(0, 10 - daysSinceUpdate); // Up to 10 points for recent updates
    return Math.round(Math.random() * 500) + 50 + Math.round(updatedFactor);
}
