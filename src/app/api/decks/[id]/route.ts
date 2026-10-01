import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const deck = await prisma.deck.findUnique({
    where: { id },
    include: { slides: { orderBy: { order: "asc" } } },
  });
  if (!deck) return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  return NextResponse.json({
    id: deck.id,
    idea: deck.idea,
    title: deck.title,
    status: deck.status,
    createAt: deck.createAt,
    errorMessage: deck.errorMessage,
    slides: deck.slides.map((s) => ({ id: s.id, order: s.order, title: s.title, content: s.content, imageUrl: s.imageUrl })),
  });
}
