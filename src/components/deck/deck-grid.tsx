"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { listDecks, isWorking } from "@/lib/api";
import { StatusBadge } from "./status-badge";

export function DeckGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["decks"],
    queryFn: listDecks,
    refetchInterval: (q) => (q.state.data?.some((d) => isWorking(d.status)) ? 3000 : false),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="shimmer h-36 rounded-2xl bg-muted" />)}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
        Your decks will show up here. Describe an idea above to make your first one.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((d, i) => (
        <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Link
            href={`/deck/${d.id}`}
            className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/15"
          >
            <div className="absolute -right-10 -top-10 size-28 rounded-full bg-primary/20 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold leading-snug line-clamp-2">
                {d.title ?? "Untitled deck"}
              </h3>
              <StatusBadge status={d.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.idea}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Layers className="size-3.5" />
              {d.slideCount} {d.slideCount === 1 ? "slide" : "slides"}
              <span className="ml-auto">{new Date(d.createAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
