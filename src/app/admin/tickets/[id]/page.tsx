import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { orgLabel } from "@/lib/constants";
import { TicketActions } from "@/components/TicketActions";

export const metadata: Metadata = {
  title: "Ticket detail | Helpdesk",
};

export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { notes: { orderBy: { createdAt: "asc" } } },
  });

  if (!ticket) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-black/60 hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-sm text-black/60">
          {ticket.reference}
        </span>
        <span className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium">
          {orgLabel(ticket.organization)}
        </span>
      </div>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        {ticket.subject}
      </h1>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-black/50">Requester</dt>
          <dd>{ticket.requesterName}</dd>
        </div>
        <div>
          <dt className="text-black/50">Email</dt>
          <dd>{ticket.requesterEmail}</dd>
        </div>
        {ticket.phone && (
          <div>
            <dt className="text-black/50">Phone</dt>
            <dd>{ticket.phone}</dd>
          </div>
        )}
        {ticket.department && (
          <div>
            <dt className="text-black/50">Department</dt>
            <dd>{ticket.department}</dd>
          </div>
        )}
        <div>
          <dt className="text-black/50">Submitted</dt>
          <dd>{ticket.createdAt.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-black/50">Last updated</dt>
          <dd>{ticket.updatedAt.toLocaleString()}</dd>
        </div>
      </dl>

      <p className="mt-6 whitespace-pre-wrap rounded-lg border border-black/10 p-4 text-sm text-black/70">
        {ticket.description}
      </p>

      <div className="mt-8 border-t border-black/10 pt-6">
        <TicketActions
          ticketId={ticket.id}
          currentStatus={ticket.status}
          currentPriority={ticket.priority}
        />
      </div>

      {ticket.notes.length > 0 && (
        <div className="mt-8 space-y-3 border-t border-black/10 pt-6">
          <p className="text-sm font-medium">History</p>
          <ul className="space-y-3">
            {ticket.notes.map((note) => (
              <li key={note.id} className="rounded-lg bg-black/[.02] p-3 text-sm">
                <p className="text-black/70">{note.message}</p>
                <p className="mt-1 text-xs text-black/40">
                  {note.author} · {note.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
