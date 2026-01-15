
import { calculateSparkScore, calculateGrowth, Repo } from "../lib/github";

const ONE_DAY = 1000 * 60 * 60 * 24;

function createMockRepo(name: string, daysOld: number, stars: number, forks: number, daysSinceUpdate: number): Repo {
    const now = new Date();
    const created = new Date(now.getTime() - daysOld * ONE_DAY);
    const updated = new Date(now.getTime() - daysSinceUpdate * ONE_DAY);

    return {
        id: Math.random(),
        name,
        full_name: `test/${name}`,
        owner: { login: "test", avatar_url: "" },
        html_url: "",
        description: "test",
        stargazers_count: stars,
        forks_count: forks,
        watchers_count: stars,
        language: "TypeScript",
        created_at: created.toISOString(),
        updated_at: updated.toISOString(),
        pushed_at: updated.toISOString(),
    };
}

const scenarios = [
    createMockRepo("New Viral", 3, 300, 50, 0.1),
    createMockRepo("Old Reliable", 730, 20000, 3000, 1),
];

console.log("--- Scoring Verification ---");
scenarios.forEach(repo => {
    const spark = calculateSparkScore(repo);
    const growth = calculateGrowth(repo);
    console.log(`Repo: ${repo.name} | Spark: ${spark} | Growth: ${growth}%`);
});
