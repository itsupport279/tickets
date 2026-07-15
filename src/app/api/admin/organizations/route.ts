import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-super-admin";

const DEFAULT_STATUSES = [
  { value: "OPEN", label: "Open", isDefault: true, order: 1 },
  { value: "IN_PROGRESS", label: "In Progress", isDefault: false, order: 2 },
  { value: "RESOLVED", label: "Resolved", isDefault: false, order: 3 },
  { value: "CLOSED", label: "Closed", isDefault: false, order: 4 },
];

export async function POST(req: NextRequest) {
  const check = await requireSuperAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => null);

  if (!body || !body.organization || !body.emailDomain || !body.referencePrefix) {
    return NextResponse.json(
      { error: "Missing required fields: organization, emailDomain, referencePrefix" },
      { status: 400 },
    );
  }

  if (body.referencePrefix.length > 3) {
    return NextResponse.json(
      { error: "Reference prefix must be 3 characters or less" },
      { status: 400 },
    );
  }

  try {
    // Check if organization already exists
    const existing = await prisma.organizationSettings.findUnique({
      where: { organization: body.organization },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Organization already exists" },
        { status: 409 },
      );
    }

    // Create organization with default workflow statuses
    const org = await prisma.organizationSettings.create({
      data: {
        organization: body.organization,
        emailDomain: body.emailDomain,
        referencePrefix: body.referencePrefix.toUpperCase(),
        description: body.description || body.organization,
        isActive: true,
      },
    });

    // Create default statuses for the new organization
    const statuses = await Promise.all(
      DEFAULT_STATUSES.map((status) =>
        prisma.workflowStatus.create({
          data: {
            organizationSettingsId: org.id,
            statusValue: status.value,
            label: status.label,
            isDefault: status.isDefault,
            order: status.order,
          },
        }),
      ),
    );

    return NextResponse.json(
      { organization: org, statuses },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Creation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
