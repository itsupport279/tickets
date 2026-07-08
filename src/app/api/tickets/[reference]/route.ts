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
