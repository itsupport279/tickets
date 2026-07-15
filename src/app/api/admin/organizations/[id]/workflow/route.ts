import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireSuperAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (!body || !Array.isArray(body.statuses)) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    // Delete existing statuses
    await prisma.workflowStatus.deleteMany({
      where: { organizationSettingsId: id },
    });

    // Create new statuses
    const created = await Promise.all(
      body.statuses.map((status: any) =>
        prisma.workflowStatus.create({
          data: {
            organizationSettingsId: id,
            statusValue: status.statusValue,
            label: status.label,
            isDefault: status.isDefault || false,
            order: status.order || 0,
          },
        }),
      ),
    );

    return NextResponse.json({ statuses: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
