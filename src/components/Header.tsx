import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-4">
        <Link
          href="/"
          className="flex items-center whitespace-nowrap rounded-lg bg-white px-3 py-1.5"
        >
          <Image
            src="/sobha-logo.png"
            alt="Sobha"
            width={312}
            height={196}
            style={{ width: 80, height: "auto" }}
            priority
          />
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
            className="whitespace-nowrap rounded-md border border-black/15 px-3 py-1.5 hover:bg-black/5"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
