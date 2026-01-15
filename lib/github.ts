"use server";

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

import { getCachedRepos, cacheRepos, getStaleCachedRepos } from "./supabase";
import { memoryCache } from "./cache";

export async function searchRepos(topic: string, useStale = false): Promise<SparkRepo[]> {
    // 1. Check in-memory cache first (fastest)
    const memCached = memoryCache.get(topic);
    if (memCached) {
        console.log("Cache hit: memory");
        return memCached;
    }

    // 2. Check database cache (fast)
    try {
        const dbCached = await getCachedRepos(topic);
        if (dbCached) {
            console.log("Cache hit: database");
            // Store in memory for next time
            memoryCache.set(topic, dbCached);
            return dbCached;
        }

        // 3. If allowed, return stale cache while revalidating in background
        if (useStale) {
            const staleCache = await getStaleCachedRepos(topic);
            if (staleCache) {
                console.log("Cache hit: stale (revalidating in background)");
                // Revalidate in background (fire and forget)
                fetchAndCacheRepos(topic).catch(console.error);
                return staleCache;
            }
        }
    } catch (err) {
        console.error("Cache read error:", err);
    }

    // 4. Fetch fresh data
    return fetchAndCacheRepos(topic);
}

async function fetchAndCacheRepos(topic: string): Promise<SparkRepo[]> {

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
    const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=30`;

    let items: Repo[] = [];
    try {
        const res = await fetch(url, { headers, cache: "no-store" });
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.statusText}`);
        }
        const data = await res.json();
        items = data.items || [];
    } catch (err) {
        console.error("GitHub API fetch error:", err);
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

    // Cache results in both memory and database
    if (results.length > 0) {
        memoryCache.set(topic, results);
        cacheRepos(topic, results).catch(console.error);
    }

    return results;
}

export function calculateSparkScore(repo: Repo): number {
    // PRD: "Spark" = New + Growing Fast
    // Formula: (Stars * 2 + Forks) / Days_Live
    // Penalize inactivity: If not updated in 30 days, score decays rapidly

    const createdAt = new Date(repo.created_at);
    const updatedAt = new Date(repo.updated_at);
    const now = new Date();

    const daysOld = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceUpdate = Math.max(0, (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

    // Base Velocity: Points per day
    const baseScore = (repo.stargazers_count * 2 + repo.forks_count) / daysOld;

    // Inactivity Decay: Score halves every 30 days of inactivity
    const activityFactor = 1 / (1 + (daysSinceUpdate / 30));

    return Math.round(baseScore * activityFactor * 10) / 10;
}

export function calculateGrowth(repo: Repo): number {
    // "Growth %" proxy: Daily Star Velocity normalized
    // If a repo gets 1 star/day, we call that "100% velocity" (baseline)
    // If 10 stars/day -> 1000% velocity

    const createdAt = new Date(repo.created_at);
    const updatedAt = new Date(repo.updated_at);
    const now = new Date();

    const daysOld = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceUpdate = Math.max(0, (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

    // Stars per day
    const velocity = repo.stargazers_count / daysOld;

    // Recency Boost: If updated in last 3 days, boost by 20%
    const recentBoost = daysSinceUpdate < 3 ? 1.2 : 1.0;

    // Convert to percentage logic (arbitrary scaling for intuitive numbers)
    // 0.5 stars/day -> 50%
    // 5 stars/day -> 500%
    return Math.round(velocity * 100 * recentBoost);
}
