import type { Prisma } from "@prisma/client";

export type TicketFilters = {
  organization?: string | null;
  status?: string | null;
  priority?: string | null;
  search?: string | null;
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

  return where;
}
