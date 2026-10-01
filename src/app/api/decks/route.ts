import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";

export async function GET() {
  const decks = await prisma.deck.findMany({
    orderBy: { createAt: "desc" },
    take: 12,
    include: { _count: { select: { slides: true } } },
  });
  return NextResponse.json(
    decks.map(({ _count, ...d }) => ({ id: d.id, idea: d.idea, title: d.title, status: d.status, createAt: d.createAt, slideCount: _count.slides }))
  );
}

export async function POST(req: Request) {
  const { idea } = (await req.json().catch(() => ({}))) as { idea?: string };
  const trimmed = idea?.trim() ?? "";
  if (trimmed.length < 20) {
    return NextResponse.json({ error: "Describe your idea in at least 20 characters." }, { status: 400 });
  }
  // errorMessage is a required String in schema.prisma, so we seed it with "".
  const deck = await prisma.deck.create({ data: { idea: trimmed, errorMessage: "" } });
  await inngest.send({ name: "deck/generate", data: { deckId: deck.id } });
  return NextResponse.json({ id: deck.id }, { status: 201 });
}
