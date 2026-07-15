"use client";

import { Admin } from "@prisma/client";
import { FormEvent, useState } from "react";

interface AdminWithOrgs extends Admin {
  organizations: Array<{ organization: string; canManageAll: boolean }>;
}

interface Organization {
  organization: string;
  description: string;
}

interface AdminOrgAssignmentFormProps {
  admin: AdminWithOrgs;
  organizations: Organization[];
}

export function AdminOrgAssignmentForm({
  admin,
  organizations,
}: AdminOrgAssignmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>(
    admin.organizations.map((o) => o.organization),
  );
  const [canManageAll, setCanManageAll] = useState(
    admin.organizations.some((o) => o.canManageAll),
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/admins/${admin.id}/organizations`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizations: canManageAll ? [] : selectedOrgs,
          canManageAll,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update assignments");
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
        Manage Organization Access
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="canManageAll"
          checked={canManageAll}
          onChange={(e) => {
            setCanManageAll(e.target.checked);
            if (e.target.checked) {
              setSelectedOrgs([]);
            }
          }}
          className="rounded"
        />
        <label htmlFor="canManageAll" className="text-sm text-black/80">
          Grant access to all organizations
        </label>
      </div>

      {!canManageAll && (
        <div>
          <label className="block text-sm font-medium text-black/80 mb-3">
            Select Organizations
          </label>
          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org.organization} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`org-${org.organization}`}
                  checked={selectedOrgs.includes(org.organization)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrgs([...selectedOrgs, org.organization]);
                    } else {
                      setSelectedOrgs(
                        selectedOrgs.filter((o) => o !== org.organization),
                      );
                    }
                  }}
                  className="rounded"
                />
                <label
                  htmlFor={`org-${org.organization}`}
                  className="text-sm text-black/80"
                >
                  {org.description}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-green-50 p-3 text-sm text-green-700">
          Access updated successfully
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Access"}
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
