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

  if (!body) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    // Delete existing assignments
    await prisma.adminOrganization.deleteMany({ where: { adminId: id } });

    // Create new assignments
    if (body.canManageAll) {
      // If managing all, create a single entry marking that
      const created = await prisma.adminOrganization.create({
        data: {
          adminId: id,
          organization: "*",
          canManageAll: true,
        },
      });
      return NextResponse.json({ assignments: [created] });
    } else if (Array.isArray(body.organizations) && body.organizations.length > 0) {
      // Otherwise create entries for each selected org
      const created = await Promise.all(
        body.organizations.map((org: string) =>
          prisma.adminOrganization.create({
            data: {
              adminId: id,
              organization: org,
              canManageAll: false,
            },
          }),
        ),
      );
      return NextResponse.json({ assignments: created });
    }

    return NextResponse.json({ assignments: [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
