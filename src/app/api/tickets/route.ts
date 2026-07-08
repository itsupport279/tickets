import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTicketSchema } from "@/lib/validation";
import { generateReference } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createTicketSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  let reference = generateReference(data.organization);
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await prisma.ticket.findUnique({ where: { reference } });
    if (!existing) break;
    reference = generateReference(data.organization);
  }

  const ticket = await prisma.ticket.create({
    data: {
      reference,
      organization: data.organization,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      phone: data.phone || null,
      department: data.department || null,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
    },
  });

  return NextResponse.json(
    { reference: ticket.reference, id: ticket.id },
    { status: 201 },
  );
}
