import { z } from "zod";
import { ORGANIZATIONS, PRIORITIES, STATUSES } from "@/lib/constants";

const orgValues = ORGANIZATIONS.map((o) => o.value) as [string, ...string[]];
const priorityValues = PRIORITIES.map((p) => p.value) as [string, ...string[]];
const statusValues = STATUSES.map((s) => s.value) as [string, ...string[]];

export const createTicketSchema = z.object({
  organization: z.enum(orgValues),
  requesterName: z.string().trim().min(2, "Name is too short").max(120),
  requesterEmail: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  department: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Subject is too short").max(200),
  description: z.string().trim().min(10, "Please add more detail").max(5000),
  priority: z.enum(priorityValues).default("MEDIUM"),
});

export const lookupTicketSchema = z.object({
  reference: z.string().trim().min(3),
  email: z.string().trim().email(),
});

export const updateTicketSchema = z.object({
  status: z.enum(statusValues).optional(),
  priority: z.enum(priorityValues).optional(),
});

export const addNoteSchema = z.object({
  message: z.string().trim().min(1).max(3000),
});
