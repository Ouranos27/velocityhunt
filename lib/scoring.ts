
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
