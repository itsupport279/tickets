import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { TicketForm } from "@/components/TicketForm";

export const metadata: Metadata = {
  title: "Submit a ticket | Helpdesk",
};

export default function SubmitPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-8 space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Submit a ticket
          </h1>
          <p className="text-sm text-black/60">
            No account needed. You&apos;ll get a reference number to track
            your ticket.
          </p>
        </div>
        <TicketForm />
      </main>
    </>
  );
}
