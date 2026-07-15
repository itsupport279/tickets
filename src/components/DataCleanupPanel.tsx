"use client";

import { FormEvent, useState } from "react";

interface CleanupResult {
  type: string;
  message: string;
  count: number;
}

export function DataCleanupPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCleanup = async (type: string) => {
    if (
      !confirm(
        `Are you sure you want to run this cleanup?\n\n${getCleanupDescription(type)}\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/maintenance/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Cleanup failed");
      }

      const data = (await response.json()) as CleanupResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="rounded-lg border border-black/10 p-6">
      <h3 className="mb-4 text-lg font-semibold">Database Maintenance & Cleanup</h3>
      <p className="mb-6 text-sm text-black/60">
        Clean up orphaned and unwanted data from the database. These operations are
        safe and only remove records that reference deleted or inactive items.
      </p>

      <div className="space-y-3 mb-6">
        <CleanupButton
          label="Remove Orphaned Notes"
          description="Delete notes for tickets that no longer exist"
          type="orphaned_notes"
          onClick={() => handleCleanup("orphaned_notes")}
          isRunning={isRunning}
          color="blue"
        />
        <CleanupButton
          label="Remove Orphaned Login Logs"
          description="Delete login records for admin accounts that no longer exist"
          type="orphaned_login_logs"
          onClick={() => handleCleanup("orphaned_login_logs")}
          isRunning={isRunning}
          color="blue"
        />
        <CleanupButton
          label="Clean Inactive Organization Workflows"
          description="Delete workflow statuses from deactivated organizations"
          type="unused_workflow_statuses"
          onClick={() => handleCleanup("unused_workflow_statuses")}
          isRunning={isRunning}
          color="yellow"
        />
        <CleanupButton
          label="Fix Invalid Admin Assignments"
          description="Remove admin-organization assignments for deleted organizations"
          type="admin_org_cleanup"
          onClick={() => handleCleanup("admin_org_cleanup")}
          isRunning={isRunning}
          color="yellow"
        />
        <CleanupButton
          label="Run Full Cleanup"
          description="Execute all cleanup operations at once"
          type="full_cleanup"
          onClick={() => handleCleanup("full_cleanup")}
          isRunning={isRunning}
          color="red"
        />
      </div>

      {error && (
        <div className="rounded bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="rounded bg-green-50 p-4 text-sm text-green-700">
          <strong>Success:</strong> {result.message}
          {result.count > 0 && (
            <div className="mt-2 text-xs">
              Records removed: <span className="font-mono font-bold">{result.count}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CleanupButtonProps {
  label: string;
  description: string;
  type: string;
  onClick: () => void;
  isRunning: boolean;
  color: "blue" | "yellow" | "red";
}

function CleanupButton({
  label,
  description,
  type,
  onClick,
  isRunning,
  color,
}: CleanupButtonProps) {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600",
    yellow: "bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600",
    red: "bg-red-600 hover:bg-red-700 disabled:bg-red-600",
  };

  return (
    <div className="rounded border border-black/10 bg-black/[.02] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="font-medium text-black/80">{label}</div>
          <div className="mt-1 text-xs text-black/60">{description}</div>
        </div>
        <button
          onClick={onClick}
          disabled={isRunning}
          className={`rounded px-3 py-1.5 text-sm font-medium text-white ${colorClasses[color]} disabled:opacity-50`}
        >
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
}

function getCleanupDescription(type: string): string {
  const descriptions: Record<string, string> = {
    orphaned_notes:
      "This will delete notes that belong to tickets that no longer exist in the database.",
    orphaned_login_logs:
      "This will delete login records for admin accounts that have been deleted.",
    unused_workflow_statuses:
      "This will delete workflow status configurations from organizations that are marked as inactive.",
    admin_org_cleanup:
      "This will remove admin-organization assignments where the organization no longer exists.",
    full_cleanup:
      "This will run all cleanup operations and remove all orphaned and unused records.",
  };

  return descriptions[type] || "This cleanup operation will remove orphaned records.";
}
