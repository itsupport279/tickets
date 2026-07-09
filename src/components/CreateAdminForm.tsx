"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

export function CreateAdminForm() {
  const router = useRouter();
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      username: formData.get("username"),
      password: formData.get("password"),
      name: formData.get("name"),
    };

    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/admin/admins", {
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

      form.reset();
      setState({ status: "idle" });
      router.refresh();
    } catch {
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-black/10 p-6">
      <h2 className="text-sm font-semibold">Create a co-admin</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Username" htmlFor="username">
          <input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            className={inputClass}
            placeholder="jane"
          />
        </Field>
        <Field label="Name (optional)" htmlFor="name">
          <input id="name" name="name" type="text" className={inputClass} placeholder="Jane Doe" />
        </Field>
      </div>
      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      {state.status === "error" && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50"
      >
        {state.status === "submitting" ? "Creating…" : "Create co-admin"}
      </button>
      <p className="text-xs text-black/50">
        Co-admins can manage tickets and reports but can&apos;t create other
        admin accounts or view login logs.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40";

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
