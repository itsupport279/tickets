"use client";

import { OrganizationSettings } from "@prisma/client";
import { FormEvent, useState } from "react";

interface EditOrganizationFormProps {
  organization: OrganizationSettings;
}

export function EditOrganizationForm({
  organization,
}: EditOrganizationFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    emailDomain: organization.emailDomain,
    referencePrefix: organization.referencePrefix,
    description: organization.description || "",
    isActive: organization.isActive,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `/api/admin/organizations/${organization.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update organization");
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
        Edit Settings
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black/80">
          Email Domain
        </label>
        <input
          type="text"
          value={formData.emailDomain}
          onChange={(e) =>
            setFormData({ ...formData, emailDomain: e.target.value })
          }
          className="mt-1 w-full rounded border border-black/15 px-3 py-2 text-sm"
          placeholder="example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black/80">
          Ticket Reference Prefix
        </label>
        <input
          type="text"
          value={formData.referencePrefix}
          onChange={(e) =>
            setFormData({ ...formData, referencePrefix: e.target.value })
          }
          maxLength={3}
          className="mt-1 w-full rounded border border-black/15 px-3 py-2 text-sm font-mono uppercase"
          placeholder="TSA"
        />
        <p className="mt-1 text-xs text-black/50">Max 3 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-black/80">
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 w-full rounded border border-black/15 px-3 py-2 text-sm"
          placeholder="Organization name or description"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm text-black/80">
          Active
        </label>
      </div>

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-green-50 p-3 text-sm text-green-700">
          Settings updated successfully
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
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
