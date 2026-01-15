"use server";

import { Repo, SparkRepo, calculateSparkScore, calculateGrowth } from "./scoring";
import { getCachedRepos, cacheRepos, getStaleCachedRepos } from "./supabase";
import { memoryCache } from "./cache";

export { type Repo, type SparkRepo };

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
