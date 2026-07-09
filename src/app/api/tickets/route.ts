import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTicketSchema } from "@/lib/validation";
import { createTicketRecord } from "@/lib/create-ticket";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      requesterEmail: { equals: email, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
    select: {
      reference: true,
      organization: true,
      subject: true,
      priority: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ tickets });
}

export async function POST(req: NextRequest) {
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

  return NextResponse.json(
    { reference: ticket.reference, id: ticket.id },
    { status: 201 },
  );
}
