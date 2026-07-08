"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
    >
      Sign out
    </button>
  );
}
