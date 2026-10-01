"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, ImageOff, Maximize2, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EXPECTED_SLIDES, getDeck, isWorking, type SlideDTO } from "@/lib/api";
import { StatusBadge } from "./status-badge";

const bullets = (text: string) => text.split("\n").map((l) => l.replace(/^[\s•●·\-*]+/, "").trim()).filter(Boolean);

function SlideImage({ slide, className }: { slide: SlideDTO; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!slide.imageUrl || failed)
    return <div className={cn("grid place-items-center bg-muted text-muted-foreground", className)}><ImageOff className="size-6" /></div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={slide.imageUrl} alt={slide.title} onError={() => setFailed(true)} className={cn("object-cover", className)} />;
}

export function DeckViewer({ id }: { id: string }) {
  const { data: deck, isLoading, error } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(id),
    refetchInterval: (q) => (isWorking(q.state.data?.status) ? 2500 : false),
  });
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const count = deck?.slides.length ?? 0;

  const go = useCallback((to: number) => {
    if (to < 0 || to >= count) return;
    setDir(to > index ? 1 : -1);
    setIndex(to);
  }, [count, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (isLoading) return <div className="mx-auto max-w-5xl p-6"><div className="shimmer aspect-video rounded-3xl bg-muted" /></div>;
  if (error || !deck)
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <p className="font-display text-xl font-semibold">We couldn’t find this deck</p>
        <p className="mt-1 text-sm text-muted-foreground">It may have been deleted. Start a new one from the home page.</p>
        <Button className="mt-5" nativeButton={false} render={<Link href="/" />}>Back to home</Button>
      </div>
    );

  const working = isWorking(deck.status);
  const slide = deck.slides[Math.min(index, count - 1)];
  const pending = working ? Math.max(0, EXPECTED_SLIDES - count) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/" aria-label="Back to home" />}><ArrowLeft /></Button>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{deck.title ?? "Writing your deck…"}</h1>
        <StatusBadge status={deck.status} />
      </div>

      {deck.status === "FAILED" && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Generation stopped</p>
            <p className="text-muted-foreground">{deck.errorMessage || "Something went wrong. Try again with a more detailed idea."}</p>
          </div>
        </div>
      )}

      {/* Stage */}
      <div ref={stage} className="group/stage relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
        <div className="relative aspect-video">
          <AnimatePresence mode="wait" custom={dir}>
            {slide ? (
              <motion.div
                key={slide.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.28 }}
                className="absolute inset-0 grid grid-cols-5 gap-4 p-5 sm:gap-8 sm:p-10"
              >
                <div className="col-span-3 flex flex-col justify-center">
                  <h2 className="font-display text-xl font-bold leading-tight sm:text-4xl">{slide.title}</h2>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground sm:mt-5 sm:space-y-3 sm:text-lg">
                    {bullets(slide.content).map((b, i) => (
                      <motion.li key={b} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.07 }} className="flex gap-2.5">
                        <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-primary sm:size-2" />
                        <span className="text-foreground/85">{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="w-full rotate-2 overflow-hidden rounded-2xl border-4 border-card shadow-xl shadow-primary/25 transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]">
                    <SlideImage slide={slide} className="aspect-square w-full" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <Sparkles className="mx-auto size-8 animate-pulse text-primary" />
                  <p className="mt-3 font-display text-lg font-semibold">Drafting your first slide…</p>
                  <p className="text-sm text-muted-foreground">Slides appear here as soon as they’re ready.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => go(index - 1)} disabled={index === 0 || !count} aria-label="Previous slide"><ChevronLeft /></Button>
            <Button variant="ghost" size="icon" onClick={() => go(index + 1)} disabled={index >= count - 1} aria-label="Next slide"><ChevronRight /></Button>
          </div>
          <span className="text-sm tabular-nums text-muted-foreground">{count ? `${index + 1} of ${working ? `${count}+` : count}` : "—"}</span>
          <Button variant="ghost" size="icon" onClick={() => stage.current?.requestFullscreen?.()} aria-label="Present full screen"><Maximize2 /></Button>
        </div>
      </div>

      {/* Thumbnails: placeholders shimmer until Inngest saves each slide */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {deck.slides.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            className={cn(
              "w-28 shrink-0 overflow-hidden rounded-xl border-2 text-left transition-all hover:-translate-y-0.5",
              i === index ? "border-primary shadow-lg shadow-primary/30" : "border-border opacity-70 hover:opacity-100"
            )}
          >
            <SlideImage slide={s} className="aspect-video w-full" />
            <p className="truncate bg-card px-2 py-1 text-[11px] font-medium">{s.title}</p>
          </motion.button>
        ))}
        {Array.from({ length: pending }).map((_, i) => (
          <div key={i} className="shimmer h-[5.4rem] w-28 shrink-0 rounded-xl bg-muted" aria-hidden />
        ))}
      </div>
    </div>
  );
}
