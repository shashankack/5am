import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-bg px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex max-w-lg flex-col items-center gap-8 text-center">
        <p className="font-sans text-xs tracking-[0.25em] text-body uppercase">
          404
        </p>

        <h1 className="font-heading text-3xl leading-tight text-heading md:text-5xl">
          This page isn&apos;t in the cut.
        </h1>

        <p className="text-sm leading-relaxed text-body md:text-base">
          The frame you&apos;re looking for doesn&apos;t exist  or it&apos;s
          moved. Head back and keep exploring the work.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-heading px-5 py-2.5 font-heading text-xs text-bg transition-colors duration-150 ease-out hover:bg-bg hover:text-heading md:text-sm"
          >
            Back home
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center rounded-xl px-5 py-2.5 font-sans text-xs text-heading transition-colors duration-150 ease-out hover:text-body md:text-sm"
          >
            View work
          </Link>
        </div>
      </div>
    </main>
  );
}
