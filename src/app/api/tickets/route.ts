import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTicketSchema } from "@/lib/validation";
import { generateReference, type OrganizationValue } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      requesterEmail: { equals: email, mode: "insensitive" },
      status: { not: "CLOSED" },
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

  const data = parsed.data;
  const organization = data.organization as OrganizationValue;

  let reference = generateReference(organization);
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await prisma.ticket.findUnique({ where: { reference } });
    if (!existing) break;
    reference = generateReference(organization);
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
