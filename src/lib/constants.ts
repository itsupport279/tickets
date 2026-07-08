export const ORGANIZATIONS = [
  { value: "SOBHA_ACADEMY", label: "Sobha Academy" },
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

export function generateReference(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
