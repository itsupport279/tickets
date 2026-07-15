import { prisma } from "@/lib/prisma";
import { generateReference, type OrganizationValue } from "@/lib/constants";
import type { createTicketSchema, createAdminTicketSchema } from "@/lib/validation";
import type { z } from "zod";

type CreateTicketInput =
  | z.infer<typeof createTicketSchema>
  | z.infer<typeof createAdminTicketSchema>;

export async function createTicketRecord(data: CreateTicketInput) {
  const organization = data.organization as OrganizationValue;

  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = generateReference(organization);

    try {
      return await prisma.ticket.create({
        data: {
          reference,
          organization: data.organization,
          requesterName: data.requesterName,
          requesterEmail: data.requesterEmail || null,
          phone: data.phone || null,
          department: data.department || null,
          subject: data.subject,
          description: data.description,
          priority: data.priority,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint failed")
      ) {
        if (attempt < 4) continue;
        throw new Error("Failed to generate unique ticket reference");
      }
      throw error;
    }
  }

  throw new Error("Failed to generate unique ticket reference");
}
