import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireSuperAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;

  try {
    // Get organization to check if it exists
    const org = await prisma.organizationSettings.findUnique({
      where: { id },
      select: { organization: true, _count: { select: { workflowStatuses: true } } },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    // Delete workflow statuses first (due to foreign key)
    await prisma.workflowStatus.deleteMany({
      where: { organizationSettingsId: id },
    });

    // Delete admin organization assignments
    await prisma.adminOrganization.deleteMany({
      where: { organization: org.organization },
    });

    // Delete organization settings
    await prisma.organizationSettings.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Organization deleted successfully. Existing tickets remain accessible.",
      organization: org.organization,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deletion failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
