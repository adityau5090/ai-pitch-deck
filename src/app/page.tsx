import { IdeaForm } from "@/components/deck/idea-form";
import { DeckGrid } from "@/components/deck/deck-grid";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-16 text-center sm:py-24">
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Your idea, <span className="text-shine">pitch-ready</span> before your coffee cools.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Describe your startup in a few sentences and get a designed investor deck: problem, solution, market, business model and the ask.
        </p>
        <div className="mt-10"><IdeaForm /></div>
      </section>

      <section className="pb-20">
        <h2 className="mb-5 font-display text-2xl font-bold tracking-tight">Your decks</h2>
        <DeckGrid />
      </section>
    </div>
  );
}
