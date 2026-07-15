"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ORGANIZATIONS, orgLabel, priorityLabel } from "@/lib/constants";
import {
  exportTicketsToPdf,
  exportTicketsToExcel,
  type ReportTicket,
} from "@/lib/report-export";
import { StatusBadge } from "@/components/StatusBadge";
import { ReportsIcon } from "@/components/Icons";

export default function ReportsPage() {
  const [organization, setOrganization] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tickets, setTickets] = useState<ReportTicket[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

  async function loadTickets(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (organization !== "ALL") params.set("organization", organization);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/admin/tickets/report?${params.toString()}`);
      if (!res.ok) {
        setError("Failed to load tickets.");
        return;
      }

      const data = await res.json();
      setTickets(data.tickets);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExport(format: "pdf" | "excel") {
    if (!tickets) return;
    setExporting(format);
    try {
      const meta = { organization, dateFrom, dateTo };
      if (format === "pdf") {
        await exportTicketsToPdf(tickets, meta);
      } else {
        await exportTicketsToExcel(tickets, meta);
      }
    } finally {
      setExporting(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14">
            <ReportsIcon className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Ticket reports</h1>
            <p className="text-sm text-black/60">
              Filter by organization and date range, then export as PDF or Excel.
            </p>
          </div>
        </div>
        <Link href="/admin" className="text-sm text-black/60 hover:underline">
          ← Back to dashboard
        </Link>
      </div>

      <form onSubmit={loadTickets} className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label htmlFor="organization" className="text-sm font-medium">
            Organization
          </label>
          <select
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className={selectClass}
          >
            <option value="ALL">All organizations</option>
            {ORGANIZATIONS.map((org) => (
              <option key={org.value} value={org.value}>
                {org.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dateFrom" className="text-sm font-medium">
            From
          </label>
          <input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={selectClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dateTo" className="text-sm font-medium">
            To
          </label>
          <input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={selectClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load tickets"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {tickets && (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {tickets.length} ticket{tickets.length === 1 ? "" : "s"} match
              {tickets.length === 1 ? "es" : ""} these filters
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                disabled={tickets.length === 0 || exporting !== null}
                className="rounded-md border border-black/15 px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50"
              >
                {exporting === "pdf" ? "Generating…" : "Download PDF"}
              </button>
              <button
                type="button"
                onClick={() => handleExport("excel")}
                disabled={tickets.length === 0 || exporting !== null}
                className="rounded-md border border-black/15 px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50"
              >
                {exporting === "excel" ? "Generating…" : "Download Excel"}
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-black/10">
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
                {tickets.map((t) => (
                  <tr key={t.reference} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{t.reference}</td>
                    <td className="px-4 py-3">{orgLabel(t.organization)}</td>
                    <td className="px-4 py-3">{t.subject}</td>
                    <td className="px-4 py-3">{t.requesterName}</td>
                    <td className="px-4 py-3">{priorityLabel(t.priority)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-black/50">
                      No tickets match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

const selectClass =
  "rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40";
