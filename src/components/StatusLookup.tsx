"use client";

import { useState, type FormEvent } from "react";
import { orgLabel, priorityLabel, statusLabel } from "@/lib/constants";

type Note = { id: string; message: string; createdAt: string };
type Ticket = {
  reference: string;
  organization: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
};
type TicketSummary = {
  reference: string;
  organization: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
};

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; ticket: Ticket }
  | { status: "list"; tickets: TicketSummary[]; email: string }
  | { status: "error"; message: string };

export function StatusLookup() {
  const [state, setState] = useState<LookupState>({ status: "idle" });

  async function fetchSingle(reference: string, email: string) {
    setState({ status: "loading" });

    try {
      const res = await fetch(
        `/api/tickets/${encodeURIComponent(reference)}?email=${encodeURIComponent(email)}`,
      );

      if (!res.ok) {
        setState({
          status: "error",
          message:
            res.status === 404
              ? "No ticket found for that reference and email."
              : "Something went wrong. Please try again.",
        });
        return;
      }

      const ticket = await res.json();
      setState({ status: "found", ticket });
    } catch {
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  async function fetchOpenList(email: string) {
    setState({ status: "loading" });

    try {
      const res = await fetch(`/api/tickets?email=${encodeURIComponent(email)}`);

      if (!res.ok) {
        setState({
          status: "error",
          message: "Something went wrong. Please try again.",
        });
        return;
      }

      const data = await res.json();
      setState({ status: "list", tickets: data.tickets, email });
    } catch {
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reference = String(formData.get("reference") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (reference) {
      fetchSingle(reference, email);
    } else {
      fetchOpenList(email);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <input
          name="reference"
          placeholder="Reference (optional)"
          className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email used when submitting"
          className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="whitespace-nowrap rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          {state.status === "loading" ? "Checking…" : "Check status"}
        </button>
      </form>
      <p className="-mt-6 text-xs text-black/50 dark:text-white/50">
        Leave the reference blank to see all of your tickets that aren&apos;t
        closed yet.
      </p>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      {state.status === "list" && (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            {state.tickets.length === 0
              ? "No open tickets found for that email."
              : `${state.tickets.length} open ticket${state.tickets.length === 1 ? "" : "s"}`}
          </p>
          <ul className="space-y-2">
            {state.tickets.map((ticket) => (
              <li key={ticket.reference}>
                <button
                  type="button"
                  onClick={() => fetchSingle(ticket.reference, state.email)}
                  className="w-full rounded-lg border border-black/10 p-4 text-left text-sm hover:bg-black/[.02] dark:border-white/15 dark:hover:bg-white/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-black/60 dark:text-white/60">
                      {ticket.reference}
                    </span>
                    <span className="rounded-full border border-black/15 px-2.5 py-1 text-xs font-medium dark:border-white/20">
                      {statusLabel(ticket.status)}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">{ticket.subject}</p>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                    {orgLabel(ticket.organization)} ·{" "}
                    {priorityLabel(ticket.priority)} · submitted{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.status === "found" && (
        <div className="space-y-4 rounded-lg border border-black/10 p-6 dark:border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-sm text-black/60 dark:text-white/60">
              {state.ticket.reference}
            </span>
            <span className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium dark:border-white/20">
              {statusLabel(state.ticket.status)}
            </span>
          </div>

          <h2 className="text-lg font-semibold">{state.ticket.subject}</h2>
          <p className="whitespace-pre-wrap text-sm text-black/70 dark:text-white/70">
            {state.ticket.description}
          </p>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-black/50 dark:text-white/50">Organization</dt>
              <dd>{orgLabel(state.ticket.organization)}</dd>
            </div>
            <div>
              <dt className="text-black/50 dark:text-white/50">Priority</dt>
              <dd>{priorityLabel(state.ticket.priority)}</dd>
            </div>
            <div>
              <dt className="text-black/50 dark:text-white/50">Submitted</dt>
              <dd>{new Date(state.ticket.createdAt).toLocaleString()}</dd>
            </div>
          </dl>

          {state.ticket.notes.length > 0 && (
            <div className="space-y-2 border-t border-black/10 pt-4 dark:border-white/15">
              <p className="text-sm font-medium">Updates</p>
              <ul className="space-y-3">
                {state.ticket.notes.map((note) => (
                  <li key={note.id} className="text-sm">
                    <p className="text-black/70 dark:text-white/70">
                      {note.message}
                    </p>
                    <p className="mt-0.5 text-xs text-black/40 dark:text-white/40">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
