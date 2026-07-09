export const ORGANIZATIONS = [
  { value: "SOBHA_ACADEMY", label: "Sobha Academy" },
  { value: "SKECT", label: "SKECT" },
] as const;

export type OrganizationValue = (typeof ORGANIZATIONS)[number]["value"];

export const ORG_EMAIL_DOMAINS: Record<OrganizationValue, string> = {
  SOBHA_ACADEMY: "thesobhaacademy.com",
  SKECT: "skect.in",
};

export function emailDomain(email: string): string {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

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

export const ORG_REFERENCE_PREFIX: Record<OrganizationValue, string> = {
  SOBHA_ACADEMY: "TSA",
  SKECT: "SKT",
};

export function generateReference(organization: OrganizationValue): string {
  const prefix = ORG_REFERENCE_PREFIX[organization];
  const number = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${number}`;
}
