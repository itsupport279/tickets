import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  const ticket = await prisma.ticket.findUnique({
    where: { reference: reference.trim() },
    include: {
      notes: {
        orderBy: { createdAt: "asc" },
        select: { id: true, message: true, createdAt: true },
      },
    },
  });

  const emailMatches = !email || ticket?.requesterEmail.toLowerCase() === email;

  if (!ticket || !emailMatches) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({
    reference: ticket.reference,
    organization: ticket.organization,
    subject: ticket.subject,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    notes: ticket.notes,
  });
}

async function findOwnedTicket(reference: string, email: string | null) {
  if (!email) return null;

  const ticket = await prisma.ticket.findUnique({
    where: { reference: reference.trim() },
  });

  if (!ticket || ticket.requesterEmail.toLowerCase() !== email) {
    return null;
  }

  return ticket;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;

  const ticket = await findOwnedTicket(reference, email);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "CLOSED" },
  });

  return NextResponse.json({ status: updated.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() ?? null;

  const ticket = await findOwnedTicket(reference, email);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  await prisma.ticket.delete({ where: { id: ticket.id } });

  return NextResponse.json({ success: true });
}
