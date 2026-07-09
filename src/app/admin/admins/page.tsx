import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateAdminForm } from "@/components/CreateAdminForm";

export const metadata: Metadata = {
  title: "Manage admins | Helpdesk",
};

export default async function AdminAdminsPage() {
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Link href="/admin" className="text-sm text-black/60 hover:underline">
          ← Back to dashboard
        </Link>
        <p className="mt-6 text-sm text-black/60">
          Only the super admin can manage admin accounts.
        </p>
      </main>
    );
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-black/60 hover:underline">
        ← Back to dashboard
      </Link>
      <div className="mt-4 mb-8 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Admins</h1>
        <p className="text-sm text-black/60">
          {admins.length} admin account{admins.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mb-8 overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[.02] text-xs uppercase tracking-wide text-black/50">
            <tr>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{admin.username}</td>
                <td className="px-4 py-3">{admin.name ?? "—"}</td>
                <td className="px-4 py-3">
                  {admin.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}
                </td>
                <td className="px-4 py-3 text-black/60">
                  {admin.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateAdminForm />
    </main>
  );
}
