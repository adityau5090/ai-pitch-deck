"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDeck } from "@/lib/api";

const MIN = 20; // same minimum the agent's input guardrail enforces
const EXAMPLES = [
  "An app that matches busy parents with vetted neighbourhood babysitters in under 5 minutes",
  "A marketplace where farmers sell surplus produce directly to local restaurants",
  "An AI tutor that turns any textbook chapter into a personal 10-minute lesson",
];

export function IdeaForm() {
  const [idea, setIdea] = useState("");
  const router = useRouter();
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: createDeck,
    onSuccess: ({ id }) => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      router.push(`/deck/${id}`);
    },
  });

  const ready = idea.trim().length >= MIN;
  const submit = () => ready && !create.isPending && create.mutate(idea);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="glow-border">
        <div className="rounded-[calc(var(--radius)*1.6-2px)] bg-card p-3 sm:p-4">
          <label htmlFor="idea" className="sr-only">Your startup idea</label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === "Enter" && submit()}
            rows={4}
            maxLength={600}
            placeholder="Describe your startup idea. Who is it for, and what problem does it solve?"
            className="w-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-muted-foreground/70 sm:text-lg"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {ready ? `${idea.trim().length}/600` : `${Math.max(0, MIN - idea.trim().length)} more characters needed`}
            </span>
            <Button size="lg" onClick={submit} disabled={!ready || create.isPending} className="h-10 rounded-xl px-4 text-sm shadow-lg shadow-primary/30">
              {create.isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {create.isPending ? "Starting…" : "Generate deck"}
              {!create.isPending && <ArrowRight />}
            </Button>
          </div>
        </div>
      </div>

      {create.isError && (
        <p role="alert" className="mt-3 text-center text-sm text-destructive">{create.error.message}</p>
      )}

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((ex, i) => (
          <motion.button
            key={ex}
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIdea(ex)}
            className="max-w-xs truncate rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
            title={ex}
          >
            Try: {["Babysitter app", "Farm-to-table market", "AI tutor"][i]}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
