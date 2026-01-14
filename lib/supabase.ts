import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db, repoCache } from "./db";
import { SparkRepo } from "./github";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function getCachedRepos(topic: string) {
    if (!db) return null;

    try {
        const result = await db
            .select()
            .from(repoCache)
            .where(eq(repoCache.query, topic))
            .limit(1);

        if (!result || result.length === 0) return null;

        const data = result[0];

        // Check if cache is fresh (e.g., < 6 hours)
        const updatedAt = new Date(data.updatedAt);
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

        if (updatedAt < sixHoursAgo) return null;

        return data.results;
    } catch (err) {
        console.error("Drizzle getCachedRepos error:", err);
        return null;
    }
}

export async function getStaleCachedRepos(topic: string) {
    if (!db) return null;

    try {
        const result = await db
            .select()
            .from(repoCache)
            .where(eq(repoCache.query, topic))
            .limit(1);

        if (!result || result.length === 0) return null;

        const data = result[0];

        // Return stale cache only if it's not too old (< 24 hours)
        const updatedAt = new Date(data.updatedAt);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        if (updatedAt < twentyFourHoursAgo) return null;

        return data.results;
    } catch (err) {
        console.error("Drizzle getStaleCachedRepos error:", err);
        return null;
    }
}

export async function cacheRepos(topic: string, results: SparkRepo[]) {
    if (!db) return;

    try {
        await db
            .insert(repoCache)
            .values({
                query: topic,
                results,
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: repoCache.query,
                set: {
                    results,
                    updatedAt: new Date(),
                },
            });
    } catch (err) {
        console.error("Drizzle cacheRepos error:", err);
    }
}
