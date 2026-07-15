"use client";

import { useState, type FormEvent } from "react";
import {
  ORGANIZATIONS,
  ORG_EMAIL_DOMAINS,
  PRIORITIES,
  type OrganizationValue,
} from "@/lib/constants";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string };

export function TicketForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [organization, setOrganization] = useState<OrganizationValue | "">("");
  const expectedDomain = organization ? ORG_EMAIL_DOMAINS[organization] : null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      organization: (formData.get("organization") as string).toUpperCase(),
      requesterName: formData.get("requesterName"),
      requesterEmail: formData.get("requesterEmail"),
      phone: formData.get("phone"),
      department: formData.get("department"),
      subject: formData.get("subject"),
      description: formData.get("description"),
      priority: formData.get("priority"),
    };

    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setState({
          status: "error",
          message: data?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      const data = await res.json();
      setState({ status: "success", reference: data.reference });
      form.reset();
      setOrganization("");
    } catch {
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-black/10 bg-black/[.02] p-6 text-center">
        <p className="text-sm text-black/60">
          Ticket submitted successfully. Your ticket number is
        </p>
        <p className="mt-2 font-mono text-2xl font-semibold tracking-wide">
          {state.reference}
        </p>
        <p className="mt-3 text-sm text-black/60">
          Save this number — you&apos;ll need it to check the status of your
          ticket.
        </p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-5 rounded-md border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization" htmlFor="organization">
          <select
            id="organization"
            name="organization"
            required
            defaultValue=""
            onChange={(e) =>
              setOrganization(e.target.value as OrganizationValue | "")
            }
            className={selectClass}
          >
            <option value="" disabled>
              Select your organization
            </option>
            {ORGANIZATIONS.map((org) => (
              <option key={org.value} value={org.value}>
                {org.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority" htmlFor="priority">
          <select
            id="priority"
            name="priority"
            defaultValue="MEDIUM"
            className={selectClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="requesterName">
          <input
            id="requesterName"
            name="requesterName"
            type="text"
            required
            minLength={2}
            className={inputClass}
            placeholder="Jane Doe"
          />
        </Field>

        <Field label="Email" htmlFor="requesterEmail">
          <input
            id="requesterEmail"
            name="requesterEmail"
            type="email"
            required
            className={inputClass}
            placeholder={
              expectedDomain ? `jane@${expectedDomain}` : "jane@example.com"
            }
          />
          {expectedDomain && (
            <p className="text-xs text-black/50">
              Must be a @{expectedDomain} address
            </p>
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)" htmlFor="phone">
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </Field>

        <Field label="Department (optional)" htmlFor="department">
          <input
            id="department"
            name="department"
            type="text"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Subject" htmlFor="subject">
        <input
          id="subject"
          name="subject"
          type="text"
          required
          minLength={3}
          className={inputClass}
          placeholder="Short summary of the issue"
        />
      </Field>

      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={6}
          className={inputClass}
          placeholder="Describe the issue in detail"
        />
      </Field>

      {state.status === "error" && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="w-full rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50"
      >
        {state.status === "submitting" ? "Submitting…" : "Submit ticket"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40";
const selectClass = inputClass;

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
