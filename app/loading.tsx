import { RepoGridSkeleton } from "@/components/RepoGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20">
      <section className="flex flex-col items-center gap-8 text-center">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-zinc-800/50" />
        <div className="h-32 w-full max-w-2xl animate-pulse rounded-lg bg-zinc-800/50" />
        <div className="h-16 w-full max-w-2xl animate-pulse rounded-2xl bg-zinc-800/50" />
      </section>

      <RepoGridSkeleton />
    </main>
  );
}
