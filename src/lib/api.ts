export type DeckStatus = "PENDING" | "GENERATING" | "COMPLETE" | "FAILED";

export type SlideDTO = { id: string; order: number; title: string; content: string; imageUrl: string | null };
export type DeckSummary = {
  id: string;
  idea: string;
  title: string | null;
  status: DeckStatus;
  createAt: string;
  slideCount: number;
};
export type DeckDetail = Omit<DeckSummary, "slideCount"> & { errorMessage: string; slides: SlideDTO[] };

export const isWorking = (s?: DeckStatus) => s === "PENDING" || s === "GENERATING";
export const EXPECTED_SLIDES = 7; // matches the 7-slide order in pitch-deck-agent.ts

async function json<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error ?? "Something went wrong");
  return body as T;
}

export const listDecks = () => fetch("/api/decks").then((r) => json<DeckSummary[]>(r));
export const getDeck = (id: string) => fetch(`/api/decks/${id}`).then((r) => json<DeckDetail>(r));
export const createDeck = (idea: string) =>
  fetch("/api/decks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  }).then((r) => json<{ id: string }>(r));
