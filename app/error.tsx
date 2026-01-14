"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-6 py-40 text-center">
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8">
        <h2 className="mb-4 text-2xl font-bold text-red-400">
          Something went wrong!
        </h2>
        <p className="mb-6 text-zinc-400">
          {error.message || "An unexpected error occurred while loading the page."}
        </p>
        <Button
          onClick={reset}
          className="bg-spark text-zinc-950 hover:bg-spark/90"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
