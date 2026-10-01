import { CheckCircle2, Loader2, TriangleAlert, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeckStatus } from "@/lib/api";

const MAP = {
  PENDING: { label: "In queue", icon: Clock, cls: "bg-muted text-muted-foreground" },
  GENERATING: { label: "Generating", icon: Loader2, cls: "bg-primary/15 text-primary" },
  COMPLETE: { label: "Ready", icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  FAILED: { label: "Failed", icon: TriangleAlert, cls: "bg-destructive/15 text-destructive" },
} as const;

export function StatusBadge({ status }: { status: DeckStatus }) {
  const { label, icon: Icon, cls } = MAP[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", cls)}>
      <Icon className={cn("size-3.5", status === "GENERATING" && "animate-spin")} />
      {label}
    </span>
  );
}
