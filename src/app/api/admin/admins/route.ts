import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSchema } from "@/lib/validation";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function GET() {
  const check = await requireSuperAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const check = await requireSuperAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => null);
  const parsed = createAdminSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid submission";
    return NextResponse.json(
      { error: message, details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.admin.findUnique({
    where: { username: parsed.data.username },
  });
  if (existing) {
    return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const admin = await prisma.admin.create({
    data: {
      username: parsed.data.username,
      passwordHash,
      name: parsed.data.name || null,
      role: "ADMIN",
    },
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json({ admin }, { status: 201 });
}
