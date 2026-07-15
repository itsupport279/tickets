import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "Master Admin Dashboard | Helpdesk",
};

export default async function MasterAdminPage() {
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Link href="/admin" className="text-sm text-black/60 hover:underline">
          ← Back to dashboard
        </Link>
        <p className="mt-6 text-sm text-black/60">
          Only the super admin can access the master dashboard.
        </p>
      </main>
    );
  }

  const [
    totalTickets,
    totalAdmins,
    organizations,
    recentTickets,
    orgStats,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.admin.count(),
    prisma.organizationSettings.findMany({ orderBy: { organization: "asc" } }),
    prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        reference: true,
        organization: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.ticket.groupBy({
      by: ["organization"],
      _count: { _all: true },
    }),
  ]);

  const orgCountMap = Object.fromEntries(
    orgStats.map((stat) => [stat.organization, stat._count._all]),
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Master Admin Dashboard
          </h1>
          <p className="text-sm text-black/60">
            System-wide configuration and monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
          >
            Back to Tickets
          </Link>
          <SignOutButton />
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <div className="text-sm text-black/60">Total Tickets</div>
          <div className="mt-2 text-3xl font-semibold">{totalTickets}</div>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <div className="text-sm text-black/60">Admin Accounts</div>
          <div className="mt-2 text-3xl font-semibold">{totalAdmins}</div>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <div className="text-sm text-black/60">Organizations</div>
          <div className="mt-2 text-3xl font-semibold">{organizations.length}</div>
        </div>
      </div>

      {/* Master Admin Controls */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Master Controls</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/master/organizations"
            className="rounded-lg border border-black/10 p-4 hover:bg-black/[.02]"
          >
            <div className="text-sm font-medium text-black/80">Organizations</div>
            <div className="mt-1 text-xs text-black/60">Manage org settings</div>
          </Link>
          <Link
            href="/admin/master/workflows"
            className="rounded-lg border border-black/10 p-4 hover:bg-black/[.02]"
          >
            <div className="text-sm font-medium text-black/80">Workflows</div>
            <div className="mt-1 text-xs text-black/60">Configure statuses</div>
          </Link>
          <Link
            href="/admin/master/admins"
            className="rounded-lg border border-black/10 p-4 hover:bg-black/[.02]"
          >
            <div className="text-sm font-medium text-black/80">Admin Access</div>
            <div className="mt-1 text-xs text-black/60">Manage admin users</div>
          </Link>
          <Link
            href="/admin/logs"
            className="rounded-lg border border-black/10 p-4 hover:bg-black/[.02]"
          >
            <div className="text-sm font-medium text-black/80">Audit Logs</div>
            <div className="mt-1 text-xs text-black/60">View login history</div>
          </Link>
        </div>
      </div>

      {/* Organizations Overview */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Organizations Overview</h2>
        <div className="overflow-x-auto rounded-lg border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[.02] text-xs uppercase tracking-wide text-black/50">
              <tr>
                <th className="px-4 py-3 font-medium">Organization</th>
                <th className="px-4 py-3 font-medium">Email Domain</th>
                <th className="px-4 py-3 font-medium">Prefix</th>
                <th className="px-4 py-3 font-medium">Tickets</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr
                  key={org.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[.02]"
                >
                  <td className="px-4 py-3 font-medium">{org.description}</td>
                  <td className="px-4 py-3 text-black/60">{org.emailDomain}</td>
                  <td className="px-4 py-3 font-mono text-xs">{org.referencePrefix}</td>
                  <td className="px-4 py-3">{orgCountMap[org.organization] ?? 0}</td>
                  <td className="px-4 py-3">
                    {org.isActive ? (
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Tickets</h2>
        <div className="overflow-x-auto rounded-lg border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[.02] text-xs uppercase tracking-wide text-black/50">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Organization</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-xs">{ticket.reference}</td>
                  <td className="px-4 py-3">{ticket.organization}</td>
                  <td className="px-4 py-3">{ticket.subject}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {ticket.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
