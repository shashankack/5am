"use client";

import Link from "next/link";

type FloatingCTAProps = {
  visible: boolean;
};

export function FloatingCTA({ visible }: FloatingCTAProps) {
  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-[110] flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pb-6",
        "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible
          ? "translate-y-0"
          : "pointer-events-none translate-y-[calc(100%+2rem)]",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="flex w-full max-w-xl items-center justify-between gap-6 rounded-xl bg-heading/8 py-1.5 pr-1.5 pl-5 shadow-sm backdrop-blur-sm md:gap-10 md:pl-6">
        <Link
          href="/"
          className="shrink-0 font-sans text-xs tracking-tight text-heading md:text-sm"
        >
          <span className="font-bold">5</span>amLabs.
        </Link>

        <Link
          href="/#inquiry"
          className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-heading px-4 py-2 text-bg transition-colors duration-150 ease-out hover:bg-bg hover:text-heading md:px-5 md:py-2.5"
        >
          <span
            className="size-1.5 shrink-0 rounded-full bg-bg transition-colors duration-150 ease-out group-hover:bg-heading md:size-2"
            aria-hidden
          />
          <span className="font-heading text-xs whitespace-nowrap md:text-sm">
            Become A Client
          </span>
        </Link>
      </div>
    </div>
  );
}
