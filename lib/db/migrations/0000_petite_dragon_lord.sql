CREATE TABLE "repo_cache" (
	"query" text PRIMARY KEY NOT NULL,
	"results" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "updated_at_idx" ON "repo_cache" USING btree ("updated_at");