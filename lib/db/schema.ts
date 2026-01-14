import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import type { SparkRepo } from "../github";

export const repoCache = pgTable("repo_cache", {
  query: text("query").primaryKey(),
  results: jsonb("results").$type<SparkRepo[]>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type RepoCache = typeof repoCache.$inferSelect;
export type NewRepoCache = typeof repoCache.$inferInsert;
