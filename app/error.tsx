"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const isRateLimitError = error.message.includes("rate limit") || error.message.includes("403");

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20">
      <ErrorState
        title={isRateLimitError ? "GitHub API Rate Limit Exceeded" : "Something went wrong!"}
        message={
          isRateLimitError
            ? "We've hit GitHub's rate limit. Try adding a GITHUB_TOKEN to your environment variables or wait a few minutes."
            : error.message || "An unexpected error occurred. Please try again in a moment."
        }
        onRetry={reset}
      />
    </main>
  );
}
