import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildTicketWhere } from "@/lib/ticket-filters";

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
    dateFrom: searchParams.get("dateFrom"),
    dateTo: searchParams.get("dateTo"),
  });

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      reference: true,
      organization: true,
      requesterName: true,
      requesterEmail: true,
      phone: true,
      department: true,
      subject: true,
      description: true,
      priority: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ tickets });
}
