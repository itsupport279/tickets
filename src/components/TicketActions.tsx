"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PRIORITIES, STATUSES } from "@/lib/constants";

export function TicketActions({
  ticketId,
  currentStatus,
  currentPriority,
}: {
  ticketId: string;
  currentStatus: string;
  currentPriority: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function updateTicket(field: "status" | "priority", value: string) {
    setError(null);
    const res = await fetch(`/api/admin/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    if (!res.ok) {
      setError("Failed to update ticket.");
      return;
    }

    startTransition(() => router.refresh());
  }

  async function handleAddNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!noteText.trim()) return;

    setError(null);
    const res = await fetch(`/api/admin/tickets/${ticketId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: noteText.trim() }),
    });

    if (!res.ok) {
      setError("Failed to add note.");
      return;
    }

    setNoteText("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Status</label>
          <select
            value={currentStatus}
            onChange={(e) => updateTicket("status", e.target.value)}
            disabled={isPending}
            className={selectClass}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Priority</label>
          <select
            value={currentPriority}
            onChange={(e) => updateTicket("priority", e.target.value)}
            disabled={isPending}
            className={selectClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleAddNote} className="space-y-2">
        <label htmlFor="note" className="text-sm font-medium">
          Add an internal note / update
        </label>
        <textarea
          id="note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={3}
          className={`${selectClass} w-full`}
          placeholder="Visible to the requester when they check ticket status"
        />
        <button
          type="submit"
          disabled={isPending || !noteText.trim()}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50"
        >
          Add note
        </button>
      </form>
    </div>
  );
}

const selectClass =
  "rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40";
