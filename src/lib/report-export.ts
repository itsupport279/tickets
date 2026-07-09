import { orgLabel, priorityLabel, statusLabel } from "@/lib/constants";

export type ReportTicket = {
  reference: string;
  organization: string;
  requesterName: string;
  requesterEmail: string;
  phone: string | null;
  department: string | null;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ReportMeta = {
  organization: string;
  dateFrom: string;
  dateTo: string;
};

function reportTitle(meta: ReportMeta) {
  const org = meta.organization === "ALL" ? "All organizations" : orgLabel(meta.organization);
  const range =
    meta.dateFrom || meta.dateTo
      ? `${meta.dateFrom || "start"} to ${meta.dateTo || "now"}`
      : "All dates";
  return `Ticket Report — ${org} — ${range}`;
}

function fileTimestamp() {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
}

// Ticket fields come from the public, unauthenticated submit form. Excel
// (and other spreadsheet apps) treat a leading =, +, -, or @ as the start
// of a formula regardless of the cell's declared type, so a submitter
// could otherwise embed a formula (e.g. a HYPERLINK or DDE payload) that
// runs when an admin opens an exported report. Prefixing with a single
// quote forces spreadsheet apps to treat the value as literal text.
function sanitizeCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export async function exportTicketsToPdf(tickets: ReportTicket[], meta: ReportMeta) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape" });
  const title = reportTitle(meta);

  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleString()} — ${tickets.length} ticket(s)`, 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [["Reference", "Organization", "Requester", "Subject", "Priority", "Status", "Submitted"]],
    body: tickets.map((t) => [
      t.reference,
      orgLabel(t.organization),
      t.requesterName,
      t.subject,
      priorityLabel(t.priority),
      statusLabel(t.status),
      new Date(t.createdAt).toLocaleDateString(),
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [20, 20, 20] },
  });

  doc.save(`ticket-report-${fileTimestamp()}.pdf`);
}

export async function exportTicketsToExcel(tickets: ReportTicket[], meta: ReportMeta) {
  const ExcelJS = (await import("exceljs")).default;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sobha Academy, SKECT & Sobha Health Care Helpdesk";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Tickets");
  sheet.columns = [
    { header: "Reference", key: "reference", width: 16 },
    { header: "Organization", key: "organization", width: 18 },
    { header: "Requester", key: "requesterName", width: 20 },
    { header: "Email", key: "requesterEmail", width: 28 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Department", key: "department", width: 18 },
    { header: "Subject", key: "subject", width: 30 },
    { header: "Description", key: "description", width: 50 },
    { header: "Priority", key: "priority", width: 12 },
    { header: "Status", key: "status", width: 14 },
    { header: "Submitted", key: "createdAt", width: 20 },
    { header: "Last updated", key: "updatedAt", width: 20 },
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.autoFilter = { from: "A1", to: "L1" };

  for (const t of tickets) {
    sheet.addRow({
      reference: t.reference,
      organization: orgLabel(t.organization),
      requesterName: sanitizeCell(t.requesterName),
      requesterEmail: sanitizeCell(t.requesterEmail),
      phone: sanitizeCell(t.phone ?? ""),
      department: sanitizeCell(t.department ?? ""),
      subject: sanitizeCell(t.subject),
      description: sanitizeCell(t.description),
      priority: priorityLabel(t.priority),
      status: statusLabel(t.status),
      createdAt: new Date(t.createdAt).toLocaleString(),
      updatedAt: new Date(t.updatedAt).toLocaleString(),
    });
  }

  for (const column of sheet.columns) {
    column.alignment = { vertical: "top", wrapText: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ticket-report-${fileTimestamp()}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
