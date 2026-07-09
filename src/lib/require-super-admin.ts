import { auth } from "@/auth";

export async function requireSuperAdmin() {
  const session = await auth();
  if (!session) {
    return { ok: false as const, status: 401 as const, error: "Unauthorized" };
  }
  if (session.user.role !== "SUPER_ADMIN") {
    return { ok: false as const, status: 403 as const, error: "Forbidden" };
  }
  return { ok: true as const, session };
}
