import Link from "next/link";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
        <div className="space-y-6">
          <Logo iconClassName="h-16 w-16" showTagline className="mx-auto" />
          <p className="mx-auto max-w-xl text-black/60 dark:text-white/60">
            Raise a support ticket as an employee of Sobha Academy or SKECT.
            Staff can view and filter tickets from both organizations in one
            place.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/submit"
            className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/85"
          >
            Submit a ticket
          </Link>
          <Link
            href="/status"
            className="rounded-md border border-black/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Check ticket status
          </Link>
        </div>
      </main>
    </>
  );
}
