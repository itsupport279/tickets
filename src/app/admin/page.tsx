import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildTicketWhere } from "@/lib/ticket-filters";
import { orgLabel, priorityLabel } from "@/lib/constants";
import { TicketFilters } from "@/components/TicketFilters";
import { SignOutButton } from "@/components/SignOutButton";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = {
  title: "Admin dashboard | Helpdesk",
};

type SearchParams = {
  organization?: string;
  status?: string;
  priority?: string;
  search?: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  const where = buildTicketWhere(params);

  const [tickets, groupCounts, totalCount] = await Promise.all([
    prisma.ticket.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.ticket.groupBy({ by: ["organization"], _count: { _all: true } }),
    prisma.ticket.count(),
  ]);

  const orgCounts = Object.fromEntries(
    groupCounts.map((g) => [g.organization, g._count._all]),
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin dashboard
          </h1>
          <p className="text-sm text-black/60">
            {totalCount} ticket{totalCount === 1 ? "" : "s"} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
          >
            New ticket
          </Link>
          <Link
            href="/admin/reports"
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
          >
            Reports
          </Link>
          {isSuperAdmin && (
            <>
              <Link
                href="/admin/master"
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
              >
                Master Admin
              </Link>
              <Link
                href="/admin/admins"
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
              >
                Admins
              </Link>
              <Link
                href="/admin/logs"
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
              >
                Login logs
              </Link>
            </>
          )}
          <SignOutButton />
        </div>
      </div>

      <Suspense>
        <TicketFilters orgCounts={orgCounts} totalCount={totalCount} />
      </Suspense>

      <div className="mt-6 overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[.02] text-xs uppercase tracking-wide text-black/50">
            <tr>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Organization</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Requester</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-black/5 last:border-0 hover:bg-black/[.02]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/tickets/${ticket.id}`}
                    className="font-mono text-xs hover:underline"
                  >
                    {ticket.reference}
                  </Link>
                </td>
                <td className="px-4 py-3">{orgLabel(ticket.organization)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/tickets/${ticket.id}`}
                    className="hover:underline"
                  >
                    {ticket.subject}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div>{ticket.requesterName}</div>
                  {ticket.requesterEmail && (
                    <div className="text-xs text-black/50">
                      {ticket.requesterEmail}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{priorityLabel(ticket.priority)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3 text-black/60">
                  {ticket.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-black/50">
                  No tickets match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
