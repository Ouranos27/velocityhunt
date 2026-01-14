import { createClient } from "@supabase/supabase-js";
import { SparkRepo } from "./github";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function getCachedRepos(topic: string) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from("repo_cache")
            .select("*")
            .eq("query", topic)
            .single();

        if (error || !data) return null;

        // Check if cache is fresh (e.g., < 6 hours)
        const updatedAt = new Date(data.updated_at);
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

        if (updatedAt < sixHoursAgo) return null;

        return data.results;
    } catch (err) {
        console.error("Supabase getCachedRepos error:", err);
        return null;
    }
}

export async function cacheRepos(topic: string, results: SparkRepo[]) {
    if (!supabase) return;

    try {
        const { error } = await supabase
            .from("repo_cache")
            .upsert({
                query: topic,
                results,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            console.error("Error caching repos:", error);
        }
    } catch (err) {
        console.error("Supabase cacheRepos error:", err);
    }
}
