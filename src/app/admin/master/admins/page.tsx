import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateAdminForm } from "@/components/CreateAdminForm";
import { AdminOrgAssignmentForm } from "@/components/AdminOrgAssignmentForm";
import { AdminIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Admin Access | Master Admin",
};

export default async function AdminsPage() {
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

  const [admins, organizations] = await Promise.all([
    prisma.admin.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        organizations: { select: { organization: true, canManageAll: true } },
      },
    }),
    prisma.organizationSettings.findMany({
      orderBy: { organization: "asc" },
      select: { organization: true, description: true },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href="/admin/master" className="text-sm text-black/60 hover:underline">
        ← Back to Master Dashboard
      </Link>

      <div className="mt-4 mb-8 flex items-center gap-4">
        <div className="w-14 h-14">
          <AdminIcon className="w-full h-full" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Access Management
          </h1>
          <p className="text-sm text-black/60">
            {admins.length} admin account{admins.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Admin Accounts Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Admin Accounts</h2>
        <div className="overflow-x-auto rounded-lg border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[.02] text-xs uppercase tracking-wide text-black/50">
              <tr>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Organizations</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[.02]"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {admin.username}
                  </td>
                  <td className="px-4 py-3">{admin.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {admin.organizations.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {admin.organizations.map((org) => (
                          <span
                            key={org.organization}
                            className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                          >
                            {org.canManageAll
                              ? "All Organizations"
                              : org.organization}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-black/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {admin.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Admin */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Create New Admin Account</h2>
        <div className="rounded-lg border border-black/10 p-6">
          <CreateAdminForm />
        </div>
      </div>

      {/* Assign Organizations to Admins */}
      {admins.filter((a) => a.role !== "SUPER_ADMIN").length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Assign Organizations
          </h2>
          <div className="space-y-4">
            {admins
              .filter((a) => a.role !== "SUPER_ADMIN")
              .map((admin) => (
                <div
                  key={admin.id}
                  className="rounded-lg border border-black/10 p-6"
                >
                  <div className="mb-4">
                    <h3 className="font-medium">{admin.username}</h3>
                    <p className="text-sm text-black/60">
                      {admin.name ?? "No name provided"}
                    </p>
                  </div>
                  <AdminOrgAssignmentForm
                    admin={admin}
                    organizations={organizations}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
