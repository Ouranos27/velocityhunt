import { Skeleton } from "@/components/ui/skeleton";

export function RepoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(12)].map((_, i) => (
        <Skeleton key={i} className="h-[320px] w-full rounded-xl bg-zinc-900/50" />
      ))}
    </div>
  );
}
