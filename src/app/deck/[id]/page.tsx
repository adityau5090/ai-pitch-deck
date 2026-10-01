import { DeckViewer } from "@/components/deck/deck-viewer";

export default async function DeckPage({ params }: PageProps<"/deck/[id]">) {
  const { id } = await params;
  return <DeckViewer id={id} />;
}
