import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { reference: reference.trim().toUpperCase() },
    include: {
      notes: {
        orderBy: { createdAt: "asc" },
        select: { id: true, message: true, createdAt: true },
      },
    },
  });

  if (!ticket || ticket.requesterEmail.toLowerCase() !== email) {
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
