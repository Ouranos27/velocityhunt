"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { SparkRepo } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { BatchShareButton } from "@/components/BatchShareButton";

interface RepoGridProps {
  repos: SparkRepo[];
  query: string;
}

export function RepoGrid({ repos, query }: RepoGridProps) {
  if (repos.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 animate-in">
        No sparks found for this topic yet. Try something broader?
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <motion.div
        initial={ { opacity: 0, x: -20 } }
        animate={ { opacity: 1, x: 0 } }
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-4"
      >
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
            <Flame className="text-spark fill-spark" size={ 20 } />
            Sparks found for &quot;{ query }&quot;
          </h2>
          <p className="text-sm text-zinc-500">{ repos.length } results sorted by velocity</p>
        </div>
        <div className="w-full sm:w-auto">
          <BatchShareButton repos={ repos } topic={ query } />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={ {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        } }
      >
        { repos.map((repo) => (
          <motion.div
            key={ repo.id }
            variants={ {
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            } }
            whileHover={ { y: -5 } }
            transition={ { duration: 0.2 } }
          >
            <RepoCard repo={ repo } />
          </motion.div>
        )) }
      </motion.div>
    </section>
  );
}
