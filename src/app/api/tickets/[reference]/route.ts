import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  const ticket = await prisma.ticket.findUnique({
    where: { reference: reference.trim().toUpperCase() },
    include: {
      notes: {
        orderBy: { createdAt: "asc" },
        select: { id: true, message: true, createdAt: true },
      },
    },
  });

  const emailMatches = !email || ticket?.requesterEmail?.toLowerCase() === email;

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Email verification required" },
      { status: 400 },
    );
  }

  const ticket = await prisma.ticket.findUnique({
    where: { reference: reference.trim().toUpperCase() },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (ticket.requesterEmail?.toLowerCase() !== email) {
    return NextResponse.json(
      { error: "Unauthorized to modify this ticket" },
      { status: 403 },
    );
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
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Email verification required" },
      { status: 400 },
    );
  }

  const ticket = await prisma.ticket.findUnique({
    where: { reference: reference.trim().toUpperCase() },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (ticket.requesterEmail?.toLowerCase() !== email) {
    return NextResponse.json(
      { error: "Unauthorized to delete this ticket" },
      { status: 403 },
    );
  }

  await prisma.ticket.delete({ where: { id: ticket.id } });

  return NextResponse.json({ success: true });
}
