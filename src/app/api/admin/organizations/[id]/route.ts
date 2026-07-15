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
    const updated = await prisma.organizationSettings.update({
      where: { id },
      data: {
        emailDomain: body.emailDomain || undefined,
        referencePrefix: body.referencePrefix
          ? body.referencePrefix.toString().toUpperCase().trim()
          : undefined,
        description: body.description || undefined,
        isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
