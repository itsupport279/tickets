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
