import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin login | Helpdesk",
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-1 flex-col justify-center px-6 py-12">
      <div className="mb-8 space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Sobha Academy &amp; SKECT helpdesk
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
