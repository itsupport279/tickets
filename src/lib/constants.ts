export const ORGANIZATIONS = [
  { value: "SABHA_ACADEMY", label: "Sabha Academy" },
  { value: "SKECT", label: "SKECT" },
] as const;

export type OrganizationValue = (typeof ORGANIZATIONS)[number]["value"];

export const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
] as const;

export type PriorityValue = (typeof PRIORITIES)[number]["value"];

export const STATUSES = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
] as const;

export type StatusValue = (typeof STATUSES)[number]["value"];

export function orgLabel(value: string): string {
  return ORGANIZATIONS.find((o) => o.value === value)?.label ?? value;
}

export function priorityLabel(value: string): string {
  return PRIORITIES.find((p) => p.value === value)?.label ?? value;
}

export function statusLabel(value: string): string {
  return STATUSES.find((s) => s.value === value)?.label ?? value;
}

const ORG_PREFIX: Record<string, string> = {
  SABHA_ACADEMY: "SA",
  SKECT: "SK",
};

export function generateReference(organization: string): string {
  const prefix = ORG_PREFIX[organization] ?? "TK";
  const now = new Date();
  const datePart =
    now.getFullYear().toString().slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}
