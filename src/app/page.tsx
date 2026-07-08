import Link from "next/link";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
        <Logo imageWidth={200} showTagline className="mx-auto" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/submit"
            className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/80"
          >
            Submit a ticket
          </Link>
          <Link
            href="/status"
            className="rounded-md border border-black/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5"
          >
            Check ticket status
          </Link>
        </div>
      </main>
    </>
  );
}
