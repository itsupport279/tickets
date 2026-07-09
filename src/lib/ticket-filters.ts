import type { Prisma } from "@prisma/client";

export type TicketFilters = {
  organization?: string | null;
  status?: string | null;
  priority?: string | null;
  search?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
};

export function buildTicketWhere(filters: TicketFilters): Prisma.TicketWhereInput {
  const where: Prisma.TicketWhereInput = {};

  if (filters.organization && filters.organization !== "ALL") {
    where.organization = filters.organization;
  }
  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters.priority && filters.priority !== "ALL") {
    where.priority = filters.priority;
  }

  const search = filters.search?.trim();
  if (search) {
    where.OR = [
      { subject: { contains: search } },
      { description: { contains: search } },
      { requesterName: { contains: search } },
      { requesterEmail: { contains: search } },
      { reference: { contains: search } },
    ];
  }

  const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const to = filters.dateTo ? new Date(filters.dateTo) : null;
  if ((from && !isNaN(from.getTime())) || (to && !isNaN(to.getTime()))) {
    where.createdAt = {};
    if (from && !isNaN(from.getTime())) {
      where.createdAt.gte = from;
    }
    if (to && !isNaN(to.getTime())) {
      const endOfDay = new Date(to);
      endOfDay.setHours(23, 59, 59, 999);
      where.createdAt.lte = endOfDay;
    }
  }

  return where;
}
