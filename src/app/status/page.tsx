import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { StatusLookup } from "@/components/StatusLookup";
import { StatusIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Check ticket status | Helpdesk",
};

export default function StatusPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="w-24 h-24">
            <StatusIcon className="w-full h-full" />
          </div>
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Check ticket status
            </h1>
            <p className="text-sm text-black/60">
              Enter the ticket number you received, or leave it blank and
              enter your email instead to see all of your tickets.
            </p>
          </div>
        </div>
        <StatusLookup />
      </main>
    </>
  );
}
