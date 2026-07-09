import type { Metadata } from "next";
import Link from "next/link";
import { AdminTicketForm } from "@/components/AdminTicketForm";

export const metadata: Metadata = {
  title: "New ticket | Helpdesk",
};

export default function AdminNewTicketPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-black/60 hover:underline">
        ← Back to dashboard
      </Link>
      <div className="mt-4 mb-8 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create a ticket
        </h1>
        <p className="text-sm text-black/60">
          Log a ticket on behalf of an employee.
        </p>
      </div>
      <AdminTicketForm />
    </main>
  );
}
