import { statusLabel } from "@/lib/constants";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-500/10 text-blue-700",
  IN_PROGRESS: "bg-amber-500/10 text-amber-700",
  RESOLVED: "bg-green-500/10 text-green-700",
  CLOSED: "bg-black/10 text-black/60",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? "border border-black/15"}`}
    >
      {statusLabel(status)}
    </span>
  );
}
