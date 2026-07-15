"use client";

import { FormEvent, useState } from "react";

export function CreateOrganizationForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    organization: "",
    emailDomain: "",
    referencePrefix: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          organization: formData.organization.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create organization");
      }

      setSuccess("Organization created successfully!");
      setFormData({
        organization: "",
        emailDomain: "",
        referencePrefix: "",
        description: "",
      });
      setIsCreating(false);
      setTimeout(() => setSuccess(null), 3000);
      // Reload to show new organization
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Add New Organization
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-black/10 p-6">
      <h3 className="text-lg font-semibold">Create New Organization</h3>

      <div>
        <label className="block text-sm font-medium text-black/80">
          Organization Name *
        </label>
        <input
          type="text"
          value={formData.organization}
          onChange={(e) =>
            setFormData({ ...formData, organization: e.target.value.toUpperCase() })
          }
          className="mt-1 w-full rounded border border-black/15 px-3 py-2 text-sm font-mono"
          placeholder="e.g., NEW_ORGANIZATION"
          required
        />
        <p className="mt-1 text-xs text-black/50">
          Use uppercase with underscores (e.g., MY_COMPANY)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-black/80">
          Email Domain *
        </label>
        <input
          type="text"
          value={formData.emailDomain}
          onChange={(e) =>
            setFormData({ ...formData, emailDomain: e.target.value })
          }
          className="mt-1 w-full rounded border border-black/15 px-3 py-2 text-sm"
          placeholder="example.com"
          required
        />
        <p className="mt-1 text-xs text-black/50">
          Domain used for email validation
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-black/80">
          Ticket Reference Prefix *
        </label>
        <input
          type="text"
          value={formData.referencePrefix}
          onChange={(e) =>
            setFormData({ ...formData, referencePrefix: e.target.value.toUpperCase() })
          }
          maxLength={3}
          className="mt-1 w-full rounded border border-black/15 px-3 py-2 text-sm font-mono uppercase"
          placeholder="ORG"
          required
        />
        <p className="mt-1 text-xs text-black/50">
          Max 3 characters (e.g., ORG for ORG-123456)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-black/80">
          Description (Optional)
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 w-full rounded border border-black/15 px-3 py-2 text-sm"
          placeholder="e.g., My New Organization"
        />
      </div>

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Creating..." : "Create Organization"}
        </button>
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className="rounded border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
