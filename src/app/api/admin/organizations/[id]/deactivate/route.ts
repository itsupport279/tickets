import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireSuperAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;

  try {
    const org = await prisma.organizationSettings.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Organization deactivated successfully",
      organization: org,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deactivation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
