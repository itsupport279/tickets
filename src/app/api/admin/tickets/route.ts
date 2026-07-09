import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildTicketWhere } from "@/lib/ticket-filters";
import { createTicketSchema } from "@/lib/validation";
import { createTicketRecord } from "@/lib/create-ticket";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const where = buildTicketWhere({
    organization: searchParams.get("organization"),
    status: searchParams.get("status"),
    priority: searchParams.get("priority"),
    search: searchParams.get("search"),
  });

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.ticket.groupBy({
    by: ["organization"],
    _count: { _all: true },
  });

  return NextResponse.json({ tickets, counts });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createTicketSchema.safeParse(body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid submission";
    return NextResponse.json(
      { error: message, details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const ticket = await createTicketRecord(parsed.data);

  return NextResponse.json({ reference: ticket.reference, id: ticket.id }, { status: 201 });
}
