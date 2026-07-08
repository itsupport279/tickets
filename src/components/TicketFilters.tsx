"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ORGANIZATIONS, PRIORITIES, STATUSES } from "@/lib/constants";

export function TicketFilters({
  orgCounts,
  totalCount,
}: {
  orgCounts: Record<string, number>;
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentOrg = searchParams.get("organization") ?? "ALL";
  const currentStatus = searchParams.get("status") ?? "ALL";
  const currentPriority = searchParams.get("priority") ?? "ALL";
  const currentSearch = searchParams.get("search") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <OrgTab
          label={`All organizations`}
          count={totalCount}
          active={currentOrg === "ALL"}
          onClick={() => updateParam("organization", "ALL")}
        />
        {ORGANIZATIONS.map((org) => (
          <OrgTab
            key={org.value}
            label={org.label}
            count={orgCounts[org.value] ?? 0}
            active={currentOrg === org.value}
            onClick={() => updateParam("organization", org.value)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={currentStatus}
          onChange={(e) => updateParam("status", e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={currentPriority}
          onChange={(e) => updateParam("priority", e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <input
          type="search"
          defaultValue={currentSearch}
          placeholder="Search subject, name, email, reference…"
          className={`${selectClass} min-w-[240px] flex-1`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("search", e.currentTarget.value);
            }
          }}
          onBlur={(e) => updateParam("search", e.currentTarget.value)}
        />
      </div>
    </div>
  );
}

const selectClass =
  "rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

function OrgTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
          : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      }`}
    >
      {label} <span className="opacity-60">({count})</span>
    </button>
  );
}
