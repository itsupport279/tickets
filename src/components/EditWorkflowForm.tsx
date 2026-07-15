"use client";

import { OrganizationSettings, WorkflowStatus } from "@prisma/client";
import { FormEvent, useState } from "react";

interface EditWorkflowFormProps {
  organization: OrganizationSettings & { workflowStatuses: WorkflowStatus[] };
}

const AVAILABLE_STATUSES = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "PENDING", label: "Pending" },
  { value: "ON_HOLD", label: "On Hold" },
];

export function EditWorkflowForm({ organization }: EditWorkflowFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statuses, setStatuses] = useState(
    organization.workflowStatuses.length > 0
      ? organization.workflowStatuses
      : AVAILABLE_STATUSES.map((s) => ({
          id: s.value,
          organizationSettingsId: organization.id,
          statusValue: s.value,
          label: s.label,
          isDefault: s.value === "OPEN",
          order: AVAILABLE_STATUSES.findIndex((a) => a.value === s.value) + 1,
          createdAt: new Date(),
        })),
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `/api/admin/organizations/${organization.id}/workflow`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statuses }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update workflow");
      }

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        Configure Workflow
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black/80 mb-3">
          Status Workflow
        </label>
        <div className="space-y-2">
          {statuses.map((status, index) => (
            <div
              key={status.statusValue}
              className="flex items-center gap-3 rounded bg-black/[.02] p-3"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={status.label}
                  onChange={(e) => {
                    const updated = [...statuses];
                    updated[index] = { ...status, label: e.target.value };
                    setStatuses(updated);
                  }}
                  className="w-full rounded border border-black/15 px-2 py-1 text-sm"
                  placeholder="Status label"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={status.isDefault}
                  onChange={(e) => {
                    const updated = statuses.map((s) => ({
                      ...s,
                      isDefault: s.statusValue === status.statusValue && e.target.checked,
                    }));
                    setStatuses(updated);
                  }}
                  className="rounded"
                />
                <span className="text-xs text-black/60">Default</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setStatuses(
                    statuses.filter((s) => s.statusValue !== status.statusValue),
                  )
                }
                className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-green-50 p-3 text-sm text-green-700">
          Workflow updated successfully
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Workflow"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
