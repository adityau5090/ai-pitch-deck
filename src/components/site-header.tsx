import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/ui/modeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.75_0.17_25)] text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:rotate-12 group-hover:scale-110">
            <Sparkles className="size-4" />
          </span>
          Pitch Deck AI
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
}
