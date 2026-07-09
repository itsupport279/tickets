import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Login logs | Helpdesk",
};

const RETENTION_DAYS = 30;

export default async function AdminLogsPage() {
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link href="/admin" className="text-sm text-black/60 hover:underline">
          ← Back to dashboard
        </Link>
        <p className="mt-6 text-sm text-black/60">
          Only the super admin can view login logs.
        </p>
      </main>
    );
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const logs = await prisma.adminLoginLog.findMany({
    where: { createdAt: { gte: cutoff } },
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { role: true } } },
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-black/60 hover:underline">
        ← Back to dashboard
      </Link>
      <div className="mt-4 mb-8 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Login logs</h1>
        <p className="text-sm text-black/60">
          {logs.length} login{logs.length === 1 ? "" : "s"} in the last{" "}
          {RETENTION_DAYS} days
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[.02] text-xs uppercase tracking-wide text-black/50">
            <tr>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">IP address</th>
              <th className="px-4 py-3 font-medium">User agent</th>
              <th className="px-4 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{log.username}</td>
                <td className="px-4 py-3">
                  {log.admin.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}
                </td>
                <td className="px-4 py-3 text-black/60">{log.ipAddress ?? "—"}</td>
                <td className="max-w-xs truncate px-4 py-3 text-black/60">
                  {log.userAgent ?? "—"}
                </td>
                <td className="px-4 py-3 text-black/60">
                  {log.createdAt.toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-black/50">
                  No logins recorded in the last {RETENTION_DAYS} days.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
