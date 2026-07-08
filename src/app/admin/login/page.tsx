import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Admin login | Helpdesk",
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-1 flex-col justify-center px-6 py-12">
      <div className="mb-8 space-y-3 text-center">
        <Logo iconClassName="h-11 w-11" className="mx-auto" />
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin login
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Sobha Academy &amp; SKECT helpdesk
          </p>
        </div>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
