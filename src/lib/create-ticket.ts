import { prisma } from "@/lib/prisma";
import { generateReference, type OrganizationValue } from "@/lib/constants";
import type { createTicketSchema } from "@/lib/validation";
import type { z } from "zod";

type CreateTicketInput = z.infer<typeof createTicketSchema>;

export async function createTicketRecord(data: CreateTicketInput) {
  const organization = data.organization as OrganizationValue;

  let reference = generateReference(organization);
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await prisma.ticket.findUnique({ where: { reference } });
    if (!existing) break;
    reference = generateReference(organization);
  }

  return prisma.ticket.create({
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
}
