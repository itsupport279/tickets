import { z } from "zod";
import {
  ORGANIZATIONS,
  ORG_EMAIL_DOMAINS,
  PRIORITIES,
  STATUSES,
  emailDomain,
  type OrganizationValue,
} from "@/lib/constants";

const orgValues = ORGANIZATIONS.map((o) => o.value) as [string, ...string[]];
const priorityValues = PRIORITIES.map((p) => p.value) as [string, ...string[]];
const statusValues = STATUSES.map((s) => s.value) as [string, ...string[]];

export const createTicketSchema = z
  .object({
    organization: z.enum(orgValues),
    requesterName: z.string().trim().min(2, "Name is too short").max(120),
    requesterEmail: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    department: z.string().trim().max(120).optional().or(z.literal("")),
    subject: z.string().trim().min(3, "Subject is too short").max(200),
    description: z.string().trim().min(10, "Please add more detail").max(5000),
    priority: z.enum(priorityValues).default("MEDIUM"),
  })
  .superRefine((data, ctx) => {
    const expected = ORG_EMAIL_DOMAINS[data.organization as OrganizationValue];
    if (emailDomain(data.requesterEmail) !== expected) {
      ctx.addIssue({
        code: "custom",
        message: `Email must be a @${expected} address for the selected organization`,
        path: ["requesterEmail"],
      });
    }
  });

export const updateTicketSchema = z.object({
  status: z.enum(statusValues).optional(),
  priority: z.enum(priorityValues).optional(),
});

export const addNoteSchema = z.object({
  message: z.string().trim().min(1).max(3000),
});

export const createAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username is too short")
    .max(50)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, and _ . - are allowed"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  name: z.string().trim().max(120).optional().or(z.literal("")),
});
