import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-4">
        <Link href="/" className="whitespace-nowrap font-semibold tracking-tight">
          Sobha Academy &amp; SKECT{" "}
          <span className="text-black/50 dark:text-white/50">Helpdesk</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href="/submit" className="whitespace-nowrap hover:underline">
            Submit a ticket
          </Link>
          <Link href="/status" className="whitespace-nowrap hover:underline">
            Check status
          </Link>
          <Link
            href="/admin"
            className="whitespace-nowrap rounded-md border border-black/15 px-3 py-1.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
