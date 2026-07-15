import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { AdminTicketForm } from "@/components/AdminTicketForm";
import { TicketIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "New ticket | Helpdesk",
};

export default async function AdminNewTicketPage() {
  const session = await auth();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-black/60 hover:underline">
        ← Back to dashboard
      </Link>
      <div className="mt-4 mb-8 flex flex-col items-center space-y-4">
        <div className="w-20 h-20">
          <TicketIcon className="w-full h-full" />
        </div>
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create a ticket
          </h1>
          <p className="text-sm text-black/60">
            Log a ticket on behalf of an employee.
          </p>
        </div>
      </div>
      <AdminTicketForm requesterUsername={session?.user.username ?? ""} />
    </main>
  );
}
